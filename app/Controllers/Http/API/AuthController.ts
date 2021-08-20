import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import { schema, rules } from '@ioc:Adonis/Core/Validator'
import AppBaseController from "App/Controllers/Http/AppBaseController";
import RegisterValidator from "App/Validators/RegisterValidator";
import User from "App/Models/User";
import UserHelper from "App/Helpers/UserHelper";
import RoleHelper from "App/Helpers/RoleHelper";
import UserRole from "App/Models/UserRole";
import VerifyEmail from "App/Mailers/VerifyEmail";
import Otp from "App/Models/Otp";
import ResendSignupOtpValidator from "App/Validators/ResendSignupOtpValidator";
import VerifyEmailValidator from "App/Validators/VerifyEmailValidator";
import { constants } from "Config/constants";
import LoginValidator from "App/Validators/LoginValidator";

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
        new VerifyEmail(user, code).send()
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
            new VerifyEmail(user, code).send()
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
        var currentDate = new Date();
        var otpMinTime = new Date(currentDate.getTime() - constants.otpExpMins*60000);

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
            if (user.is_verified) {
                const token = await auth.use('api').attempt(input.email, input.password)
                return token
            }else{
                return this.sendError('Email not verified. Please verify your email.')
            }
        }

        return input;

    }

}
