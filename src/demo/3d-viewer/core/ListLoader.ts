import * as THREE from 'three'
import Tooler from './Tooler';

export default class ListLoader{

    curId:number;
    total:number;
    list:Array<any>;
    type:string;

    constructor(type:string){
        this.curId = 0;
        this.type = type;
        this.list = [];
    }

    add(item:any){
        this.list.push(item);
    }

    async start(){
        if(this.curId < this.list.length){
            console.log("start load " + this.type + " " + this.curId);
            await this.load(this.list[this.curId], this.type == "hole");
            console.log("end load " + this.type + " " + this.curId);
            this.curId++;
            this.start();
        }
        else{
            console.log(this.type + " all loaded");
            window.dispatchEvent(new CustomEvent("listLoad", { bubbles: false, cancelable: false, detail: this.type}));
        }
    }

    load(item:any, hasAnimate: boolean = true){
        return new Promise(async resolve => {
            let url:any = item.url.replace(/\.a3d/i, ".zip");
            if(!url){
                resolve();
                return;
            }
            let res:any = await Tooler.loadModel(url);
            if(!res){
                resolve(); 
                return;
            }
            let detail = {
                obj: res.object3D,
                attr: item,
                hasAnimate: hasAnimate
            }
            console.log("loading ... " + this.curId);
            window.dispatchEvent(new CustomEvent("subLoad", { bubbles: false, cancelable: false, detail: detail}));
            resolve();
        })
    }
    
}