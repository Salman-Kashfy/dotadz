import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {column, beforeSave, hasMany, HasMany, BaseModel} from '@ioc:Adonis/Lucid/Orm'

import UserRole from "App/Models/UserRole";

export default class User extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public email: string

    @column({ serializeAs: null })
    public password: string

    @column({ serializeAs: null })
    public otp: number

    @column()
    public phone: string

    @column({ serializeAs: null })
    public stripe_customer_id: string

    @column({ serializeAs: null })
    public social_platform: string

    @column({ serializeAs: null })
    public client_id: string

    @column()
    public is_social_login: boolean

    @column()
    public image: string

    @column()
    public rememberMeToken: string

    @column()
    public is_verified: boolean

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @beforeSave()
    public static async hashPassword (user: User) {
        if (user.$dirty.password) {
            user.password = await Hash.make(user.password)
        }
    }

    @hasMany(() => UserRole)
    public userRoles: HasMany<typeof UserRole>



}