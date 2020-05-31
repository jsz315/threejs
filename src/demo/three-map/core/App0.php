import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import listener from "../lib/listener"
import { MapView } from './MapView';
import { StageView } from './StageView';
import Tooler from './Tooler';

// import Worker from './Physics.worker'
// import Worker from "worker-loader!./Worker";
// import Worker from "worker-loader!./Worker";

import * as Physijs from 'physijs';

export default class App {
    scene: Physijs.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    canvas: any;
    stageView:StageView;

    constructor(canvas: any) {
        var size = this.getStageSize(true);
        this.canvas = canvas;
        this.canvas.width = size.width;
        this.canvas.height = size.height;

        // this.scene = new THREE.Scene();
        // this.scene = new Physijs.Scene();
        // this.scene.setGravity(new THREE.Vector3( 0, -10, 0 ));

        this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 300);
        this.camera.position.set(5, 10, 12);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: this.canvas
        });
        // this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0xc9c9c9), 0.9);
        this.renderer.shadowMap.enabled = false;
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = true;

        // this.stageView = new StageView();
        // this.scene.add(this.stageView);

        this.addObj();

        var pot = Tooler.getOffsetVector3(this.stageView);
        this.orbit.target = pot;
        this.orbit.update();

        this.animate();
        window.addEventListener("resize", e => this.onResize(e), false);
        // canvas.addEventListener(this.isMobile ? "touchstart" : "mousedown", (e: any) => this.select(e), false);
    }

    addObj(){

    }

    getStageSize(usePixel?: boolean) {
        var size: any = { width: window.innerWidth };
        size.height = window.innerHeight;
        
        if (usePixel) {
            var dpr = window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio;
            size.width = size.width * dpr;
            size.height = size.height * dpr;
        }
        return size;
    }

    onResize(e: Event): void {
        var size = this.getStageSize(true);
        this.canvas.width = size.width;
        this.canvas.height = size.height;
        this.camera.aspect = size.width / size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(size.width, size.height);
    }

    animate(): void {
        this.renderer.render(this.scene, this.camera);
        this.scene.simulate();
        requestAnimationFrame(() => {
            this.animate();
        });
    }
}