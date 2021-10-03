import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from "App/Models/Role";

export default class RoleSeeder extends BaseSeeder {
    public async run () {
        // Write your database queries inside the run method
        await Role.createMany([
            {
                id: 1,
                name: 'admin',
                display_name: 'Admin'
            },
            {
                id: 2,
                name: 'vendor',
                display_name: 'Vendor'
            },
            {
                id: 3,
                name: 'user',
                display_name: 'user'
            }
        ])
    }
}
