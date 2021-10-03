import BaseRepository from "App/Repositories/_BaseRepository";
import UserCard from "App/Models/UserCard";
import {constants} from "Config/constants";


class UserCardRepository extends BaseRepository {
    public model
    private static instance: UserCardRepository

    constructor() {
        const relations = []
        super(UserCard, relations)
        this.model = UserCard
    }

    static getInstance() {
        if(!UserCardRepository.instance){
            UserCardRepository.instance = new UserCardRepository()
        }
        return UserCardRepository.instance
    }

    async index(input:any,offset:any= 1, limit:any = constants.PER_PAGE, orderBy:string = 'id', sortBy:string = 'desc') {
        let query = this.model.query()
        query = input.user_id ? query.where('user_id', input.user_id) : query
        return await query.orderBy(orderBy, sortBy).paginate(parseInt(offset), parseInt(limit))
    }

    async show(id) {
        return await this.model.find(id)
    }

    async store(input) {
        return await this.model.create(input);
    }

    async update(id, input) {
        let modelObj = await this.model.find(id)
        if (!modelObj) {
            return null
        }
        await this.model.query().where({id}).update(input)
        return await this.model.find(id)
    }

    async destroy(id){
        let modelObj = await this.model.find(id)
        if (modelObj) {
            return await modelObj.delete()
        }
    }

}

export default UserCardRepository.getInstance()