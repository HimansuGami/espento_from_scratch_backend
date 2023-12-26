import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface JwtConfig {
  'JWT.JWT_SECRET': string;
  'JWT.JWT_EXPIRE_IN': string;
}

@Injectable()
export class AdminService {
  constructor(private readonly _configService: ConfigService<JwtConfig>) {
    const jwt_token = this._configService.get<string>('JWT.JWT_EXPIRE_IN');
    console.log(jwt_token);
  }
  getHello(): string {
    return 'Hello World from admin service!';
  }
}
