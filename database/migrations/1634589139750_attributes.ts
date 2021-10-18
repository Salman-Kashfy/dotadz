import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Attributes extends BaseSchema {
    protected tableName = 'attributes'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('name',50)
            table.string('display_name',50)
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
