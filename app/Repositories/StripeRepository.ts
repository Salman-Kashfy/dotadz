import BaseRepository from "App/Repositories/_BaseRepository";
import User from "App/Models/User";
import Env from '@ioc:Adonis/Core/Env'
import {Stripe} from "stripe"

class StripeRepository extends BaseRepository{
    public model:any
    public stripe:any
    private static instance: StripeRepository

    constructor() {
        const relations = []
        super(User, relations)
        this.model = User
        // @ts-ignore
        this.stripe = new Stripe(Env.get('STRIPE_SECRET'))

    }

    static getInstance() {
        if(!StripeRepository.instance){
            StripeRepository.instance = new StripeRepository()
        }
        return StripeRepository.instance
    }

    async addCustomer(email:string) {
        return await this.stripe.customers.create({
            email: email
        });
    }

    async addCard(customer_id:string, payment_method:string) {
        const paymentMethod = await this.stripe.paymentMethods.attach(
            payment_method,
            {customer: customer_id}
        );
        await this.stripe.customers.update(
            customer_id,
            {invoice_settings: {default_payment_method: paymentMethod.id}}
        );
        return paymentMethod;
    }

    async chargeCard(customer_id:string, payment_method_id:string, amount:number) {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            payment_method_types: ['card'],
            payment_method: payment_method_id,
            customer: customer_id
        });
        return await this.stripe.paymentIntents.confirm(
            paymentIntent.id,
            {payment_method: payment_method_id}
        );
    }

    async createPaymentIntent(customer_id, payment_method_id, amount) {
        return await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            payment_method_types: ['card'],
            payment_method: payment_method_id,
            customer: customer_id
        });
    }

    async confirmPaymentIntent(payment_intent, payment_method_id) {
        return await this.stripe.paymentIntents.confirm(
            payment_intent,
            {payment_method: payment_method_id}
        );
    }

    async chargeThroughConnectedAccount(connected_account_id, amount) {
        return await this.stripe.charges.create({
            amount: Math.round(amount * 100),
            currency: "usd",
            source: connected_account_id
        });
    }

    async createAccountLink(user_id) {
        const account = await this.stripe.accounts.create({
            type: 'express'
        });
        const accountLink = await this.stripe.accountLinks.create({
            account: account.id,
            refresh_url: Env.get('APP_URL') + '/return-connect-account-failure' + "?user_id=" + user_id,
            return_url: Env.get('APP_URL') + '/return-connect-account' + "?user_id=" + user_id +
                "&account_id=" + account.id,
            type: 'account_onboarding',
        });
        return {account: account, account_link: accountLink}
    }

    async getAccountInfo(account_id) {
        return await this.stripe.accounts.retrieve(
            account_id
        );
    }

    async payout(amount, connect_account_id) {
        return await this.stripe.transfers.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            destination: connect_account_id
        });
    }

    async refund(amount, payment_intent) {
        return await this.stripe.refunds.create({
            amount: Math.round(amount * 100),
            payment_intent: payment_intent,
        });
    }

    async getBalance() {
        return await this.stripe.balance.retrieve();
    }

}
export default StripeRepository.getInstance()