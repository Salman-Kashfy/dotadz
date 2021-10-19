// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {constants} from 'Config/constants'
import {LucidModel} from '@ioc:Adonis/Lucid/Orm'

export default class _BaseRepository {
    model
    relations

    constructor(model: LucidModel, relations) {
        this.model = model
        this.relations = relations
    }

    async index(
        orderByColumn = constants.ORDER_BY_COLUMN,
        orderByValue = constants.ORDER_BY_VALUE,
        page = 1,
        perPage = constants.PER_PAGE,
    ) {
        let query = this.model.query().orderBy(orderByColumn, orderByValue)
        for (let relation of this.relations) await query.preload(relation)
        return await query.paginate(page, perPage)
    }

    async store(input) {
        return await this.model.create(input)
    }

    async update(id: number, input) {
        let row = await this.model.findOrFail(id)
        return await row.merge(input).save()
    }

    async destroy(id: number) {
        return this.model.query().where('id', id).delete()
    }

    protected fillables() {
        return Object.values(this.model.$keys.attributesToColumns.keys)
    }
}
