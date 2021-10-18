import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Variants extends BaseSchema {
    protected tableName = 'variants'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('name', 50)
            table.integer('vendor_id').unsigned().references('id').inTable('vendors').notNullable().onDelete('cascade')
            table.integer('attribute_id').unsigned().references('id').inTable('attributes').notNullable().onDelete('cascade')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
