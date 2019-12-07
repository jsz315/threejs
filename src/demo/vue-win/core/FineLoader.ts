import * as THREE from 'three'
import Loading from "./Loading";
import Tooler from "./Tooler";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import axios from 'axios';
import ListLoader from './ListLoader';

export class FineLoader extends THREE.Object3D{

    public static isLayout:boolean = false;

    loading: Loading;
    modelPath: string = "";
    modelName: string = "";
    holeList: ListLoader;
    layoutList: ListLoader;

    constructor(){
        super();
        this.loading = new Loading();
        this.add(this.loading);

        this.holeList = new ListLoader("hole");
        this.layoutList = new ListLoader("layout");

        window.addEventListener("model_progress", (e: any) => {
            this.loading.update("加载中", e.detail);
            if(e.detail == 100){
                this.remove(this.loading);
            }
        })

        window.addEventListener("listLoad", (e: any) => {
            this.loading.update("加载中", e.detail);
            if(e.detail == "hole"){
                // this.remove(this.loading);
                FineLoader.isLayout = true;
                this.layoutList.start();
            }
            else{
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

        // console.log("开始加载门窗-------");
        res.json.holes && res.json.holes.forEach(async (item:any)=>{
            // console.log("加载门窗模型-------");
            // await this.loadSubModel(item, true);
            this.holeList.add(item);
        })

        // console.log("开始加载家具-------");
        res.json.layouts && res.json.layouts.forEach(async (item:any)=>{
            // console.log("加载家具模型-------");
            // await this.loadSubModel(item, false);
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