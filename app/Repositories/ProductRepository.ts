import BaseRepository from "App/Repositories/_BaseRepository";
import Product from "App/Models/Product";

class ProductRepository extends BaseRepository{
    public model
    private static instance: ProductRepository

    constructor() {
        const relations = []
        super(Product, relations)
        this.model = Product
    }

    static getInstance() {
        if(!ProductRepository.instance){
            ProductRepository.instance = new ProductRepository()
        }
        return ProductRepository.instance
    }
}
export default ProductRepository.getInstance()