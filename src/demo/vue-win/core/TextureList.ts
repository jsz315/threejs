export default class TextureList{

    list:Array<any>;

    constructor(){
        this.init();
    }

    init(){
        this.list = [];
        window.addEventListener("texture_loaded", (e)=>{
            console.log(e);
        })
    }

}