import * as THREE from 'three'

export default class Cache {
    
    static _instance: Cache;
    model:any;
    animate: any;
    texture: any;

    constructor(){
        this.model = {};
        this.animate = {};
        this.texture = {};
    }

    public static getInstance():Cache{
        if(!this._instance){
            this._instance = new Cache();
        }
		return this._instance;
	}

    getMesh(url:string):THREE.Mesh{
        if(this.model[url]){
            console.warn('使用缓存(' + (this.model[url].times++) + ')' + url);
            return this.model[url].mesh.clone();
        }
        return null;
    }

    setMesh(url:string, mesh:THREE.Mesh):void{
        this.model[url] = {
            mesh: mesh,
            times: 1
        };
    }

    getAnimate(url:string):any{
        if(this.animate[url]){
            console.warn('使用缓存(' + (this.animate[url].times++) + ')' + url);
            return this.animate[url].animate;
        }
        return null;
    }

    setAnimate(url:string, animate:any):void{
        this.animate[url] = {
            animate: animate,
            times: 1
        };
    }

    getTexture(url:string):any{
        if(this.texture[url]){
            console.warn('使用缓存(' + (this.texture[url].times++) + ')' + url);
            return this.texture[url].texture;
        }
        return null;
    }

    setTexture(url:string, texture:any):void{
        this.texture[url] = {
            texture: texture,
            times: 1
        };
    }


}