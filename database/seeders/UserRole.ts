import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserRole from "App/Models/UserRole";
import Role from "App/Models/Role";

export default class UserRoleSeeder extends BaseSeeder {
  public async run () {
      await UserRole.createMany([
          {
              id: 1,
              userId: 1,
              roleId: Role.ADMIN,
          }
      ])
  }
}
