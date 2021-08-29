import { Controller, UseGuards, Post, Request, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { ApplicationLoggerService } from 'src/logger/logger.service';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService, private applicationLoggerService: ApplicationLoggerService){
        this.applicationLoggerService.setContext("Auth Controller")
    }

    @Post('login')
    async login(@Request() req){
        return this.authService.login(req.body);
    }
}
