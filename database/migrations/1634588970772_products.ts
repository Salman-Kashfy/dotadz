import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
    protected tableName = 'products'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('vendor_id').unsigned().references('id').inTable('vendors').notNullable().onDelete('cascade')
            table.string('name',50)
            table.string('description',250)
            table.decimal('cost_price')
            table.decimal('selling_price')
            table.enum('type',['simple','variable'])
            table.string('sku')
            table.integer('qty')
            table.decimal('avg_rating')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
