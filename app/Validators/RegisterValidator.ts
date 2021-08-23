import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
    constructor (protected ctx: HttpContextContract) {
    }

    /*
     * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
     *
     * For example:
     * 1. The username must be of data type string. But then also, it should
     *    not contain special characters or numbers.
     *    ```
     *     schema.string({}, [ rules.alpha() ])
     *    ```
     *
     * 2. The email must be of data type string, formatted as a valid
     *    email. But also, not used by any other user.
     *    ```
     *     schema.string({}, [
     *       rules.email(),
     *       rules.unique({ table: 'users', column: 'email' }),
     *     ])
     *    ```
     */
    public schema = schema.create({
        name: schema.string({ trim: true }, [
            rules.maxLength(35)
        ]),
        email: schema.string({ trim: true }, [
            rules.maxLength(100),
            rules.email()
        ]),
        phone: schema.string({ trim: true }, [
            rules.maxLength(20),
            rules.mobile()
        ]),
        password: schema.string({}, [
            rules.maxLength(180),
            rules.minLength(6)
        ]),
        account_type: schema.enum(
            ['creator', 'user'] as const,[
                rules.exists({ table: 'roles', column: 'name' })
            ]
        ),
        device_type: schema.enum(
            ['android', 'ios'] as const
        ),
        device_token: schema.string({ trim: true }, [

        ])
    })

    /**
     * Custom messages for validation failures. You can make use of dot notation `(.)`
     * for targeting nested fields and array expressions `(*)` for targeting all
     * children of an array. For example:
     *
     * {
     *   'profile.username.required': 'Username is required',
     *   'scores.*.number': 'Define scores as valid numbers'
     * }
     *
     */
    public messages = {
        'account_type.enum' : 'Invalid account type',
        'device_type.enum' : 'Invalid device type',
    }
}
