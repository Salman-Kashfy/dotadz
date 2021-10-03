// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppBaseController from "App/Controllers/Http/AppBaseController";
import StripeRepo from "App/Repositories/StripeRepository";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import UserRepo from "App/Repositories/UserRepository";
import UserCardRepo from "App/Repositories/UserCardRepository";
import AddStripeCardValidator from "App/Validators/AddStripeCardValidator";

export default class StripeController extends AppBaseController{

    async addCustomer({request}: HttpContextContract) {
        let userData:any = request.input('userData')
        let customer = await StripeRepo.addCustomer(userData.email)
        await UserRepo.model.query().where('id', userData.id).update({
            stripe_customer_id: customer.id
        })
        return this.globalResponse(true, "Customer created successfully", customer)
    }

    async addCard({request, auth, response}: HttpContextContract) {
        try {
            await request.validate(AddStripeCardValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        let { user }:any = auth
        let payment_method = await StripeRepo.addCard(user.stripe_customer_id, request.input('payment_method'));
        let user_card = await UserCardRepo.store({
            user_id: user.id,
            payment_method_id: payment_method.id,
            last_four: payment_method.card.last4,
            brand: payment_method.card.brand,
            country: payment_method.card.country,
            exp_month: payment_method.card.exp_month,
            exp_year: payment_method.card.exp_year,
        })
        if (request.input('apple_pay', null)) {
            let payment_intent = await StripeRepo.createPaymentIntent(user.stripe_customer_id, user_card.payment_method_id, 0.5);
            user_card.client_secret = payment_intent.client_secret
        } else {
            user_card.client_secret = null
        }

        return this.globalResponse(true, "Card added successfully", user_card)
    }

    async createAccountLink({auth}: HttpContextContract) {
        let { user }:any = auth
        let data:any = await StripeRepo.createAccountLink(user.id)
        return this.globalResponse(true, "Link generated successfully", data.account_link)
    }
    
}
