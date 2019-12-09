import * as THREE from 'three'
import Tooler from "./Tooler";
import axios from 'axios';
import ListLoader from './ListLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import listener from '../lib/listener';

// import { JSZip } from 'three/examples/js/libs/jszip.min.js';
const JSZip = require('three/examples/js/libs/jszip.min.js');

export class FineLoader extends THREE.Object3D{
   
    modelPath: string = "";
    modelName: string = "";
    loadingManager: any;

    constructor(){
        super();
    }

    async load(fileList:Array<any>){
        console.log(fileList);
        if(fileList.length == 0){
            console.log("未选择文件");
            return;
        }
        this.getStartFile(fileList);
    }

    getStartFile(data:any){        
        let file;
        for(let i in data){
            let fname = data[i].name;
            if(fname.match(/\.(gltf|glb)$/i)){
                this.loadGltf(data[i]);
                break;
            }
            else if(fname.match(/\.fbx$/i)){
                this.loadFbx(data[i]);
                break;
            }
            else if(fname.match(/\.obj$/i)){
                this.loadObj(data[i]);
                break;
            }
            else if(fname.match(/\.zip$/i)){
                this.loadZip(data[i]);
                break;
            }
        }
    }

    loadGltf(file:any){
        let type = Object.prototype.toString.call(file);
        console.log("type", type);
        if(type.indexOf("File") != -1){
            var reader = new FileReader();
            reader.onload = ()=>{
                let loader = new GLTFLoader(this.loadingManager);
                loader.setCrossOrigin('anonymous');
                loader.parse(reader.result, "", (gltf:any)=>{
                    this.parseOver(gltf.scene);
                })
            }
            reader.readAsArrayBuffer(file);
        }
        else{
            let loader = new GLTFLoader(this.loadingManager);
            loader.parse(file.asArrayBuffer(), "", (gltf:any)=>{
                this.parseOver(gltf.scene);
            })
        }
    }

    loadFbx(file:any){
        let type = Object.prototype.toString.call(file);
        console.log("type", type);
        if(type.indexOf("File") != -1){
            var reader = new FileReader();
            reader.onload = ()=>{
                var loader = new FBXLoader(this.loadingManager);
                var obj = loader.parse(reader.result, "");
                this.parseOver(obj);
            }
            reader.readAsArrayBuffer(file);
        }
        else{
            var loader = new FBXLoader(this.loadingManager);
            var obj = loader.parse(file.asArrayBuffer(), "");
            this.parseOver(obj);
        }
    }

    loadObj(file:any){
        let type = Object.prototype.toString.call(file);
        console.log("type", type);
        if(type.indexOf("File") != -1){
            var reader = new FileReader();
            reader.onload = ()=>{
                var loader = new OBJLoader(this.loadingManager);
                var obj = loader.parse(reader.result as string);
                this.parseOver(obj);
            }
            reader.readAsText(file);
        }
        else{
            var loader = new OBJLoader(this.loadingManager);
            var obj = loader.parse(file.asText());
            this.parseOver(obj);
        }
    }

    parseOver(obj:any){
        listener.emit("loaded", obj);
    }

    loadZip(file:any){
        let reader = new FileReader();
        reader.onload = ()=>{ 
            const zip = new JSZip( reader.result );
            this.loadingManager = new THREE.LoadingManager();
            this.loadingManager.setURLModifier((url:string) => {
                const buffer = zip.files[url].asUint8Array();
                const blob = new Blob( [ buffer.buffer ] );
                const NewUrl = URL.createObjectURL( blob );
                console.log("NewUrl", NewUrl);
                return NewUrl
            });
            // for(let i in zip.files){
            //     console.log(i, zip.files[i]);
            // }
            this.getStartFile(zip.files);
        } 
        reader.readAsArrayBuffer(file);
    }
}