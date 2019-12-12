import * as THREE from 'three'
import Loading from "./Loading";
import Tooler from "./Tooler";
import axios from 'axios';
import ListLoader from './ListLoader';

export class FineLoader extends THREE.Object3D{

    public static isLayout:boolean = false;

    loading: Loading;
    modelPath: string = "";
    modelName: string = "";
    holeList: ListLoader;
    layoutList: ListLoader;
    sunList: ListLoader;
    partList: ListLoader;

    constructor(){
        super();
        this.loading = new Loading();
        // this.add(this.loading);

        this.holeList = new ListLoader("hole");
        this.sunList = new ListLoader("sun");
        this.partList = new ListLoader("part");
        this.layoutList = new ListLoader("layout");

        window.addEventListener("model_progress", (e: any) => {
            // this.loading.update("加载中", e.detail);
            if(e.detail == 100){
                // this.remove(this.loading);
            }
        })

        window.addEventListener("listLoad", (e: any) => {
            // this.loading.update("加载中", e.detail);
            if(e.detail == "hole"){
                this.sunList.start();
            }
            else if(e.detail == "sun"){
                FineLoader.isLayout = true;
                this.partList.start();
            }
            else if(e.detail == "part"){
                // FineLoader.isLayout = true;
                this.layoutList.start();
            }
            else if(e.detail == "layout"){
                window.dispatchEvent(new CustomEvent("all loaded", { bubbles: false, cancelable: false, detail: {}}));
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

        res.json.holes && res.json.holes.forEach(async (item:any)=>{
            this.holeList.add(item);
        })

        res.json.suns && res.json.suns.forEach(async (item:any)=>{
            this.sunList.add(item);
        })

        res.json.parts && res.json.parts.forEach(async (item:any)=>{
            this.partList.add(item);
        })

        res.json.layouts && res.json.layouts.forEach(async (item:any)=>{
            this.layoutList.add(item);
        })

        this.holeList.start();
    }

    loadSubModel(item:any, hasAnimate: boolean = true){
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
            window.dispatchEvent(new CustomEvent("subLoad", { bubbles: false, cancelable: false, detail: detail}));
            resolve();
        })
    }
}