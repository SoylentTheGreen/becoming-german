import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ChildhoodProfileRequestTableC, PersonService, UpdateResult } from '@becoming-german/api-lib';
import * as t from 'io-ts';
import { flow } from 'fp-ts/function';
import { fold, isRight } from 'fp-ts/Either';
import { ChildhoodProfile } from '@becoming-german/model';
import { PathReporter } from 'io-ts/PathReporter';
import { Observable, Subject } from 'rxjs';
import { Response as ExResp } from 'express';
import { NumberFromStringOrNumber, numberInRange } from '@becoming-german/tools';

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

  constructor(private readonly service: PersonService) {}

  @Get('hello')
  hello() {
    return 'hello world!';
  }

  @Get('admin/profiles/:offset?/:limit?')
  async getData(@Param() params: GetRec) {
    const { offset, limit } = getParamParser({ ...defaultParams, ...params });
    return this.service.getNormalizedData(offset, limit);
  }

  @Post('request')
  async getChildhoodRequest(@Body() request: unknown) {
    const profile = ChildhoodProfile.decode(request);
    if (isRight(profile)) {
      const table = ChildhoodProfileRequestTableC.decode(profile.right);
      if (isRight(table)) {
        return this.service.findMatchingItem(table.right);
      }
      else throw PathReporter.report(table);
    }
    console.log('decoding profile did not work', console);
    throw PathReporter.report(profile);
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
        response.end()
      },
      error: (e) => {
        console.error(e);
        response.end()
      }
    });
  }
}
