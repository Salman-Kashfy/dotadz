import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserRole from "App/Models/UserRole";

export default class UserRoleSeeder extends BaseSeeder {
  public async run () {
      await UserRole.createMany([
          {
              id: 1,
              user_id: 1,
              role_id: 1,
          }
      ])
  }
}
