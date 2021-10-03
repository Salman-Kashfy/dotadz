import BaseRepository from "App/Repositories/_BaseRepository";
import User from "App/Models/User";

class UserRepository extends BaseRepository {

    public model
    private static instance: UserRepository

    constructor() {
        const relations = []
        super(User, relations)
        this.model = User
    }

    static getInstance() {
        if(!UserRepository.instance){
            UserRepository.instance = new UserRepository()
        }
        return UserRepository.instance
    }

    async store(input: any) {
        delete input.password_confirmation
        return super.store(input);
    }

    async update(id: number, input) {
        delete input.password_confirmation
        return super.update(id, input);
    }

    async findSocialLogin(request) {
        let user = await this.model.query().where({
            social_platform: request.input('social_platform'),
            client_id: request.input('client_id'),
        }).first();
        return user;
    }

    async socialLogin(request) {
        let input = request.only(['name', 'email', 'image', 'social_platform', 'client_id'])
        input.is_verified = 1;
        input.is_social_login = 1;
        input.password = Math.random().toString(36).substring(2, 15)
        return await super.store(input);
    }

}


export default UserRepository.getInstance()