import * as THREE from "three";
export default class Store{

    sphereGeos:any = [];
    boxGeos:any = [];
    mats:any = [];

    constructor(){

        for(var i = 0; i < 8; i++){
            this.sphereGeos.push(new THREE.SphereGeometry(0.2 + Math.random() * 2, 10, 10));

            let size = 0.2 + Math.random() * 2;
            this.boxGeos.push(new THREE.BoxGeometry(size, size, size));

            let color = new THREE.Color(0xffffff);
            let mat:THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({color});
            mat.map = new THREE.TextureLoader().load("/asset/img/m" + (i % 6 + 1) + ".jpg");
            mat.emissive = new THREE.Color(0, 0, 0);
            mat.metalness = 0.1;
            mat.roughness = 0.7;
            this.mats.push(mat);
        }
        
    }

    getSphereBufferGeometry(){
        let n = Math.floor(Math.random() * this.sphereGeos.length);
        return this.sphereGeos[n];
    }

    getBoxBufferGeometry(){
        let n = Math.floor(Math.random() * this.boxGeos.length);
        return this.boxGeos[n];
    }

    getMaterial(){
        let n = Math.floor(Math.random() * this.mats.length);
        return this.mats[n];
    }
}