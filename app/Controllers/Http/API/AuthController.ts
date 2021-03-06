import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppBaseController from "App/Controllers/Http/AppBaseController";
import RegisterValidator from "App/Validators/RegisterValidator";
import User from "App/Models/User";
import Helper from "App/Helpers/Helper";
import UserHelper from "App/Helpers/UserHelper";
import VerifyEmail from "App/Mailers/VerifyEmail";
import OtpRepository from "App/Repositories/OtpRepository";
import ResendSignupOtpValidator from "App/Validators/ResendSignupOtpValidator";
import VerifyEmailValidator from "App/Validators/VerifyEmailValidator";
import LoginValidator from "App/Validators/LoginValidator";
import ResetPassword from "App/Mailers/ResetPassword";
import ResetPasswordValidator from "App/Validators/ResetPasswordValidator";
import UserRepository from "App/Repositories/UserRepository";
import RoleHelper from "App/Helpers/RoleHelper";
import Role from "App/Models/Role";
import StripeRepository from "App/Repositories/StripeRepository";
import ForgotPasswordValidator from "App/Validators/ForgotPasswordValidator";
import VerifyOtpValidator from "App/Validators/VerifyOtpValidator";
import SocialLoginValidator from "App/Validators/SocialLoginValidator";

export default class AuthController extends AppBaseController{

    public async signup( { response, request }: HttpContextContract ){

        let input:any
        try {
            input = await request.validate(RegisterValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        /*
        * Delete user if unverified
        *  */
        let user = await User.findBy('email', input.email)
        if(user){
            if (user.is_verified) {
                return this.sendError('Email already exist.');
            }else{
                await user.delete()
            }
        }

        /*
        * Create user
        *  */
        user = await UserRepository.store(request.only(User.fillables))
        if(!user){
            return this.sendError('Failed to register user.')
        }

        const code = UserHelper.generateOTP(user.id, user.email)

        /*
        * Assign user role
        *  */
        await user.related('userRoles').create({
            roleId: input.account_type
        })

        /*
        * Create user device
        *  */
        if(input.device_type && input.device_token)
        await UserHelper.setUserDevice(user.id, input.device_type, input.device_token);

        /*
        * Send verification email
        *  */
        const subject = 'Please verify your email address.'
        await new VerifyEmail(user, code, subject).sendLater()
        return this.sendResponse({user: user},"An OTP has been sent to your email address")
    }

    public async resend_signup_otp( { response,request }: HttpContextContract ) {
        try {
            await request.validate(ResendSignupOtpValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        const input = request.all();

        /*
        * Delete any old/expired tokens for current user
        * */
        await OtpRepository.model.query().where('email', input.email).delete();
        let user = await UserRepository.model.findBy('email', input.email);
        if(user){

            /*
            * Generate fresh token
            *  */
            const code:number = UserHelper.generateOTP(user.id,user.email);

            /*
            * Send verification email
            *  */
            const subject:string = 'Please verify your email address.'
            await new VerifyEmail(user, code, subject).sendLater()
            return this.sendResponse({user: user},"An OTP has been sent to your email address")
        }else{
            return this.sendError('User not found.')
        }
    }

    public async verify_email( { response,request }: HttpContextContract ){
        try {
            await request.validate(VerifyEmailValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        const input = request.all();

        /*
        * Verify if OTP is valid and not expired
        * */
        let otpMinTime:any = Helper.getOtpMinTime();
        let otp:any = await OtpRepository.model.query().where('email', input.email).where('code', input.code).where('created_at', '>=',otpMinTime).orderBy('created_at','desc').first();
        if(!otp){
            return this.sendError('OTP not found or is expired.')
        }

        let user = await UserRepository.model.find(otp.user_id)
        if(!user){
            return this.sendError('User not found.')
        }

        /*
        * If OTP is valid. Add a customer in stripe for role: user.
        * */
        if (await RoleHelper.has_role(user,Role.USER)) {
            let customer = await StripeRepository.addCustomer(user.email)
            user.stripe_customer_id = customer.id
            await user.save()
        }
        user.is_verified = true
        if( !await user.save() ){
            return this.sendError('Failed to verify user. Please try again.')
        }

        /*
        * Delete OTP after successful verification .
        * */
        otp.delete()
        return this.sendResponse({user:user},'OTP verified successfully !')
    }

    public async login( { response, auth, request }: HttpContextContract ){

        let input:any
        try {
            input = await request.validate(LoginValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        let user = await User.findBy('email', input.email)
        if(user){
            let token
            try {
                token = await auth.use('api').attempt(input.email, input.password)
            } catch {
                return this.sendError('Invalid credentials.')
            }

            if (user.is_verified) {
                return this.sendResponse({user:user,token:token},'Logged in successfully !')
            }else{
                await auth.use('api').revoke()
                return this.sendError('Email not verified. Please verify your email.')
            }
        }

        return input;
    }

    async socialLogin({request, auth, response}: HttpContextContract) {
        let input:any
        try {
            input = await request.validate(SocialLoginValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        /*
        * If user email is not found, we create a user record and mark it social login.
        * */
        let user = await UserRepository.findSocialLogin(request)
        if (user == null) {
            user = await UserRepository.model.findBy('email',request.input('email'));
            if (user == null) {
                user = await UserRepository.socialLogin(request)
            } else {
                return response.status(403).json({status: false, message: "Email already exists"})
            }
        }

        /*
        * Assign user role
        *  */
        await user.related('userRoles').create({
            roleId: input.account_type
        })

        if(input.device_type && input.device_token){
            await user.devices().create({device_type:input.device_type, device_token:input.device_token});
        }

        /*
        * Add a customer in stripe for role: user.
        * */
        if (!user.stripe_customer_id && await RoleHelper.has_role(user,Role.USER)) {
            let customer = await StripeRepository.addCustomer(user.email)
            user.stripe_customer_id = customer.id
            await user.save()
        }
        const token = await auth.use('api').generate(user)
        return this.sendResponse({user:user,token:token},'Logged in successfully !')
    }

    async forgotPassword({request,response}: HttpContextContract) {

        let input:any
        try {
            input = await request.validate(ForgotPasswordValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        let user = await UserRepository.model.findBy('email',input.email);
        if (!user) {
            return this.sendError('User not found.')
        }
        await OtpRepository.model.query().where('email', user.email).delete();

        /*
        * Send verification email
        *  */
        const code:number = UserHelper.generateOTP(user.id,user.email)
        const subject = 'Reset Password OTP'
        await new ResetPassword(user, code, subject).sendLater()
        return this.sendResponse({user: user},"An OTP has been sent to your email address")
    }

    async verifyOtp({request, response}) {
        let input:any
        try {
            input = await request.validate(VerifyOtpValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        /*
        * Verify if OTP is valid and not expired
        * */
        let otpMinTime:any = Helper.getOtpMinTime();
        let otp = await OtpRepository.model.query().where('email', input.email).where('code', input.code).where('created_at', '>=',otpMinTime).orderBy('created_at','desc').first();
        if(otp){
            return this.sendResponse(true, "OTP is valid.")
        }else{
            return this.sendResponse(false, "OTP not found is expired.")
        }
    }

    public async reset_password( { response,request }: HttpContextContract ){

        let input
        try {
            input = await request.validate(ResetPasswordValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        /*
        * Verify if OTP is valid and not expired
        * */
        let otpMinTime = Helper.getOtpMinTime();
        let otp = await OtpRepository.model.query().where('email', input.email).where('code', input.code).where('created_at', '>=',otpMinTime).orderBy('created_at','desc').first();

        /*
        * Reset password and delete OTP
        * */
        if(otp){
            let user = await User.find(otp.user_id)
            if(user){
                user.password = input.password
                if( !await user.save() ){
                    return this.sendError('Failed to update password. Please try again.')
                }
                otp.delete()
                return this.sendResponse({user:user},'Password updated successfully !')
            }
            return this.sendError('User not found.')
        }else{
            return this.sendError('OTP not found or is expired.')
        }
    }

    public async logout({auth}:HttpContextContract){
        await auth.use('api').revoke()
        return this.sendResponse({revoked:true},'Logged out successfully !')
    }

}
