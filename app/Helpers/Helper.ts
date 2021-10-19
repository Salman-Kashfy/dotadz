import {constants} from "Config/constants";
import Database from '@ioc:Adonis/Lucid/Database'

export default class {
    public static getCurrentDate(){
        return new Date()
    }

    public static getOtpMinTime(){
        return new Date(this.getCurrentDate().getTime() - constants.otpExpMins*60000);
    }

    public static async checkBelonging(table,column,whereObj,payload){
        let record = await Database.from(table).select(column).where(whereObj).first()
        return record && record[column] ===  payload
    }

    public static search_filter(table,column,keyword,query){
        if(!keyword) return query
        if(!Array.isArray(column)){
            return query.where(function (subquery) {
                subquery.where(`${table}.${column}`,'like',`%${keyword}%`)
            });
        }else{
            query.where(function (subquery) {
                subquery.where(`${table}.${column}`,'like',`%${keyword}%`)
                for (let i = 1; i < column.length; i++) {
                    subquery = subquery.orWhere(`${table}.${column[i]}`,'like',`%${keyword}%`);
                }
            });
            return query
        }
    }
}