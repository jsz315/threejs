import Stats from 'three/examples/jsm/libs/stats.module';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// import * as Ammo from '../asset/lib/ammo'

let Ammo:any;

export default class App{

    controls:OrbitControls;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    size:any;
    canvas: any;
    stats: any;
    clock: THREE.Clock;

    physicsWorld:any;

    constructor(){
        (window as any).Ammo().then((ammo:any)=>{
            Ammo = ammo;
            this.initStats();
            this.initGraphics();
            this.initPhysics();
            this.createObjects();
            this.initInput();
            this.animate();
        })
    }

    initStats(){
        this.stats = new Stats();
        this.stats.setMode(0); 
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        document.body.appendChild(this.stats.domElement);
        this.clock = new THREE.Clock();
    }

    initGraphics(){
        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 );

        this.scene = new THREE.Scene();
        this.camera.position.set(-7, 5, 8);

        this.canvas = document.getElementById("canvas") as any;
        this.controls = new OrbitControls( this.camera, this.canvas );
        this.controls.target.y = 2;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor( 0xbfd1e5 );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;

        var ambientLight = new THREE.AmbientLight( 0x404040 );
        this.scene.add( ambientLight );

        var light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( -10, 10, 5 );
        light.castShadow = true;
        var d = 20;
        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;

        light.shadow.camera.near = 2;
        light.shadow.camera.far = 50;

        light.shadow.mapSize.x = 1024;
        light.shadow.mapSize.y = 1024;

        this.scene.add( light );
        window.addEventListener( 'resize', this.onResize, false );
    }

    onResize(e:Event):void{
        this.size = this.getStageSize(true);
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        this.camera.aspect = this.size.width / this.size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.size.width, this.size.height);
    }

    getStageSize(usePixel?:boolean):any{
        var size:any = {width: window.innerWidth};
        if(window.innerWidth > window.innerHeight){
            size.height = window.innerHeight;
        }
        else{
            size.height = window.innerWidth;
        }
        if(usePixel){
            size.width = size.width * window.devicePixelRatio;
            size.height = size.height * window.devicePixelRatio;
        }
        return size;
    }

    initPhysics(){
        var collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
        var dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
        var broadphase = new Ammo.btDbvtBroadphase();
        var solver = new Ammo.btSequentialImpulseConstraintSolver();
        var softBodySolver = new Ammo.btDefaultSoftBodySolver();
        this.physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver);
        this.physicsWorld.setGravity( new Ammo.btVector3( 0, -9.8, 0 ) );
        this.physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, -9.8, 0 ) );
    }

    createObjects(){
        var box = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
        this.scene.add(box);
    }

    initInput(){

    }

    animate() {
        requestAnimationFrame(()=>{
            this.animate();
        });
        this.render();
        this.stats.update();
    }

    render() {
        // var deltaTime = clock.getDelta();
        // updatePhysics( deltaTime );
        // processClick();
        // controls.update( deltaTime );
        this.renderer.render( this.scene, this.camera );

    }

}