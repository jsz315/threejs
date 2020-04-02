import * as THREE from 'three'
import Tooler from './Tooler';
import listener from '../lib/listener';
import Cache from './Cache'

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
            // console.log("加载模型", this.type);
            listener.emit("chat", this.type + " " + this.curId + "/" + this.list.length + "##" + this.list[this.curId].url);
            await this.load(this.list[this.curId], this.type == "hole" || this.type == "sun");
            console.log("load " + this.type + " " + this.curId + "/" + this.list.length);

            this.curId++;
            this.start();
        }
        else{
            console.log("[" + this.type + " all loaded]");
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
            if(!Tooler.isTest()){
                url = url.replace("http:", "https:");
            }
            console.log("url=>" + url);

            let detail:any = {
                attr: item,
                hasAnimate: hasAnimate
            }

            let mesh:any = Cache.getInstance().getMesh(url);
            if(mesh){
                detail.obj = mesh;
                window.dispatchEvent(new CustomEvent("subLoad", { bubbles: false, cancelable: false, detail: detail}));
                resolve();
                return;
            }

            // listener.emit("chat", "[start] " + url);
            let res:any = await Tooler.loadModel(url);
            // listener.emit("chat", "[end] " + url);

            if(!res){
                resolve(); 
                return;
            }

            detail.obj = res.object3D;
            // console.log("loading ... " + this.curId);
            window.dispatchEvent(new CustomEvent("subLoad", { bubbles: false, cancelable: false, detail: detail}));

            Cache.getInstance().setMesh(url, res.object3D);

            resolve();
        })
    }
    
}