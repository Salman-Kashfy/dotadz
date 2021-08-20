import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserRole extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public user_id: number

    @column()
    public role_id: number
}
