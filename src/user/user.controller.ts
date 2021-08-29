import { Controller, Post, Inject, Body, Request, UseGuards, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('user')
export class UserController {

    @Inject()
    private userService: UserService


    @Get('getActiveCoupleInfo/:userId')
    async findIfUserActiveCouple(@Param() param){
        await this.userService.findIfUserActiveCouple({userId: param.userId})
    }

    @Get('fetchUserInfo/:userId')
    async fetchUserInfo(@Param() param){
        await this.userService.findOne({userId: param.userId, withoutPassword:true})
    }

    @Post('dummy')
    async saveDummyUsers(){
        await this.userService.saveTempUsers()
    }

    @Post('signup')
    async registerUser(@Body() user: UserDto){
        return this.userService.saveUser(user)
    }

    @UseGuards(JwtAuthGuard)
    @Get('isAuthenticated')
    async isAuthenticated(@Request() req){
        return req.user
    }

    @UseGuards(JwtAuthGuard)
    @Get('generateInviteCode')
    async generateInviteCode(@Request() req){
        return this.userService.generateInviteCode(req.user)
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('joinInvite/:invitedCode')
    async joinInviteController(@Request() req, @Param() param){
        return this.userService.joinInviteService(req.user, param.invitedCode)
    }

    @UseGuards(JwtAuthGuard)
    @Post('saveProfile')
    async saveProfile(@Request() req, @Body() body){
        return this.userService.saveProfile(req.user, body)
    }

    @UseGuards(JwtAuthGuard)
    @Get('fetchCoupleInfo')
    async fetchCoupleInfo(@Request() req){
        return this.userService.coupleInfo(req.user)
    }
}
