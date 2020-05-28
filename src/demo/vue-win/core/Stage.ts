import * as THREE from 'three'
import FocusLight from './FocusLight';

export default class Stage extends THREE.Object3D{

    focusLight: FocusLight;
    ambientLight: THREE.AmbientLight;

    focusLightIntensity: number;
    ambientLightIntensity: number;

    constructor(){
        super();

        this.addSkySphere(25000 * 2);
        this.addGrass(50000 * 2);
        this.addLights();
        this.addAxis(30000);
    }

    addAxis(size:number):void{
        if(window.location.search.indexOf("debug=1") != -1){
            this.add(new THREE.AxesHelper(size));
        }
    }

    setAmbient(n: number): void {
        // var ambient: any = this.scene.getObjectByName("ambient");
        this.ambientLight.intensity = n;
        this.ambientLightIntensity = n;
    }

    setDirectional(n: number): void {
        this.focusLight.intensity = n;
        this.focusLightIntensity = n;
    }
    

    addGrass(size:number){
        var mat = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load("./asset/grass2.jpg"),
            side: THREE.DoubleSide
        })
        mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
        mat.map.repeat.set(100, 100);
        // mat.metalness = 0;
        // mat.roughness = 1;
        var plane = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
        plane.rotateX(-90 * Math.PI / 180);
        plane.name = "grass";
        plane.position.y = -30;
        this.add(plane);
    }

    addLights(): void {
        this.ambientLight = new THREE.AmbientLight(0xffffff);
        this.ambientLight.intensity = this.ambientLightIntensity;
        this.ambientLight.name = "ambient";
        this.add(this.ambientLight);

        var hemishpereLight:THREE.HemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffff00);
        hemishpereLight.intensity = 0.12;
        this.add(hemishpereLight);

        this.focusLight = new FocusLight(this, 0xffffff, this.focusLightIntensity);
        this.add(this.focusLight);
    }

    addSkySphere(size:number){
        var mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./asset/sky.jpg"),
                side: THREE.BackSide
            });
        var sky = new THREE.Mesh(new THREE.SphereGeometry(size, 32, 32), mat);
        sky.name = "sky";
        this.add(sky);
    }

}