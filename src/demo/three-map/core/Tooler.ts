import * as THREE from 'three'

export default class Tooler{

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
        let max = Math.max(size.x, size.y, size.z);
        let scale = num / max;
        return scale;
    }

    public static getUrlPath(url:string):any[]{
        url = this.getLink(url);
        let list = url.split("/");
        let aim = list.pop();
        let path = list.join("/") + "/";
        console.log(path);
        console.log(aim);
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

    public static getAllMaterial(obj: THREE.Object3D):any{
        let size:number = 1;
        let materials:any = [];
        obj.traverse((item:any) => {
            if(item.isMesh){
                let list;
                if(Array.isArray(item.material)){
                    list = item.material;
                }
                else{
                    list = [item.material];
                }
                list.forEach((m:any) => {
                    if(m.map){
                        materials.push(m);
                        // m.map.flipY = true;
                        // m.map.flipX = true;
                    }
                })
                let temp = Math.max(...item.geometry.attributes.uv.array);
                size = Math.max(temp, size);
            }
        })

        if(size > 2){
            size = 2;
        }

        return [materials, size];
    }

    public static loadData(url:string, complateHandler:Function, progressHandler?:Function):void{
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onprogress = (event) =>{
            if (event.lengthComputable) {
                let n = Math.floor(event.loaded / event.total * 100);
                console.log(n + "%");
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
        var n = p.normalize();
        return new THREE.Vector3(
            n.x * distance,
            n.y * distance,
            n.z * distance,
        )
    }

}