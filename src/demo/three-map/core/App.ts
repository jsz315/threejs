import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import listener from "../lib/listener"
import { MapView } from './MapView';
import { StageView } from './StageView';
import Tooler from './Tooler';
import Stats from 'three/examples/jsm/libs/stats.module';

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
    stats:any;
    rayCaster: THREE.Raycaster;

    render_stats:any;
    physics_stats:any;
    isMobile:boolean = Tooler.checkMobile();
    timer:any;
    pressing:boolean;
    pressKeyCode:number;

    constructor(canvas: any) {
        var size = Tooler.getStageSize(true);
        this.canvas = canvas;
        this.canvas.width = size.width;
        this.canvas.height = size.height;

        // this.scene = new THREE.Scene();
        this.scene = new Physijs.Scene({
            fixedTimeStep: 1 / 60
        });
        console.log(this.scene, 'scene');
        this.scene.setGravity(new THREE.Vector3( 0, -50, 0 ));

        this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 300);
        this.camera.position.set(5, 20, 18);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: this.canvas
        });
        // this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0xc9c9c9), 0.9);
        // this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMap.enabled = true;

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = true;

        this.stageView = new StageView();
        this.scene.add(this.stageView);

        this.addObj();

        var pot = Tooler.getOffsetVector3(this.scene);
        this.orbit.target = pot;
        this.orbit.enableKeys = false;
        this.orbit.update();

        this.rayCaster = new THREE.Raycaster();

        this.animate();
        window.addEventListener("resize", e => this.onResize(e), false);
        window.addEventListener("keydown", this.onDown.bind(this));
        window.addEventListener("keyup", this.onUp.bind(this));
        canvas.addEventListener(this.isMobile ? "touchstart" : "mousedown", (e: any) => this.select(e), false);
       
    }

    onKeyState(e:any){
        if(!this.pressing) return;
        console.log(this.pressKeyCode);
        var fnum = 100;
        var box: Physijs.BoxMesh = this.scene.getObjectByName("start") as Physijs.BoxMesh;
        var code = this.pressKeyCode;
        var offset = new THREE.Vector3(0, 0, 0);
        if(code == 37){
            box.applyImpulse(new THREE.Vector3(-fnum, 0, 0), offset);
        }
        else if(code == 39){
            box.applyImpulse(new THREE.Vector3(fnum, 0, 0), offset);
        }
        else if(code == 38){
            // box.setLinearVelocity(new THREE.Vector3(0, 0, -10));
            box.applyImpulse(new THREE.Vector3(0, 0, -fnum), offset);
        }
        else if(code == 40){
            // box.setLinearVelocity(new THREE.Vector3(0, 0, 10));
            box.applyImpulse(new THREE.Vector3(0, 0, fnum), offset);
        }
    }

    onUp(e:any){
        this.pressing = false;
        clearInterval(this.timer);
    }

    onDown(e:any){
        // console.log(e.keyCode);
        var box: Physijs.BoxMesh = this.scene.getObjectByName("start") as Physijs.BoxMesh;

        clearInterval(this.timer);
        this.timer = setInterval(this.onKeyState.bind(this), 30);
        this.pressing = true;

        this.pressKeyCode = e.keyCode;

        if(e.keyCode == 37){
            // box.setLinearVelocity(new THREE.Vector3(-10, 0, 0));
            // box.setAngularVelocity(new THREE.Vector3(-10, 0, 0));
            // box.applyImpulse(new THREE.Vector3(0, 400, 0), box.position);
            // box.applyForce(new THREE.Vector3(0, 1200, 0), new THREE.Vector3(0, 0, 0));
        }
        else if(e.keyCode == 39){
            // box.setLinearVelocity(new THREE.Vector3(10, 0, 0));
            // box.setAngularVelocity(new THREE.Vector3(10, 0, 0));
        }
        else if(e.keyCode == 38){
            // box.setLinearVelocity(new THREE.Vector3(0, 0, -10));
            // box.setAngularVelocity(new THREE.Vector3(0, 0, -10));
        }
        else if(e.keyCode == 40){
            // box.setLinearVelocity(new THREE.Vector3(0, 0, 10));
            // box.setAngularVelocity(new THREE.Vector3(0, 0, 10));
        }
        
    }

    select(e:any){
        if (this.isMobile) {
            e = e.changedTouches[0];
        }

        var size = Tooler.getStageSize(false);
        let mouse = new THREE.Vector2();
        mouse.x = (e.clientX / size.width) * 2 - 1;
        mouse.y = -(e.clientY / size.height) * 2 + 1;

        let obj: any;
        this.rayCaster.setFromCamera(mouse, this.camera);
        let list = this.scene.children;
        let intersectObjects = this.rayCaster.intersectObjects(list, true);
        if (intersectObjects[0]) {
            obj = intersectObjects[0].object;
            console.log(obj);
            // (obj as Physijs.BoxMesh).applyImpulse(new THREE.Vector3(0, 40, 0), new THREE.Vector3(0, 4, 0));
            // (obj as Physijs.BoxMesh).applyCentralForce(new THREE.Vector3(0, 40, 0));
            if(obj.name == 'start'){
                (obj as Physijs.BoxMesh).setLinearVelocity(new THREE.Vector3(0, 40, 0));
            }
        }
    }

    addObj(){
        var list = this.stageView.getViews();
        list.forEach((item:any) => {
            this.scene.add(item);
        })

        // var stats = new Stats();
        // stats.setMode(0); 
        // stats.domElement.style.position = 'absolute';
        // stats.domElement.style.left = '0px';
        // stats.domElement.style.top = '0px';
        // document.body.appendChild(stats.domElement);
        // this.stats = stats;

        // this.scene.addEventListener(
		// 	'update',
		// 	() => {
		// 		this.scene.simulate( undefined, 1 );
		// 	}
        // );
        
        var render_stats = new Stats();
		render_stats.domElement.style.position = 'absolute';
		render_stats.domElement.style.top = '1px';
		render_stats.domElement.style.zIndex = 100;
		document.body.appendChild( render_stats.domElement );

		var physics_stats = new Stats();
		physics_stats.domElement.style.position = 'absolute';
		physics_stats.domElement.style.top = '50px';
		physics_stats.domElement.style.zIndex = 100;
        document.body.appendChild( physics_stats.domElement );
        
        this.render_stats = render_stats;
        this.physics_stats = physics_stats;
    }


    onResize(e: Event): void {
        var size = Tooler.getStageSize(true);
        this.canvas.width = size.width;
        this.canvas.height = size.height;
        this.camera.aspect = size.width / size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(size.width, size.height);
    }

    animate(): void {
        this.renderer.render(this.scene, this.camera);
        this.scene.simulate(undefined, 1);
        // this.stats && this.stats.update();
        this.render_stats.update();
        this.physics_stats.update();
        requestAnimationFrame(() => {
            this.animate();
        });
    }
}