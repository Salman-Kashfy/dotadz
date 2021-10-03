import RoleRepo from "App/Repositories/RoleRepository";

class RoleHelper {

    public static async get_role_by_name(name:string){
        return await RoleRepo.model.findBy('name',name) as object
    }

    public static async has_role(user:any,role_id:number){
        let userRoles = await user.related('userRoles').query()
        let role = await RoleRepo.model.find(role_id)
        for (let i = 0; i < userRoles.length; i++) {
            if(userRoles[i].roleId === role.id){
                return true as boolean
            }
        }
        return false as boolean
    }
}

export = RoleHelper