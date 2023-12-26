import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    const databaseUserName =
      this.configService.get<string>('DATABASE_USER_NAME');
    const databasePassword = this.configService.get<string>('DATA_PASSWORD');
    const databaseHost = this.configService.get<string>('DATABASE_HOST');
    const databaseName = this.configService.get<string>('DATABASE_NAME');
    const envType = this.configService.get<string>('NODE_ENV');
    if (envType === 'local') {
      return {
        uri: 'mongodb+srv://Hims_21:Himansu21@cluster0.cmigdgz.mongodb.net/test',
      };
    }
    console.log('REMOTE DATABASE NAME ==> espento_local_scratch');

    const uri = `mongodb+srv://${databaseUserName}:${databasePassword}@${databaseHost}/${databaseName}`;
    return {
      uri,
    };
  }
}
