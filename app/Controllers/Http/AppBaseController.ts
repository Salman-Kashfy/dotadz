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

    globalResponse(status, message, data:any = null) {
        let response:any = {
            status: status,
            message: message || "",
            data: data ? typeof data.toJSON != 'undefined' ? data.toJSON() : data : null
        }
        // if(data && data.hasOwnProperty("pages")){
        //   response.data = data.rows && data.rows.length > 0 ? (data.toJSON()).data : []
        //   response.pages = data.pages
        // }else{
        //     response.data = data.toJSON()
        // }
        return response
    }
}
