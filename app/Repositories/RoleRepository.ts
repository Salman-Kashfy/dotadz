import BaseRepository from "App/Repositories/_BaseRepository";
import Role from "App/Models/Role";

class RoleRepository extends BaseRepository{
    public model
    private static instance: RoleRepository

    constructor() {
        const relations = []
        super(Role, relations)
        this.model = Role
    }

    static getInstance() {
        if(!RoleRepository.instance){
            RoleRepository.instance = new RoleRepository()
        }
        return RoleRepository.instance
    }
}
export default RoleRepository.getInstance()