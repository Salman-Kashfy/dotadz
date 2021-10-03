import BaseRepository from "App/Repositories/_BaseRepository";
import Otp from "App/Models/Otp";

class OtpRepository extends BaseRepository{
    public model
    private static instance: OtpRepository

    constructor() {
        const relations = []
        super(Otp, relations)
        this.model = Otp
    }

    static getInstance() {
        if(!OtpRepository.instance){
            OtpRepository.instance = new OtpRepository()
        }
        return OtpRepository.instance
    }
}
export default OtpRepository.getInstance()