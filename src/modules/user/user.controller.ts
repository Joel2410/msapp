import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from 'src/decorators';
import { UserDTO } from './dtos';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: UserDTO) {
    return this.userService.findOneById(user.userId, true);
  }
}
