import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppBaseController from "App/Controllers/Http/AppBaseController";
import {constants} from "Config/constants";
import UserCardRepository from "App/Repositories/UserCardRepository";
import Helper from "App/Helpers/Helper";
import AddUserCardValidator from "App/Validators/AddUserCardValidator";

export default class UserCardController extends AppBaseController{
    //Get all records
    async index({request,auth,response}:HttpContextContract) {

        /*Accept optional params
        * orderBy = col
        * sortBy = asc or desc
        * limit = int
        * offset = int
        * */
        let { user }:any = auth
        let offset = request.input('page', 1)
        let limit = request.input('limit', constants.PER_PAGE)
        let orderBy = request.input('orderBy', 'id')
        let sortBy = request.input('sortBy', 'desc')
        let input:any = {}
        input.user_id = user.id
        let res = await UserCardRepository.index(input,offset,limit,orderBy,sortBy)
        return response.json(this.globalResponse(true, "Record fetched successfully!", res))
    }

    //Show single record
    async show({request,response}:HttpContextContract) {
        let params:any = request.params()
        const res = await UserCardRepository.show(params.id)
        return response.json(this.globalResponse(true, "Record fetched successfully!", res))
    }

    //Save a record
    async store({request,response}:HttpContextContract) {
        try {
            await request.validate(AddUserCardValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        let input = request.only(UserCardRepository.model.fillable)
        let res = await UserCardRepository.store(input)
        return response.json(this.globalResponse(true, "Record created successfully!", res))
    }

    //Update a record
    async update({request,response}:HttpContextContract) {
        let params:any = request.params()
        const input = request.only(UserCardRepository.model.fillable)
        let res = await UserCardRepository.update(params.id, input)
        if (!res){
            return response.json(this.globalResponse(false, "Record not found!"))
        }else{
            return response.json(this.globalResponse(true, "Record updated successfully!", res))
        }
    }

    /*Delete a record*/
    async destroy({request,auth,response}:HttpContextContract) {

        let { user }:any = auth
        let params:any = request.params()
        let card = await UserCardRepository.model.find(params.id)
        if(!card){
            return response.json(this.globalResponse(false, "Record not found!"))
        }

        var belonging = await Helper.checkBelonging(UserCardRepository.model.table,'user_id',{id:params.id},user.id)
        if(!belonging){
            return response.json(this.globalResponse(false, "Card does not belong to this user!"))
        }

        await UserCardRepository.destroy(params.id)
        return response.json(this.globalResponse(true, "Record deleted successfully!"))
    }
}
