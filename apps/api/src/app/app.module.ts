import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PersonService } from '@becoming-german/api-lib';
import 'uuid';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [{ provide: PersonService, useClass: PersonService }],
})
export class AppModule {}
