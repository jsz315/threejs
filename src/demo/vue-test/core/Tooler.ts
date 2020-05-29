import * as THREE from 'three'
import { GLTFLoader } from '../lib/GLTFLoader'
import { GLTFExporter } from '../lib/GLTFExporter';
import Cache from './Cache';

export default class Tooler{

    public static errorList:Array<string> = [];

    public static getOffsetVector3(obj: THREE.Object3D):THREE.Vector3{
        let box = new THREE.Box3().setFromObject(obj);
        let x = (box.min.x + box.max.x) / 2;
        let y = (box.min.y + box.max.y) / 2;
        let z = (box.min.z + box.max.z) / 2;
        let offset: THREE.Vector3 = new THREE.Vector3(x, y, z);
        return offset;
    }

    public static getBoxSize(obj: THREE.Object3D):THREE.Vector3{
        let box = new THREE.Box3().setFromObject(obj);
        let size = box.getSize(new THREE.Vector3());
        return size;
    }

    public static getFitScale(obj: THREE.Object3D, num: number):number{
        let size = this.getBoxSize(obj);
        console.log("scene size ==== ");
        console.log(size);
        let max = Math.max(size.x, size.y, size.z);
        if(max == 0){
            return 0;
        }
        let scale = num / max;
        return scale;
    }

    public static getUrlPath(url:string):any[]{
        url = this.getLink(url);
        let list = url.split("/");
        let aim = list.pop();
        let path = list.join("/") + "/";
        return [path, aim];
    }

    public static getLink(url:string):string{
        if(url.match(/http(s?):/)){
            return url;
        }
        return (window as any).CFG.baseURL + url;
    }

    public static getQueryString(name:string):any {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
          return unescape(r[2]);
        }
        return null;
    }

    public static checkMobile():boolean{
        let list = ["Android", "iPhone", "iPad"];
        let res = list.find(item => {
            if(navigator.userAgent.indexOf(item) != -1){
                return true;
            }
        })
        return !!res;
    }

    public static isTest():boolean{
        // return this.getQueryString('test') == 1;
        return location.search.indexOf('http://') != -1;
    }

    public static getAllMaterial(obj: THREE.Object3D):any{
        let size:number = 1;
        let materials:any = {};
        let temp:any = [];
        obj.traverse((item:any) => {
            if(item.isMesh){
                let list;
                if(Array.isArray(item.material)){
                    list = item.material;
                }
                else{
                    list = [item.material];
                    var map = item.material.map;
                    if(map && map.image){
                        var mat = Cache.getInstance().getTexture(map.image.src);
                        if(mat){
                            item.material = mat;
                            // console.log("使用缓存材质");
                        }
                        else{
                            Cache.getInstance().setTexture(map.image.src, item.material);
                        }
                    }
                }
                list.forEach((m:any) => {
                    if(m.map && m.map.image){
                        var src = m.map.image.currentSrc;
                        materials[src] = m;
                        temp.push(m);
                    }
                })
            }
        })

        var all = [];
        for(var i in materials){
            all.push(materials[i]);
        }
        console.log(temp.length + "所有材质个数: " + all.length);
        return [all, size];
    }

    public static loadData(url:string, complateHandler:Function, progressHandler?:Function):void{
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onprogress = (event) =>{
            if (event.lengthComputable) {
                let n = Math.floor(event.loaded / event.total * 100);
                // console.log(n + "%");
                // this.loading.update("加载中", n + "%");
                // this.add(this.loading);
                progressHandler && progressHandler(n);
            }
        };
        xhr.onreadystatechange = async () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    complateHandler && complateHandler(xhr.responseText);
                } else {
                    console.log("加载数据失败");
                    complateHandler && complateHandler();
                }
            } else {
                
            }
        }
        xhr.send();
    }

    public static rotateOnAxis(obj:THREE.Object3D, pivot:THREE.Vector3, axis: THREE.Vector3, r:number){
        // var scale = obj.scale.clone();
        var pot = pivot;
        var mat1 = new THREE.Matrix4().makeTranslation(pot.x, pot.y, pot.z);
        var mat2 = new THREE.Matrix4().makeRotationAxis(axis, r * Math.PI/ 180);
        var mat3 = new THREE.Matrix4().makeTranslation(-pot.x, -pot.y, -pot.z);
        obj.applyMatrix4(mat1.multiply(mat2).multiply(mat3));
        // obj.scale.set(scale.x, scale.y, scale.z);
    }

    public static farAway(p: THREE.Vector3, distance:number):THREE.Vector3{
        // var n = p.normalize();
        // return new THREE.Vector3(
        //     n.x * distance,
        //     n.y * distance,
        //     n.z * distance,
        // )
        return new THREE.Vector3(
            p.x, p.y, p.z - distance
        )
    }

    public static blob2ArrayBuffer(blob:any){
        return new Promise(resolve => {
            var reader = new FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onload = ()=>{
                resolve(reader.result);
            }
        })
    }

    public static validateLink(url:string, download:boolean = false){
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

    public static getJsonFromZip(zip:any){
        return new Promise(async resolve => {
            let fname = "design.json";
            for(var i in zip.files){
                // console.log(zip.files[i]);
                if(zip.files[i].name == fname){
                    let json = await zip.file(fname).async("string");
                    resolve(JSON.parse(json));
                }
            }
            resolve({});
        });
    }
    
    
    public static readZip(f:any){
        return new Promise(async resolve => {
            // var dateBefore:number = Date.now();
            (<any>window).JSZip.loadAsync(f).then(async function(zip:any) {
                // var dateAfter:number = Date.now();
                // let res = await zip.file(fname.replace(".zip", ".glb")).async("arraybuffer");
              
                let buffer = await zip.file("obj.glb").async("arraybuffer");
                let json = await Tooler.getJsonFromZip(zip);
                resolve({buffer, json});

                // let list:Array<any> = [];
                // //加载其他子模型
                // for(let i = 0; i < list.length; i++){
                //     await loadSubModel(list[i]);
                // }

                
            }, function (e:any) {
                resolve(null);
                // console.log("Error reading " + f.name + ": " + e.message);
            });
        }).catch(e=>{
            console.log("失败");
            console.log(e);
        })
    }

    public static loadModel(url:string){
        return new Promise(async resolve => {
            let flink = url.replace(/\.(glb|zip)/i, "");
            let isZip = false;

            url = flink + ".zip";
            isZip = true;

            // if(await Tooler.validateLink(flink + ".zip")){
            //     url = flink + ".zip";
            //     isZip = true;
            // }
            // else{
            //     url = flink + ".glb";
            // }

            let list = Tooler.getUrlPath(url);
            var modelPath = list[0];
            var modelName = list[1];

            if(Tooler.errorList.indexOf(modelPath + modelName) != -1){
                resolve(null);
                console.log("不存在：" + modelPath + modelName);
                return;
            }

            var xhr = new XMLHttpRequest();
            // xhr.open('GET', modelPath + modelName);

            var v = (new Date()).toLocaleString().split(" ")[0];
            // var v = Math.random();
            xhr.open('GET', modelPath + modelName + "?v=" + v);
            xhr.responseType = 'blob';
            xhr.onprogress = (event) =>{
                if (event.lengthComputable) {
                    let n = Math.floor(event.loaded / event.total * 100);
                    // this.loading.update("加载中", n + "%");
                    // this.add(this.loading);
                    window.dispatchEvent(new CustomEvent("model_progress", { bubbles: false, cancelable: false, detail: n}));
                }
            };
            xhr.onreadystatechange = async () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // resolve({blob: xhr.response, isZip});
                        let res = await Tooler.parseModel(xhr.response, isZip, url);
                        // console.log("loaded: " + url);
                        resolve(res);
                    } else {
                        Tooler.errorList.push(modelPath + modelName);
                        resolve(null);
                    }
                }
            }
            xhr.send();
        })
    }

    public static getRootModel(obj:THREE.Object3D):THREE.Object3D{
        var aim = obj;
        var level = 0;
        while (aim = aim.parent) {
            if(aim.type == "Scene"){
                break;
            }
            if(++level > 10){
                break;
            }
        }
        return aim;
    }

    public static httpGet(url:string){
        return new Promise((resolve)=>{
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            // xhr.responseType = 'blob';
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // resolve({blob: xhr.response, isZip});
                        resolve(xhr.response);
                    } else {
                        resolve(null);
                    }
                }
            }
            xhr.send();
        })
        
    }

    public static parseModel(blob: any, isZip:boolean, url:string){
        return new Promise(async resolve => {
            let list = Tooler.getUrlPath(url);
            let buffer:any, json:any, object3D;
            if(isZip){
                let res:any = await Tooler.readZip(blob);
                if(res){
                    buffer = res.buffer;
                    json = res.json;
                }
                else{
                    resolve(null);
                    return;
                }
            }
            else{
                buffer = await Tooler.blob2ArrayBuffer(blob);
                json = {};
            }
           
            let loader = new GLTFLoader();
            loader.setCrossOrigin('anonymous');
            // console.log("list[0] " + list[0]);
            loader.parse(buffer, list[0], (gltf:any) => {
                console.log("【GLTF数据】");
                console.log(gltf);
                resolve({
                    object3D: gltf.scene,
                    json: json
                });
            }, e=>{
                console.log("parse 错误");
                resolve(null);
            })
        }).catch(e=>{
            console.log("错误");
        })
    }

    public static toGLTFData(scene:any, fname:string){
        var embed = false;
        var exporter = new GLTFExporter();
        exporter.parse(scene, (result) => {
            console.log(result);
            if ( result instanceof ArrayBuffer ) {
                this.saveArrayBuffer( result, fname + '.glb' );
                this.getJsonFromArrayBuffer(result);
            } else {
                var output = JSON.stringify( result, null, 2 );
                this.saveString( output, fname + '.gltf' );
            }
        }, {
            binary: true,
            embedImages: embed,
            forcePowerOfTwoTextures: false,
            truncateDrawRange: false,
            trs: true
        });
    }

    public static getJsonFromArrayBuffer(data:ArrayBuffer):any{
        let dataView = new DataView(data);
        let len = dataView.getUint32(12, true);
        let contentArray = new Uint8Array( data, 20, len );
        let json = this.arrayBufferToString( contentArray );
        console.log(json);
    }

    public static arrayBufferToString(array: any):any {
        if ( typeof TextDecoder !== 'undefined' ) {
			return new TextDecoder().decode( array );
        }
        var s = '';
		for ( var i = 0, il = array.length; i < il; i ++ ) {
			s += String.fromCharCode( array[ i ] );
		}
		try {
			return decodeURIComponent( escape( s ) );
		} catch ( e ) {
			return s;
		}
    }
    
    public static save( blob:Blob, filename:string ) {
        var link = document.createElement( 'a' );
        link.style.display = 'none';
        document.body.appendChild( link );
        link.href = URL.createObjectURL( blob );
        link.download = filename;
        link.click();
    }
    
    public static saveString( text:string, filename:string ) {
        this.save( new Blob( [ text ], { type: 'text/plain' } ), filename );
    }

    public static saveArrayBuffer( buffer:any, filename:string ) {
        this.save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
    }

    public static getStageSize(usePixel?: boolean) {
        var size: any = { width: window.innerWidth };
        size.height = window.innerHeight;
        if (usePixel) {
            var dpr = window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio;
            size.width = size.width * dpr;
            size.height = size.height * dpr;
        }
        return size;
    }
}