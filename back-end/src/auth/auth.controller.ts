import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service'; // usa ruta relativa

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService, // 👈 inyectamos correctamente
  ) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; username: string }) {
    return this.authService.register(body.email, body.password, body.username);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // 👇 ejemplo de ruta protegida (requiere token)
  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  async findAll() {
    return this.userService['userRepo'].find();
  }
}
