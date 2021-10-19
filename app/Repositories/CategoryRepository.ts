import BaseRepository from "App/Repositories/_BaseRepository";
import Category from "App/Models/Category";
import Helper from "App/Helpers/Helper";
import {constants} from "Config/constants";

class CategoryRepository extends BaseRepository{
    public model
    private static instance: CategoryRepository

    constructor() {
        const relations = []
        super(Category, relations)
        this.model = Category
    }

    static getInstance() {
        if(!CategoryRepository.instance){
            CategoryRepository.instance = new CategoryRepository()
        }
        return CategoryRepository.instance
    }

    async index(request:any,offset:number= 1, limit:number = constants.PER_PAGE, orderBy:string = 'id', sortBy:any = 'desc') {
        let query = this.model.query()
        if(request && request.input('keyword')){
            query = Helper.search_filter(this.model.table,'name',request.input('keyword'),query)
        }
        return await query.orderBy(orderBy, sortBy).paginate(offset, limit)
    }

}
export default CategoryRepository.getInstance()