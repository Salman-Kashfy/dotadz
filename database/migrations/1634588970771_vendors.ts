import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Vendors extends BaseSchema {
    protected tableName = 'vendors'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.string('name',50)
            table.text('logo')
            table.decimal('avg_rating').defaultTo(0)
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
