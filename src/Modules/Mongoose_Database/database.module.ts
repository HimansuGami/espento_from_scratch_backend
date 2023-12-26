import { Module } from '@nestjs/common';
import { MongooseController } from './database.controller';
import { MongooseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from 'src/mongoose.config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
  ],
  controllers: [MongooseController],
  providers: [MongooseService],
  exports: [MongooseModule],
})
export class DatabaseModule {}
