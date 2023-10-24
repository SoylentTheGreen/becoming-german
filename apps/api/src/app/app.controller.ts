import { Controller, Get } from '@nestjs/common';
import { PersonService } from '@becoming-german/api-lib';

@Controller()
export class AppController {
  constructor(private readonly service: PersonService) {}

  @Get()
  async getData() {
    return this.service.getData();
  }
}
