import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChildhoodProfileTable, PersonService } from '@becoming-german/api-lib';
import * as t from 'io-ts';
import { flow } from 'fp-ts/function';
import { fold, isRight } from 'fp-ts/Either';
import { ChildhoodProfile, NumberFromStringOrNumber, NumberInRange } from '@becoming-german/model';
import { PathReporter } from 'io-ts/PathReporter';


const getReqC = t.type({
  offset: NumberFromStringOrNumber,
  limit: NumberInRange(1, 500),
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
  constructor(private readonly service: PersonService) {}

  @Get('admin/profiles/:offset?/:limit?')
  async getData(@Param() params: GetRec) {
    const { offset, limit } = getParamParser({ ...defaultParams, ...params });
    return this.service.getData(offset, limit);
  }

  @Post('request')
  async getChildhoodRequest(@Body() request: unknown) {
    const profile = ChildhoodProfile.decode(request);
    if (isRight(profile)) {
      const table = ChildhoodProfileTable.decode(profile.right);
      if (isRight(table)) {
        return this.service.findMatchingItem(table.right);
      }
    }
    console.log('decoding profile did not work');
    throw PathReporter.report(profile);
  }
}
