import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  loginViaAuth(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('auth/logout')
  logoutViaAuth() {
    return this.authService.logout();
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }
}
