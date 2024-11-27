import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserRegisterRequest } from '../dto/user.dto';

@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async register(@Body() request: UserRegisterRequest): Promise<any> {
    await this.userService.register(request);
    return {
      message: 'User registered successfully',
    };
  }
}
