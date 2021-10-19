import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Product extends BaseModel {

    @column({ isPrimary: true })
    public id: number

    @column()
    public vendor_id: number

    @column()
    public name: string

    @column()
    public description: string

    @column()
    public cost_price: number

    @column()
    public selling_price: number

    @column()
    public type: string

    @column()
    public sku: string

    @column()
    public qty: number

    @column()
    public avg_rating: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
