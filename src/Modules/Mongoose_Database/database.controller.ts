import { Controller, Get } from '@nestjs/common';
import { MongooseService } from './database.service';

@Controller()
export class MongooseController {
  constructor(private readonly _mongooseService: MongooseService) {}

  @Get('/hello')
  getHello(): string {
    return this._mongooseService.getHello();
  }
}
