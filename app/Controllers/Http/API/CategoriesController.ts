import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppBaseController from "App/Controllers/Http/AppBaseController";
import CategoryRepository from "App/Repositories/CategoryRepository";
import {constants} from "Config/constants";
import AddCategoryValidator from "App/Validators/AddCategoryValidator";

export default class CategoriesController extends AppBaseController{
    async index({request}:HttpContextContract) {
        let offset = request.input('page', 1)
        let limit = request.input('limit', constants.PER_PAGE)
        let orderBy = request.input('orderBy', 'id')
        let sortBy = request.input('sortBy', 'desc')
        let res = await CategoryRepository.index(request,offset,limit,orderBy,sortBy)
        return this.globalResponse(true, "Record fetched successfully!", res)
    }

    async store({request,response}:HttpContextContract){
        let input:any
        try {
            input = await request.validate(AddCategoryValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }
        let record:any = await CategoryRepository.store(input)
        if(!record){
            return this.globalResponse(false,"Something went wrong. Please try again!")
        }
        return this.globalResponse(true,"Record created successfully!",record)
    }

    async update({request,response}:HttpContextContract){
        let input:any
        try {
            input = await request.validate(AddCategoryValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }
        input.parent_id = input.parent_id ? input.parent_id : null
        let record:any = await CategoryRepository.update(request.param('id'),input)
        if(!record){
            return this.globalResponse(false,"Something went wrong. Please try again!")
        }
        return this.globalResponse(true,"Record updated successfully!",record)
    }

    async destroy({request, response}: HttpContextContract) {
        let record:any = await CategoryRepository.model.find(request.param('id'))
        if(!record){
            return this.globalResponse(false,"Record not found!",null)
        }
        await CategoryRepository.destroy(request.param('id'))
        return this.globalResponse(response,true,"Record deleted successfully!")
    }


}
