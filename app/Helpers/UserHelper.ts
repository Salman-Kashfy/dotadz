import UserDevice from "App/Models/UserDevice";
import Otp from "App/Models/Otp";

class UserHelper {
    public static setUserDevice(user_id, device_type, device_token){
        UserDevice.create({
            user_id:user_id,
            device_type:device_type,
            device_token:device_token
        })
    }

    public static generateOTP(user_id, email){
        const code = Math.floor(1000 + Math.random() * 9000);
        Otp.create({
            user_id: user_id,
            email: email,
            code:code
        });
        return code;
    }
}

export = UserHelper
