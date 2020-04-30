import * as THREE from 'three'
import Tooler from './Tooler';
import { FineLoader } from './FineLoader';
import { Effect } from './Effect';
import listener from '../lib/listener';
import TextureList from './TextureList';
import { FreeCamera }  from './FreeCamera';
import {FineMaterial} from './FineMaterial';
import Stage from './Stage';
import ViewHelper from './ViewHelper';
import Cache from './Cache';
const TWEEN = require('../lib/Tween.js');
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class App {
    public static ZERO: THREE.Vector3 = new THREE.Vector3();
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    stats: any;
    fineLoader: FineLoader;

    roughness: number = 0;
    metalness: number = 0;
    stage: Stage;

    rayCaster: THREE.Raycaster;
    isMobile: boolean;
    frameMaterials: any = [];
    effects: Array<Effect>;
    size: any;
    canvas: any;
    repeat: any;
    textureList: TextureList;
    isFitScene: boolean;
    
    frame:number = 0;
    // isIphone:boolean = navigator.userAgent.indexOf('iPhone') > -1;
    // isDebug:boolean = Tooler.getQueryString("debug") == 1;
    spaceFrame: number = 1;

    helper:ViewHelper;
    textureLoader: THREE.TextureLoader = new THREE.TextureLoader();

    constructor(canvas: any, size: any) {
        this.size = Tooler.getStageSize(true);
        this.canvas = canvas;
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            canvas: this.canvas
        });
        this.camera = new FreeCamera(this.canvas);
        // this.orbit = new OrbitControls(this.camera, this.canvas);
        // this.orbit.enabled = true;

        // this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2: 1);
        this.renderer.setClearColor(new THREE.Color(0xa8a8a8), 0);
        // this.renderer.shadowMap.enabled = true;//关闭阴影

        // this.scene.background = Cache.getInstance().cubeTexture;
        // this.fineLoader = new FineLoader();
        // this.scene.add(this.fineLoader);
        // this.stage = new Stage();
        // this.scene.add(this.stage);

        this.isMobile = Tooler.checkMobile();
        this.rayCaster = new THREE.Raycaster();

        window.addEventListener("resize", e => this.onResize(e), false);
        canvas.addEventListener(this.isMobile ? "touchstart" : "mousedown", (e: any) => this.select(e), false);
    }

    setup(){
        this.animate();
        this.addObj();
    }

    onResize(e: Event): void {
        this.size = Tooler.getStageSize(true);
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        this.camera.aspect = this.size.width / this.size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.size.width, this.size.height);
    }

    animate(): void {
        requestAnimationFrame(() => {
            this.animate();
        });

        // this.camera.update();
        this.stats && this.stats.update();
        this.renderer.render(this.scene, this.camera);
        // TWEEN.update();
    }

    setStats(stats: any): void {
        this.stats = stats;
    }

    select(e: any): any {
        if (this.isMobile) {
            e = e.changedTouches[0];
        }
        var size = Tooler.getStageSize(false);
        let mouse = new THREE.Vector2();
        mouse.x = (e.clientX / size.width) * 2 - 1;
        mouse.y = -(e.clientY / size.height) * 2 + 1;
  
        this.camera.updateProjectionMatrix();

        let obj: any;
        this.rayCaster.setFromCamera(mouse, this.camera);
        let list = this.scene.children;
        let intersectObjects = this.rayCaster.intersectObjects(list, true);
        if (intersectObjects[0]) {
            obj = intersectObjects[0].object;
            console.log(obj);
        }
    }

    addObj():void{
        var box:THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshNormalMaterial());
        box.position.set(0, 0, 0);
        this.scene.add(box);
    }
}