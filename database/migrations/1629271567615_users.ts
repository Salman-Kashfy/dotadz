import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
    protected tableName = 'users'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('name',35).notNullable()
            table.string('email',100).unique().notNullable()
            table.string('password', 180).notNullable()
            table.string('phone',20).nullable()
            table.string('stripe_customer_id',250).nullable()
            table.string('social_platform',25).nullable()
            table.string('client_id',250).nullable()
            table.string('connect_account_id',250).nullable()
            table.boolean('is_social_login').nullable()
            table.text('image').nullable()
            table.string('remember_me_token').nullable()
            table.boolean('is_verified').defaultTo(0)
            table.timestamps();
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
