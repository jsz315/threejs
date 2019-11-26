import * as THREE from 'three'
import Loading from "./Loading";
import Tooler from "./Tooler";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import axios from 'axios';

export class FineLoader extends THREE.Object3D{

    loading: Loading;
    modelPath: string = "";
    modelName: string = "";

    constructor(){
        super();
        this.loading = new Loading();
        this.add(this.loading);
        window.addEventListener("model_progress", (e: any) => {
            this.loading.update("加载中", e.detail);
            console.log(e.detail + "%");
            if(e.detail == 100){
                this.remove(this.loading);
            }
        })
    }

    async start(url:string, callback:Function){
        let res:any = await Tooler.loadModel(url);
        if(!res){
            console.log("【模型加载失败】 " + url);
            return;
        }
        console.log("【模型json数据】");
        console.log(res.json);
        callback(res.object3D);

        res.json.holes.forEach(async (item:any)=>{
            await this.loadSubModel(item);
        })
    }

    loadSubModel(item:any){
        return new Promise(async resolve => {
            let url:any = item.url;
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
                attr: item
            }
            window.dispatchEvent(new CustomEvent("subLoad", { bubbles: false, cancelable: false, detail: detail}));
            resolve();
        })
    }
}