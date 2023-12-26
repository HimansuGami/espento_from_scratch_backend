import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly _adminService: AdminService) {}

  @Get('/admin')
  getHello(): string {
    return this._adminService.getHello();
  }
}
