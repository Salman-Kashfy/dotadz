//import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AppBaseController {

    public sendError(message){
        return {
            status: false,
            message:message
        }
    }

    public sendResponse(data,message){
        return {
            status: true,
            message:message,
            data: data
        }
    }

    public async sendValidationError(error,response)
    {
        let messages = {
            status: false,
            errors : error.messages.errors
        }
        response.badRequest(messages)
    }
}
