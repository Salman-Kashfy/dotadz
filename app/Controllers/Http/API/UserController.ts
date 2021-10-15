// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppBaseController from "App/Controllers/Http/AppBaseController";

import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import ChangePasswordValidator from "App/Validators/ChangePasswordValidator";
import StripeRepository from "App/Repositories/StripeRepository";
import UserRepository from "App/Repositories/UserRepository";
import Hash from "@ioc:Adonis/Core/Hash";

export default class UserController extends AppBaseController{

    async changePassword({request, auth, response}: HttpContextContract) {
        let { user }:any = auth
        let input:any
        try {
            input = await request.validate(ChangePasswordValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        if(! await Hash.verify(user.password,input.current_password)){
            return response.json({status: false, message: "Invalid current password."})
        }

        user.password = request.input('password')
        await user.save()
        return response.json({status: true, message: "Password Changed Successfully"})
    }

    public async profile({auth}: HttpContextContract){
        let { user }:any = auth
        return this.sendResponse(user,"Profile Retrieved Successfully!")
    }

    public async connectAccountSuccess({request, view}: HttpContextContract) {
        let input = request.only(['user_id', 'account_id'])
        if (input.hasOwnProperty('user_id') && input.hasOwnProperty('account_id')) {
            let account = await StripeRepository.getAccountInfo(input.account_id)
            if (account.details_submitted) {
                await UserRepository.model.query().where('id', input.user_id).update({connect_account_id: input.account_id})
            }
        }
        return view.render('payment-success')
    }

    public async connectAccountFailure({request, view}: HttpContextContract) {
        let input = request.only(['user_id'])
        if (input.hasOwnProperty('user_id')) {
            await UserRepository.model.query().where('id', input.user_id).update({connect_account_id: null})
        }
        return view.render('payment-failure')
    }
}
