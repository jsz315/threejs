export default class Goods{
    name:string = "";
    price:number = 0;

    constructor(name:string,price: number){
        this.name = name;
        this.price = price;
    }

    show(){
        console.log("the " + this.name + " price is " + this.price);
    }
}