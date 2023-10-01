import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getProfile(@Request() req: { user: { sub: number } }) {
    return this.userService.findOne(req.user.sub, true);
  }
}
