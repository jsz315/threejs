import * as THREE from "three";
export default class Store{

    sphereGeos:any = [];
    boxGeos:any = [];
    cylinderGeos:any = [];
    mats:any = [];

    constructor(){

        for(var i = 0; i < 8; i++){
            this.sphereGeos.push(new THREE.SphereGeometry(0.2 + Math.random() * 2, 16, 16));
            let r = Math.random() * 2 + 0.4;
            this.cylinderGeos.push(new THREE.CylinderGeometry(r, r, 2 * r, 8));

            let size = 0.2 + Math.random() * 2;
            this.boxGeos.push(new THREE.BoxGeometry(size, size, size));

            let color = new THREE.Color(0xffffff);
            let mat:THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({color});
            mat.map = new THREE.TextureLoader().load("/asset/img/m" + (i % 6 + 1) + ".jpg");
            mat.emissive = new THREE.Color(0, 0, 0);
            mat.metalness = 0.2;
            mat.roughness = 0.4;
            this.mats.push(mat);
        }
        
    }

    getBufferGeometry(type:string){
        let geo;
        if(type == "box"){
            geo = this.getBoxBufferGeometry();
        }
        else if(type == "sphere"){
            geo = this.getSphereBufferGeometry();
        }
        if(type == "cylinder"){
            geo = this.getCylinderBufferGeometry();
        }
        return new THREE.BufferGeometry().fromGeometry(geo);
    }

    getSphereBufferGeometry(){
        let n = Math.floor(Math.random() * this.sphereGeos.length);
        return this.sphereGeos[n];
    }

    getBoxBufferGeometry(){
        let n = Math.floor(Math.random() * this.boxGeos.length);
        return this.boxGeos[n];
    }

    getCylinderBufferGeometry(){
        let n = Math.floor(Math.random() * this.cylinderGeos.length);
        return this.cylinderGeos[n];
    }

    getMaterial(){
        let n = Math.floor(Math.random() * this.mats.length);
        return this.mats[n];
    }
}