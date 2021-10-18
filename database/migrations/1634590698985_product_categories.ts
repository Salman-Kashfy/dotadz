import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductCategories extends BaseSchema {
    protected tableName = 'product_categories'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('product_id').unsigned().references('id').inTable('products').notNullable().onDelete('cascade')
            table.integer('vendor_id').unsigned().references('id').inTable('vendors').notNullable().onDelete('cascade')
            table.integer('attribute_id').unsigned().references('id').inTable('attributes').notNullable().onDelete('cascade')
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
