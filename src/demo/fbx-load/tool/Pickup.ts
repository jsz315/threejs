import * as THREE from 'three'
import Tooler from '../Tooler'

export default class Pickup{

    isMobile:boolean;
    rayCaster: THREE.Raycaster = new THREE.Raycaster();
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    light:THREE.DirectionalLight;
    lightHelper:THREE.DirectionalLightHelper;
    aim:THREE.Object3D;

    constructor(canvas:HTMLCanvasElement, scene: THREE.Scene, camera: THREE.PerspectiveCamera){
        this.scene = scene;
        this.camera = camera;
        this.isMobile = Tooler.checkMobile();

        this.aim = new THREE.Object3D;

        this.light = new THREE.DirectionalLight(new THREE.Color(0xff0000), 0.8);
        console.log(this.light, 'light');
        this.lightHelper = new THREE.DirectionalLightHelper(this.light);
        this.scene.add(this.light);
        this.scene.add(this.lightHelper);
        canvas.addEventListener(this.isMobile ? "touchstart" : "mousedown", (e: any) => this.choose(e), false);
    }

    choose(e: any) {
        this.isMobile && (e = e.changedTouches[0]);
        // this.addPoint(e.clientX, e.clientY);

        let mouse = new THREE.Vector2();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        let obj: any;
        this.rayCaster.setFromCamera(mouse, this.camera);
        // let list = this.scene.children;
        // let list = [this.scene.getObjectByName('ball')];
        var ball = this.scene.getObjectByName('ball');
        console.log(this.scene);
        // var list = [ball];
        var list = this.scene.getObjectByName("3dxy").children;
        let intersectObjects = this.rayCaster.intersectObjects(list, true);
        if (intersectObjects[0]) {
            obj = intersectObjects[0].object;
            console.log(obj);
            this.addBox(intersectObjects[0].point);
        }
    }

    convertTo3DCoordinate(clientX:number, clientY:number){
        console.log("cx: " + clientX + ", cy: " + clientY);
        var mv = new THREE.Vector3(
            (clientX / window.innerWidth) * 2 - 1,
            -(clientY / window.innerHeight) * 2 + 1,
            0.5
        );
        console.log("mx: " + mv.x + ", my: " + mv.y+", mz:"+mv.z);
        mv.unproject(this.camera);
        console.log("x: " + mv.x + ", y: " + mv.y+", z:"+mv.z);
        return mv;
    }

    addBox(pot:THREE.Vector3){
        var mesh:THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
        mesh.position.copy(pot);
        this.scene.add(mesh);

        this.light.position.copy(pot);
        this.light.target = this.aim;
        this.lightHelper.update();
    }

    addPoint(clientX:number, clientY:number){
        var pot:THREE.Vector3 = this.convertTo3DCoordinate(clientX, clientY);
        var mesh:THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
        mesh.position.set(pot.x, pot.y, pot.z);
        this.scene.add(mesh);
    }
}