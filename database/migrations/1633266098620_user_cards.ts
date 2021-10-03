import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserCards extends BaseSchema {
    protected tableName = 'user_cards'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.increments()
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
            table.string('payment_method_id',255).notNullable()
            table.integer('last_four').notNullable()
            table.string('brand').notNullable()
            table.string('country').notNullable()
            table.integer('exp_month').notNullable()
            table.integer('exp_year').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
