import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import { schema, rules } from '@ioc:Adonis/Core/Validator'
import AppBaseController from "App/Controllers/Http/AppBaseController";
import RegisterValidator from "App/Validators/RegisterValidator";
import User from "App/Models/User";
import Helper from "App/Helpers/Helper";
import UserHelper from "App/Helpers/UserHelper";
import RoleHelper from "App/Helpers/RoleHelper";
import UserRole from "App/Models/UserRole";
import VerifyEmail from "App/Mailers/VerifyEmail";
import Otp from "App/Models/Otp";
import ResendSignupOtpValidator from "App/Validators/ResendSignupOtpValidator";
import VerifyEmailValidator from "App/Validators/VerifyEmailValidator";
import LoginValidator from "App/Validators/LoginValidator";
import ResetPassword from "App/Mailers/ResetPassword";
import ResetPasswordValidator from "App/Validators/ResetPasswordValidator";

export default class AuthController extends AppBaseController{

    public async signup( { response, request }: HttpContextContract ){

        let input
        try {
            input = await request.validate(RegisterValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        /* Delete user if unverified */
        let user = await User.findBy('email', input.email)
        if(user){
            if (user.is_verified) {
                return this.sendError('Email already exist.');
            }else{
                await user.delete()
            }
        }

        /* Create User */
        user = new User();
        user.name = input.name
        user.email = input.email
        user.password = input.password
        user.phone = input.phone
        user.is_verified = false;
        if(!await user.save()){
            return this.sendError('Failed to register user.')
        }

        const code = UserHelper.generateOTP(user.id, user.email)

        /* Assign User Role */
        const role = await RoleHelper.get_role_by_name(input.account_type)

        const userRole = new UserRole();
        userRole.user_id = user.id
        userRole.role_id = role ? role.id : 0
        if(!await userRole.save()){
            return this.sendError('Failed to assign user role.')
        }

        /* Create User Device */
        await UserHelper.setUserDevice(user.id, input.device_type, input.device_token);

        /* Send Email */
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

        await Otp.query().where('email', input.email).delete();
        let user = await User.findBy('email', input.email);
        if(user){
            const code = UserHelper.generateOTP(user.id,user.email);

            /* Send Email */
            const subject = 'Please verify your email address.'
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
        let otpMinTime = Helper.getOtpMinTime();
        let otp = await Otp.query().where('email', input.email).where('code', input.code).where('created_at', '>=',otpMinTime).orderBy('created_at','desc').first();
        if(otp){
            let user = await User.find(otp.user_id)
            if(user){
                user.is_verified = true
                if( !await user.save() ){
                    return this.sendError('Failed to verify user. Please try again.')
                }
                otp.delete()
                return this.sendResponse({user:user},'OTP verified successfully !')
            }
            return this.sendError('User not found.')
        }else{
            return this.sendError('OTP not found or is expired.')
        }
    }

    public async login( { response, auth, request }: HttpContextContract ){

        let input
        try {
            input = await request.validate(LoginValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        let user = await User.findBy('email', input.email)
        if(user){
            let token
            try {
                token = await auth.attempt(input.email, input.password)
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

    public async send_reset_password_otp( { response,request }: HttpContextContract ) {
        try {
            await request.validate(ResendSignupOtpValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        const input = request.all();

        await Otp.query().where('email', input.email).delete();
        let user = await User.findBy('email', input.email);
        if(user){
            const code = UserHelper.generateOTP(user.id,user.email);

            /* Send Email */
            const subject = 'Reset Password OTP'
            await new ResetPassword(user, code, subject).sendLater()
            return this.sendResponse({user: user},"An OTP has been sent to your email address")
        }else{
            return this.sendError('User not found.')
        }
    }

    public async reset_password( { response,request }: HttpContextContract ){

        let input
        try {
            input = await request.validate(ResetPasswordValidator)
        } catch (error) {
            return this.sendValidationError(error,response)
        }

        let otpMinTime = Helper.getOtpMinTime();
        let otp = await Otp.query().where('email', input.email).where('code', input.code).where('created_at', '>=',otpMinTime).orderBy('created_at','desc').first();
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

    public async test( { auth }: HttpContextContract ){
        return auth
    }

}
