import { Body, Controller, Get, HttpException, Param, Post, Res } from '@nestjs/common';
import { ChildhoodProfileRequestTableC, MyRepo, PersonService, UpdateResult } from '@becoming-german/api-lib';
import * as t from 'io-ts';
import { flow, pipe } from 'fp-ts/function';
import { fold, isRight } from 'fp-ts/Either';
import {
  AggregateEvent,
  ChildhoodAggregate,
  ChildhoodSituationC,
  MatchingProfileRequestC,
} from '@becoming-german/model';
import { PathReporter } from 'io-ts/PathReporter';
import { Observable, Subject } from 'rxjs';
import { Response as ExResp } from 'express';
import { NumberFromStringOrNumber, numberInRange } from '@becoming-german/tools';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { AggregateState } from '../../../../libs/becoming-german-model/src/lib/model/childhood-aggregate';

const getReqC = t.type({
  offset: NumberFromStringOrNumber,
  limit: numberInRange(1, 500),
});
type GetRec = t.TypeOf<typeof getReqC>;
const decodeOrDefault = <T>(c: t.Type<T>, def: T) =>
  flow(
    c.decode,
    fold(
      () => def,
      (v) => v,
    ),
  );
const defaultParams = { offset: 0, limit: 10 };
const getParamParser = decodeOrDefault(getReqC, defaultParams);

@Controller()
export class AppController {
  private results = new Subject<UpdateResult[]>();
  private repo = MyRepo.getRepository();

  constructor(private readonly service: PersonService) {}

  @Get('hello')
  hello() {
    return 'hello world!';
  }

  @Get('admin/profiles/:offset?/:limit?')
  async getData(@Param() params: GetRec) {
    const { offset, limit } = getParamParser({ ...defaultParams, ...params });
    return this.service.getData(offset, limit);
  }

  @Post('donate')
  async createProfile(@Body() request: unknown) {
    const result = await pipe(
      ChildhoodAggregate.newState,
      ChildhoodAggregate.create(request),
      (r): O.Option<AggregateEvent> => r[0],
      TE.fromOption(() => new HttpException('Invalid request payload', 400)),
      TE.chain(this.repo.save),
      TE.mapLeft((e) => new HttpException(e.message, 500)),
    )();

    if (E.isLeft(result)) throw result.left;
    return result.right;
  }

  @Post('/:id/addItem')
  async addItem(@Body() request: unknown, @Param() params: { id: string }) {
    const id = params.id;
    const rows = await pipe(
      this.repo.findByAggregateId(params.id),
      TE.map((rows) => pipe(E.left({ version: 0, state: null }), ChildhoodAggregate.build(rows))),
      TE.chain((result) =>
        pipe(
          result[1],
          E.toUnion,
          (state: AggregateState<unknown>) =>
            pipe(Object.assign({}, request, { id }), ChildhoodAggregate.addItem(state.version + 1))(result[1]),
          (secondResult) => secondResult[0],
          TE.fromOption(() => new Error('no valid events')),
          TE.chain(this.repo.save),
        ),
      ),
    )();
    return E.isLeft(rows) ? new HttpException(rows.left.message, 500) : rows.right;
  }

  @Get('/read/:id')
  async getChildhood(@Param() params: {id: string}) {
    return await pipe(
      this.repo.findByAggregateId(params.id),
      TE.map(flow(ChildhoodAggregate.fromEvents, E.toUnion, agg => agg.state)),
      TE.toUnion
    )();

  }

  @Post('request')
  async getChildhoodRequest(@Body() request: unknown) {
    const res = await pipe(
      request,
      MatchingProfileRequestC.decode,
      E.chain(ChildhoodProfileRequestTableC.decode),
      E.mapLeft(() => new HttpException('Failed to parse request', 400)),
      TE.fromEither,
      TE.chain((profile) => this.service.findMatchingItem(profile)),
      TE.toUnion
    )();
    console.log(res);
    return res;
  }

  @Get('admin/migrate')
  migrate(@Res() response: ExResp) {
    const gen = this.service.normalise(0, 100);
    response.setHeader('Content-Type', 'application/json');

    const createFrom = (asyncCollection: () => AsyncIterableIterator<UpdateResult[]>): Observable<UpdateResult[]> => {
      return new Observable<UpdateResult[]>((subscriber) => {
        (async () => {
          try {
            for await (const value of asyncCollection()) {
              subscriber.next(value);
              // if(value[value.length-1].id > 100) break;
            }
            subscriber.complete();
            console.log('subscription completed');
          } catch (err) {
            subscriber.error(err);
          }
        })();
      });
    };

    createFrom(gen).subscribe({
      next: (rows) => response.write(JSON.stringify(rows)),
      complete: () => {
        console.log('complete has been called on migration');
        response.end();
      },
      error: (e) => {
        console.error(e);
        response.end();
      },
    });
  }
}
