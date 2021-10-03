import UserDevice from "App/Models/UserDevice";
import Otp from "App/Models/Otp";

class UserHelper {
    public static setUserDevice(user_id:number, device_type:string, device_token:string){
        UserDevice.create({
            user_id:user_id,
            device_type:device_type,
            device_token:device_token
        })
    }

    public static generateOTP(user_id:number, email:string){
        const code = Math.floor(1000 + Math.random() * 9000);
        Otp.create({
            user_id: user_id,
            email: email,
            code:code
        });
        return code;
    }

    public static getFirstName(name:string){
        return name.split(' ')[0]
    }
}

export = UserHelper
