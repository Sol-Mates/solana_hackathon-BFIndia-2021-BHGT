import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from '@nestjsplus/knex';
import { tableNames } from 'src/shared/constants/dbtables';
import { ICoupleCurrencyInfo, UserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserQueries {
    constructor(@Inject(KNEX_CONNECTION) private readonly knex) {}

    async getUsers(): Promise<string> {
        return this.knex(tableNames.USER).select('*');
    }


    async getUser(options: object|any): Promise<User[]>{
        const {username, userId,isActive}= options;
        const query = this.knex(tableNames.USER).select(['id','name', 'gender','password', 'age', 'email', 'username'])
        
        if(username){
            query.where('username',username)
        }

        if(userId){
            query.where('id',userId)
        }
        

        
        if(isActive !== undefined){
            query.leftJoin(`${tableNames.COUPLE_INFO} as coupleInfo`, function () {
                this.on('coupleInfo.first_partner', '=', `${tableNames.USER}.id`).orOn('coupleInfo.second_partner','=', `${tableNames.USER}.id`)
            })
            query.select('first_partner', 'second_partner')
            query.where('coupleInfo.isActive',isActive)
        }
        // query.leftJoin(`${tableNames.COUPLE_INFO} as coupleInfo2`, function () {
        //     this.on('coupleInfo2.second_partner', '=', `${tableNames.USER}.id`)
        // })
        return query
    }

    async saveUser(user: UserDto | UserDto[]): Promise<string> {
        try{
            return this.knex(tableNames.USER).insert(user)
        }catch(err){
            throw Error(err)
        }
    }

    async saveProfile(profileObj: ICoupleCurrencyInfo): Promise<any>{
        try{
            return this.knex(tableNames.USER).insert(profileObj)
        }catch(err){
            throw Error(err)
        }
    }

}
