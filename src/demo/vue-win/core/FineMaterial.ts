import * as THREE from 'three'
import Cache from './Cache';
import {FineLoader} from './FineLoader';
import Tooler from '../../3d-viewer/core/Tooler';

export class FineMaterial{

    static textureLoader:THREE.TextureLoader = new THREE.TextureLoader();

    static roughness:number = 0;
    static metalness:number = 0;
    static NormalRoughness:number = 0.96;
    static NormalMetalness:number = 0.04;
    static frameMaterials:any = [];

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

    public static setTransparent(material:any, src:string, mesh:any):void{
        var transparent:boolean = false;
        var changed:boolean = false;
        if(src.indexOf("/glass.") != -1){
            transparent = true;
            changed = true;
        }
        else if(src.indexOf("/IGL_") != -1){
            transparent = true;
            changed = true;
        }
        else if(src.indexOf("/BL123") != -1){
            transparent = true;
            changed = true;
        }
        else if(src.indexOf("/bl_") != -1){
            transparent = true;
        }

        if(src.indexOf(".png") != -1){
            transparent = true;
        }

        if(src.indexOf("grfg.png") != -1){
            transparent = true;
            changed = true;
        }
        else if(src.indexOf("jhyj.png") != -1){
            transparent = true;
            changed = true;
        }
        else if(src.indexOf("rhgr.png") != -1){
            transparent = true;
            changed = true;
        }

        if(transparent){
            material.transparent = true;
            if(changed){
                mesh.material = Cache.getInstance().changeMaterial(src);
            }
        }

        
        if (src.indexOf("/IPR_") != -1) {
            FineMaterial.frameMaterials.push(material);
            material.roughness = FineMaterial.roughness;
            material.metalness = FineMaterial.metalness;
        }
        else if(src.indexOf("dif_") != -1){
            if(src.indexOf("dif_wa") == -1){
                FineMaterial.frameMaterials.push(material);
                material.roughness = FineMaterial.roughness;
                material.metalness = FineMaterial.metalness;
            }
            if(src.indexOf("dif_00") != -1){
                material.roughness = FineMaterial.NormalRoughness;
                material.metalness = FineMaterial.NormalMetalness;
                material.flatShading = false;
            }
        }
        else if(src.indexOf("dif2_") != -1){
            material.roughness = FineMaterial.NormalRoughness;
            material.metalness = FineMaterial.NormalMetalness;
            material.flatShading = false;
        }
        else if(src.indexOf("dif3_") != -1){
            material.roughness = FineMaterial.NormalRoughness;
            material.metalness = FineMaterial.NormalMetalness;
            material.flatShading = false;
        }
    }

    public static async reloadMap(material: any, url: string){
        return new Promise(resolve=>{
            /*
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
                }, 20);
                
            });
            */
           let map = material.map;
           map.encoding = THREE.LinearEncoding;
           material.needsUpdate = true;
           resolve();
        })
    }

    public static async changeMap(material:any, url:string){
        return new Promise(resolve=>{
            var m = Cache.getInstance().getMap(url);
            if(m){
                material.map = m;
                material.needsUpdate = true;
                console.log('使用缓存图片替换');
                resolve();
            }
            else{
                var map = material.map;
                this.textureLoader.load(url, (t:THREE.Texture) => {
                    t.wrapS = map.wrapS;
                    t.wrapT = map.wrapT;
                    t.repeat = new THREE.Vector2(map.repeat.x, map.repeat.y);
                    t.flipY = map.flipY;
                    material.map = t;
                    material.needsUpdate = true;
                    console.log("加载替换图片完成");
                    Cache.getInstance().setMap(url, t);
                    resolve();
                });
            }
            
        })
        
    }

    public static async lightMap(scene:THREE.Object3D){
        console.log("【物体变亮处理】");
        if(Tooler.getQueryString('light') == 0){
            return;
        }
        var i;
        var total = 0;
        var aim:any = [];
        scene.traverse((item:any) => {
            if(item.isMesh){
                // var isWall = this.checkWall(item);

                if(Cache.getInstance().hasLight(item)){
                    // console.log('已经处理');
                    return;
                }

                let list = Array.isArray(item.material) ? item.material : [item.material];
                for(i = 0; i < list.length; i++){
                    var m = list[i];
                    if(m.map && m.map.image){
                        ++total;
                        if(aim.indexOf(m) == -1){
                            aim.push(m);
                        }
                    }
                }
            }
        })

        // console.log("处理个数：" + total + " => " + aim.length);
        // for(i = 0; i < aim.length; i++){
        //     await this.reloadMap(aim[i], aim[i].map.image.src);
        // }
        // console.log("【物体变亮完成】");
        this.reloadImage(aim, 0);
    }

    public static async reloadImage(aim:any, id:number) {
        if(id <= aim.length - 1){
            await this.reloadMap(aim[id], aim[id].map.image.src);
            // console.log('变亮处理' + id);
            this.reloadImage(aim, ++id);
        }
        else{
            console.log('【物体变亮完成】', aim.length);
        }
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
        // else if(item.name.indexOf('dif2_') != -1){
        //     return true;
        // }
        return item.name.indexOf('wall') != -1;
    }

    public static resetMaterial(){

    }
    
    public static async getMapMaterials(obj: THREE.Object3D, replaceMap:any[]){
        // let materials:any = {};
        // let all:any = [];
        // let total = 0;
        let willReplaces: any = [];
        let classMaterial: any = {};
        console.log('replaceMap', replaceMap);
        return new Promise(async resolve => {
            obj.traverse(async (item:any) => {
                var isWall = this.checkWall(item);
                if(item.isMesh){
                    let list = Array.isArray(item.material) ? item.material : [item.material];
                    list.forEach((m:any) => {
                        if(m.map && m.map.image){
                            var src = m.map.image.src;
                            if(replaceMap.length > 0){
                                for(var i = 0; i < replaceMap.length; i++){
                                    var obj = replaceMap[i];
                                    if(obj.type == 'name'){
                                        if(item.name.indexOf(obj.key) != -1){
                                            if(!classMaterial[i]){
                                                console.log("复制新材质");
                                                classMaterial[i] = item.material.clone();
                                                
                                            }
                                            m = item.material = classMaterial[i];

                                            willReplaces.push({
                                                material: m,
                                                url: obj.url
                                            })
                                        }
                                    }
                                    else if(obj.type == 'link'){
                                        // if(src.indexOf(obj.key) != -1){
                                        if(src.match(obj.key)){
                                            willReplaces.push({
                                                material: m,
                                                url: obj.url
                                            })
                                        }
                                        
                                    }
                                }
                            }
                            
                            if(isWall){
                                this.resetSameMaterial(item, src);
                                m.roughness = FineMaterial.NormalRoughness;
                                m.metalness = FineMaterial.NormalMetalness;
                                m.flatShading = false;
                            }
                            this.setTransparent(m, src, item);
                        }
                    })
                }
            })
            

            for(var j = 0; j < willReplaces.length; j++){
                await FineMaterial.changeMap(willReplaces[j].material, willReplaces[j].url);
            }
            resolve();
        })
        
    }

}