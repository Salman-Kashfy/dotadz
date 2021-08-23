import {constants} from "Config/constants";

export default class {
    public static getCurrentDate(){
        return new Date()
    }

    public static getOtpMinTime(){
        return new Date(this.getCurrentDate().getTime() - constants.otpExpMins*60000);
    }
}