import Role from "App/Models/Role";

class RoleHelper {
    public static async get_role_by_name(name){
        return Role.findBy('name',name)
    }
}

export = RoleHelper