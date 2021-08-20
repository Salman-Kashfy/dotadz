import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from "App/Models/User";

export default class UserSeeder extends BaseSeeder {
    public async run () {
        // Write your database queries inside the run method
        await User.createMany([
            {
                id: 1,
                name: 'admin',
                email: 'admin@admin.com',
                password: 'qwerty',
            }
        ])
    }
}
