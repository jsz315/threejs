import * as THREE from 'three'

export default class Cache {
    
    static _instance: Cache;
    model:any;
    animate: any;
    texture: any;
    lightMesh: any;
    glass: any;
    cubeTexture: any;

    constructor(){
        this.model = {};
        this.animate = {};
        this.texture = {};
        this.lightMesh = [];
        this.glass = {};
 
        let cubeTextureLoader:THREE.CubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.setPath( './asset/skybox/' );
        this.cubeTexture = cubeTextureLoader.load( [
            // '1px.jpg', '1nx.jpg',
            // '1py.jpg', '1ny.jpg',
            // '1pz.jpg', '1nz.jpg'

            'px.jpg', 'nx.jpg',
            'py.jpg', 'ny.jpg',
            'pz.jpg', 'nz.jpg',
        ] );
        this.cubeTexture.format = THREE.RGBFormat;
        this.cubeTexture.mapping = THREE.CubeReflectionMapping;
  

        // this.cubeTexture = new THREE.TextureLoader().load("./asset/grass2.jpg"),
        // this.cubeTexture.format = THREE.RGBFormat;
        // this.cubeTexture.mapping = THREE.CubeReflectionMapping;

    }

    public static getInstance():Cache{
        if(!this._instance){
            this._instance = new Cache();
        }
		return this._instance;
    }
    
    changeMaterial(src: string):any{
        if(this.glass[src]){
            // console.log("玻璃材质重复使用");
            return this.glass[src];
        }
        var material = new THREE.MeshPhongMaterial({
            // color: new THREE.Color('#FFFFFF'),
            envMap: this.cubeTexture,
            transparent: true,
            alphaTest: 0.2,
            opacity: 0.54,
            // emissive: new THREE.Color("#5bd4cf"),
            emissive: new THREE.Color("#ffffff"),
            emissiveIntensity: 0.8
        });

        material.map = new THREE.TextureLoader().load('https://3d.mendaoyun.com/data/upload/model_store/125/CPP0015861/a3d/grfg.png');
        // material.map = new THREE.TextureLoader().load(src);
        this.glass[src] = material;
        return material;
    }

    getMesh(url:string):THREE.Mesh{
        if(this.model[url]){
            // console.warn('使用缓存(' + (this.model[url].times++) + ')' + url);
            return this.model[url].data.clone();
        }
        return null;
    }

    setMesh(url:string, mesh:THREE.Mesh):void{
        this.model[url] = {
            data: mesh,
            times: 1
        };
    }

    getAnimate(url:string):any{
        if(this.animate[url]){
            // console.warn('使用缓存(' + (this.animate[url].times++) + ')' + url);
            return this.animate[url].data;
        }
        return null;
    }

    setAnimate(url:string, animate:any):void{
        this.animate[url] = {
            data: animate,
            times: 1
        };
    }

    getTexture(url:string):any{
        if(this.texture[url]){
            // console.warn('使用缓存(' + (this.texture[url].times++) + ')' + url);
            return this.texture[url].data;
        }
        return null;
    }

    setTexture(url:string, texture:any):void{
        this.texture[url] = {
            data: texture,
            times: 1
        };
    }

    hasLight(mesh:any):boolean{
        var n = this.lightMesh.indexOf(mesh);
        if(n == -1){
            this.lightMesh.push(mesh);
            return false;
        }
        return true;
    }

}