import * as THREE from 'three'
import Loading from "./Loading";
import Tooler from "./Tooler";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class FineLoader extends THREE.Object3D{
    loading: Loading;
    modelPath: string = "";
    modelName: string = "";

    constructor(){
        super();
        this.loading = new Loading();
        this.add(this.loading);
    }

    async start(url:string, callback:Function){
        console.log("start load");
        let list = Tooler.getUrlPath(url);
        this.modelPath = list[0];
        this.modelName = list[1];
        // let baseURL = (window as any).CFG.baseURL;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.modelPath + this.modelName);
        xhr.onprogress = (event) =>{
            if (event.lengthComputable) {
                let n = Math.floor(event.loaded / event.total * 100);
                console.log(n + "%");
                this.loading.update("加载中", n + "%");
                this.add(this.loading);
            }
        };
        xhr.onreadystatechange = async () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let res = await this.loadObject();
                    callback(res);
                } else {
                    alert("加载失败，请刷新页面重新尝试");
                }
            } else {
                
            }
        }
        xhr.send();
    }

    loadObject():any{
        return new Promise(resolve => {
            let loadingManager = new THREE.LoadingManager(()=>{
                console.log("loaded");
                this.remove(this.loading);
            }, (url:string, loaded:number, total:number)=>{
                let n = Math.floor(loaded / total * 100); 
                console.log("load " + n + "%");
                this.loading.update("初始化", n + "%", "#00a215");
                this.add(this.loading);
            })
    
            let loader = new GLTFLoader(loadingManager);
            loader.setPath(this.modelPath);
            loader.setCrossOrigin('anonymous');
            // loader.setCrossOrigin('*');
            loader.load(this.modelName, (gltf:any) => {
                console.log("gltf");
                console.log(gltf);
                resolve(gltf.scene);
            })
        })
        
    }
    
}