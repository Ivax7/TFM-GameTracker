import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; username: string }) {
    return this.authService.register(body.email, body.password, body.username);
  }

  @Post('login')
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    console.log('LOGIN DATA:', email, password);
    return this.authService.login(email, password);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  async findAll() {
    return this.userService['userRepo'].find();
  }
}
