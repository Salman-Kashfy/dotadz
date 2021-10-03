import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserCard extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public user_id: number

    @column()
    public payment_method_id: string

    @column()
    public last_four: number

    @column()
    public brand: string

    @column()
    public country: string

    @column()
    public exp_month: number

    @column()
    public exp_year: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static fillable = ['id','user_id','payment_method_id','last_four','brand','country','exp_month','exp_year','created_at','updated_at',]
}
