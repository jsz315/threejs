import * as THREE from 'three'
import Loading from "./Loading";
import Tooler from "./Tooler";
import { GLTFLoader } from '../lib/GLTFLoader'
import axios from 'axios';

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
        let flink = url.replace(/\.(glb|zip)/i, "");
        let isZip = false;
        if(await validateLink(flink + ".zip")){
            url = flink + ".zip";
            isZip = true;
        }
        else{
            url = flink + ".glb";
        }
        console.log("start load");
        let list = Tooler.getUrlPath(url);
        this.modelPath = list[0];
        this.modelName = list[1];
        // let baseURL = (window as any).CFG.baseURL;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.modelPath + this.modelName);
        xhr.responseType = 'blob';
        xhr.onprogress = (event) =>{
            if (event.lengthComputable) {
                let n = Math.floor(event.loaded / event.total * 100);
                this.loading.update("加载中", n + "%");
                this.add(this.loading);
            }
        };
        xhr.onreadystatechange = async () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // let res = await this.loadObject();
                    // callback(res);
                    let res = await this.readData(xhr.response, isZip);
                    this.remove(this.loading);

                    callback(res);
                } else {
                    alert("加载失败，请刷新页面重新尝试");
                }
            } else {
                
            }
        }
        xhr.send();
    }

    readData(blob: any, isZip:boolean):any{
        if(isZip){
            return new Promise(async resolve => {
                blob = await readBlob(blob, this.modelName);
                let loader = new GLTFLoader();
                loader.setCrossOrigin('anonymous');
                loader.parse(blob, this.modelPath, (gltf:any) => {
                    console.log("gltf");
                    console.log(gltf);
                    resolve(gltf.scene);
                })
            })
        }
        else{
            return new Promise(resolve => {
                let loadingManager = new THREE.LoadingManager(()=>{
                    console.log("loaded");
                }, (url:string, loaded:number, total:number)=>{
                    let n = Math.floor(loaded / total * 100); 
                    this.loading.update("初始化", n + "%", "#00a215");
                    this.add(this.loading);
                })
        
                let loader = new GLTFLoader(loadingManager);
                loader.setPath(this.modelPath);
                loader.setCrossOrigin('anonymous');
                loader.load(this.modelName, (gltf:any) => {
                    console.log("gltf");
                    console.log(gltf);
                    resolve(gltf.scene);
                })
            })
        }
    }

    loadObject():any{
        if(this.modelName.indexOf(".glb") != -1){
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
        else{
            return new Promise(resolve => {
                axios({
                    method: 'get',
                    url: this.modelPath + this.modelName,      
                    responseType: 'blob'
                }).then(async (res) => {
                    this.remove(this.loading);
                    let bf:any = await readBlob(res.data, this.modelName);
                    let loader = new GLTFLoader();
                    loader.setCrossOrigin('anonymous');
                    loader.parse(bf, this.modelPath, (gltf:any) => {
                        console.log("gltf");
                        console.log(gltf);
                        resolve(gltf.scene);
                    })
                });
            })
        }
    }
}

function readBlob(f:any, fname:string){
    return new Promise(resolve => {
        var dateBefore:number = Date.now();
        (<any>window).JSZip.loadAsync(f).then(async function(zip:any) {
            var dateAfter:number = Date.now();
            console.log("(loaded in " + (dateAfter - dateBefore) + "ms)");

            console.log(zip);
            // let res = await zip.file(fname.replace(".zip", ".glb")).async("arraybuffer");
            let res = await zip.file("obj.glb").async("arraybuffer");
            let json = await getJson(zip);

            // console.log("zip json");
            // console.log(json);
            resolve(res);    
        }, function (e:any) {
            console.log("Error reading " + f.name + ": " + e.message);
        });
    })
}

function getJson(zip:any){
    return new Promise(async resolve => {
        let fname = "design.json";
        for(var i in zip.files){
            console.log(zip.files[i]);
            if(zip.files[i].name == fname){
                let json = await zip.file(fname).async("string");
                resolve(json);
            }
        }
        resolve("{}");
    });
}

function validateLink(url:string, download:boolean = false){
    return new Promise(resolve => {
        var xhr = new XMLHttpRequest();
        xhr.open(download ? "Get" : "HEAD", url, true);
        xhr.onreadystatechange = ()=>{
            // console.log(`readyState = ${xhr.readyState} ; status = ${xhr.status}`);
            if(xhr.readyState === 4){
                if(xhr.status === 404){
                    console.log("文件不存在：" + url);
                    resolve(false);
                }
                if(xhr.status === 200){
                    console.log("文件存在：" + url);
                    resolve(true);
                }
            }
        }
        xhr.send();
    })
}
