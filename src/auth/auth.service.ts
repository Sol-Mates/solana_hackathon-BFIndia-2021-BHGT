import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt'
@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async validateUser(params:{username: string, pass: string}): Promise<any> {
    const user = await this.userService.findOne({...params});
    if (user && user.length) {
      const hash = user[0].password
      const isMatch = await bcrypt.compare(params.pass, hash);
      if(!isMatch){
        return null
      }
      const { password, ...result } = user[0];
      return result;
    }
    return null;
  }

  async login(user: any) {
    let payload = await this.validateUser({username:user.username, pass: user.password})
    if(payload){
      payload = { username: payload.username, id: payload.id };
      return {
        access_token: this.jwtService.sign(payload),
        userId: payload.id
      };
    }else{
      throw Error("Please enter valid username or password")
    }
  }
}