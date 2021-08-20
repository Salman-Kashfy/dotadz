import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
    protected tableName = 'users'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('name',35).notNullable()
            table.string('email',100).notNullable()
            table.string('password', 180).notNullable()
            table.string('phone',20).nullable()
            table.float('wallet',20).nullable()
            table.float('rating',5).nullable()
            table.text('image').nullable()
            table.boolean('is_verified').defaultTo(0)
            table.string('remember_me_token').nullable()
            table.timestamps();
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
