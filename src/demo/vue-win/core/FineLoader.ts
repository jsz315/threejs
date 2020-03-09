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
                console.log("all loaded");
                window.dispatchEvent(new CustomEvent("all loaded", { bubbles: false, cancelable: false, detail: {}}));
            }
        })
    }

    /**
     * 
     * @param url 初始化所有模型数据
     * @param callback 
     */
    async start(url:string, callback:Function){
        let res:any = await Tooler.loadModel(url);
        if(!res){
            console.log("【模型加载失败】 " + url);
            return;
        }
        console.log("【模型json数据】");
        console.log(res.json);
        callback(res.object3D);

        this.removeOutsize(res.json.holes, this.holeList);
        this.removeOutsize(res.json.suns, this.sunList);
        this.removeOutsize(res.json.parts, this.partList);
        this.removeOutsize(res.json.layouts, this.layoutList);

        this.holeList.start();
    }

    removeOutsize(list:any, loader: ListLoader){
        list && list.forEach(async (item:any)=>{
            var out = false; 
            item.position.forEach((p:number)=>{
                if(Math.abs(p) > 10000){
                    out = true;
                }
            })
            if(out){
                console.log("【丢弃超出舞台范围的模型】");
                console.log(item);
            }
            else{
                loader.add(item);
            }
        })
    } 

    // loadSubModel(item:any, hasAnimate: boolean = true){
    //     return new Promise(async resolve => {
    //         let url:any = item.url.replace(/\.a3d/i, ".zip");
    //         if(!url){
    //             resolve();
    //             return;
    //         }
    //         let res:any = await Tooler.loadModel(url);
    //         if(!res){
    //             resolve(); 
    //             return;
    //         }
    //         let detail = {
    //             obj: res.object3D,
    //             attr: item,
    //             hasAnimate: hasAnimate
    //         }
    //         window.dispatchEvent(new CustomEvent("subLoad", { bubbles: false, cancelable: false, detail: detail}));
    //         resolve();
    //     })
    // }
}