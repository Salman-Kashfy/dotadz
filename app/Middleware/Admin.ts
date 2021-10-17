import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import RoleHelper from "App/Helpers/RoleHelper";
import Role from "App/Models/Role";

export default class Admin {
    public async handle({auth, response}: HttpContextContract, next: () => Promise<void>, customGuards: string[]) {
        // code for middleware goes here. ABOVE THE NEXT CALL
        const guards:any = customGuards.length ? customGuards : [auth.name];
        let { user }:any = auth
        for (let guard of guards) {
            if (await auth.use(guard).check()) {
                if (!await RoleHelper.has_role(user,Role.ADMIN)) {
                    return response.status(403).send({status: false, message: 'Permission denied.'})
                }
            }
        }
        await next()
    }
}
