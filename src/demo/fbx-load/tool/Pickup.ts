import * as THREE from 'three'
import Tooler from '../Tooler'

export default class Pickup{

    isMobile:boolean;
    rayCaster: THREE.Raycaster = new THREE.Raycaster();
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;

    constructor(canvas:HTMLCanvasElement, scene: THREE.Scene, camera: THREE.PerspectiveCamera){
        this.scene = scene;
        this.camera = camera;
        this.isMobile = Tooler.checkMobile();
        canvas.addEventListener(this.isMobile ? "touchstart" : "mousedown", (e: any) => this.choose(e), false);
    }

    choose(e: any) {
        this.isMobile && (e = e.changedTouches[0]);

        let mouse = new THREE.Vector2();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        let obj: any;
        this.rayCaster.setFromCamera(mouse, this.camera);
        let list = this.scene.children;
        let intersectObjects = this.rayCaster.intersectObjects(list, true);
        if (intersectObjects[0]) {
            obj = intersectObjects[0].object;
            console.log(obj);
        }
    }
}