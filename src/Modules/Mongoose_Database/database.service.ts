import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BooleanSchemaDefinition } from 'mongoose';

@Injectable()
export class MongooseService {
  constructor() {}
  getHello(): string {
    return 'Hello World from mongoose service!';
  }
}
