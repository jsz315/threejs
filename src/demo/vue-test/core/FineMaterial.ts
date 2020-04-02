import * as THREE from 'three'
import Cache from './Cache';
import {FineLoader} from './FineLoader';

export class FineMaterial{

    static textureLoader:THREE.TextureLoader = new THREE.TextureLoader();

    constructor(){

    }

    public static resetSameMaterial(obj: any, src:string):void{
        var material = Cache.getInstance().getTexture(src);
        if(material){
            obj.material = material;
        }
        else{
            Cache.getInstance().setTexture(src, obj.material);
        }
    }

    public static setTransparent(material:any, src:string):void{
        var transparent:boolean = false;
        if(src.indexOf(".png") != -1){
            transparent = true;
        }
        else if(src.indexOf("/glass.") != -1){
            material.opacity = 0.36;
            transparent = true;
        }
        else if(src.indexOf("/IGL_") != -1){
            transparent = true;
        }
        else if(src.indexOf("/BL123") != -1){
            transparent = true;
        }
        else if(src.indexOf("/bl_") != -1){
            transparent = true;
        }

        if(transparent){
            material.alphaTest = 0.2;
            material.transparent = true;
        }
    }

    public static async reloadMap(material: any, url: string){
        return new Promise(resolve=>{
            let map = material.map;
            this.textureLoader.load(url, (t:THREE.Texture) => {
                // material.map.needsUpdate = true;//暂时添加
                // material.needsUpdate = true;

                t.wrapS = map.wrapS;
                t.wrapT = map.wrapT;
                t.repeat = new THREE.Vector2(map.repeat.x, map.repeat.y);
                t.flipY = map.flipY;
                // t.flipX = map.flipX;
                material.map = t;
                material.needsUpdate = true;

                setTimeout(() => {
                    resolve();
                }, 1);
                
            });
    
            
        })
    }

    public static async lightMap(scene:THREE.Object3D){
        console.log("【物体变亮处理】");
        var i;
        var total = 0;
        var aim:any = [];
        scene.traverse((item:any) => {
            if(item.isMesh){
                // var isWall = this.checkWall(item);

                if(Cache.getInstance().hasLight(item)){
                    console.log('已经处理');
                    return;
                }

                let list = Array.isArray(item.material) ? item.material : [item.material];
                for(i = 0; i < list.length; i++){
                    var m = list[i];
                    if(m.map && m.map.image){
                        ++total;
                        if(aim.indexOf(m) == -1){
                            aim.push(m);
                            // if(isWall){
                            //     m.roughness = 0.96;
                            //     m.metalness = 0.04;
                            //     m.flatShading = false;
                            // }
                        }
                    }
                }
            }
        })

        console.log("处理个数：" + total + " => " + aim.length);
        for(i = 0; i < aim.length; i++){
            await this.reloadMap(aim[i], aim[i].map.image.src);
        }
        console.log("【物体变亮完成】");
    }

    public static checkWall(item:any):boolean{
        if(item.name == 'floor'){
            return true;
        }
        else if(item.name == 'top'){
            return true;
        }
        else if(item.name == 'left'){
            return true;
        }
        else if(item.name == 'ceiling'){
            return true;
        }
        else if(item.name == 'roof'){
            return true;
        }
        else if(item.name == 'back'){
            return true;
        }
        else if(item.name == 'front'){
            return true;
        }
        return item.name.indexOf('wall') != -1;
    }
    
    public static getMapMaterials(obj: THREE.Object3D):any{
        let materials:any = {};
        let all:any =[];
        let total = 0;
        
        obj.traverse((item:any) => {
            var isWall = this.checkWall(item);
            if(item.isMesh){
                let list = Array.isArray(item.material) ? item.material : [item.material];
                list.forEach((m:any) => {
                    if(m.map && m.map.image){
                        var src = m.map.image.currentSrc;
                        if(isWall){
                            this.resetSameMaterial(item, src);
                            m.roughness = 0.96;
                            m.metalness = 0.04;
                            m.flatShading = false;
                        }
                        else{
                            if(all.indexOf(m) == -1){
                                all.push(m);
                            }
                        }
                        this.setTransparent(m, src);
                        materials[src] = m;
                        ++total;
                    }
                })
            }
        })

        var aim = [];
        for(var i in materials){
            aim.push(materials[i]);
        }
        aim = all;
        console.log("去重贴图：" + total + " => " + aim.length);
        return aim;
    }

}