import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

export default class App {

    canvas: HTMLCanvasElement;
    scenes: Array<THREE.Scene>;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    stats: any;
    
    constructor() {
        this.canvas = document.getElementById("c") as HTMLCanvasElement;
        this.scenes = [];
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 900);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        });
        window.addEventListener("resize", e => this.onResize(e), false);
    }

    setStats(stats: any){
        this.stats = stats;
    }
    
    onResize(e:Event):void{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate():void {
        requestAnimationFrame(() => {
            this.animate();
        });

        // this.updateSize();

        // this.canvas.style.transform = `translateY(${window.scrollY}px)`;

        // this.renderer.setClearColor( 0xffffff );
        // this.renderer.setScissorTest( false );
        // this.renderer.clear();

        this.renderer.setClearColor( 0xe0e0e0 );
        this.renderer.setScissorTest( true );

        this.scenes.forEach(scene => {

            scene.children[ 0 ].rotation.y = Date.now() * 0.001;
            
            var element = scene.userData.element;
            
            var rect = element.getBoundingClientRect();
            
            if ( rect.bottom < 0 || rect.top > this.renderer.domElement.clientHeight ||
                    rect.right < 0 || rect.left > this.renderer.domElement.clientWidth ) {

                return;

            }

            var width = rect.right - rect.left;
            var height = rect.bottom - rect.top;
            var left = rect.left;
            var bottom = this.renderer.domElement.clientHeight - rect.bottom;

            this.renderer.setViewport( left, bottom, width, height );
            this.renderer.setScissor( left, bottom, width, height );

            var camera = scene.userData.camera;
            this.renderer.render( scene, camera );

        } );

        this.stats && this.stats.update();
    }

    updateSize():void {

        var width = this.canvas.clientWidth;
        var height = this.canvas.clientHeight;

        if ( this.canvas.width !== width || this.canvas.height !== height ) {

            this.renderer.setSize( width, height, false );

        }

    }

    updateGUIParam(param: any){
        
    }
    

    setup():void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0xffffff));
        document.body.appendChild(this.renderer.domElement);
       
        var geometries = [
            new THREE.BoxBufferGeometry( 1, 1, 1 ),
            new THREE.SphereBufferGeometry( 0.5, 18, 8 ),
            new THREE.DodecahedronBufferGeometry( 0.5 ),
            new THREE.CylinderBufferGeometry( 0.5, 0.5, 1, 12 ),
            new THREE.ConeBufferGeometry( 0.5, 1, 16 ),
            new THREE.IcosahedronGeometry( 1, 0 ),
            new THREE.OctahedronBufferGeometry( 1, 0 ),
            new THREE.TorusBufferGeometry( 10, 3, 16, 60 ),
            new THREE.TorusKnotBufferGeometry( 10, 3, 60, 16 ),
            new THREE.PlaneBufferGeometry( 1, 1 ),
            new THREE.CircleBufferGeometry( 0.5, 16 ),
            new THREE.RingBufferGeometry( 0.3, 0.5, 16 ),
        ];

        var template = (document.getElementById( "template" ) as any).text;
        var content = document.getElementById( "content" );

        for ( var i = 0; i < geometries.length; i ++ ) {

            var scene = new THREE.Scene();

            var element = document.createElement( "div" );
            element.className = "list-item";
            element.innerHTML = template;

            scene.userData.element = element.querySelector( ".scene" );
            content.appendChild( element );

            var camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
            camera.position.z = 2;
            scene.userData.camera = camera;

            var controls = new OrbitControls( scene.userData.camera, scene.userData.element );
            controls.minDistance = 2;
            controls.maxDistance = 5;
            controls.enablePan = false;
            controls.enableZoom = false;
            scene.userData.controls = controls;

            // add one random mesh to each scene
            var geometry = geometries[i];
            element.querySelector( ".description" ).innerHTML = geometry.type;

            var material = new THREE.MeshStandardMaterial( {

                color: new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
                roughness: 0.5,
                metalness: 0,
                flatShading: true,
                side: THREE.DoubleSide

            } );

            
            var mesh = new THREE.Mesh( geometry, material );
            var size = new THREE.Box3().setFromObject(mesh).getSize(new THREE.Vector3());
            var scale = 1 / Math.max(size.x, size.y, size.z);
            mesh.scale.set(scale, scale, scale);
            scene.add( mesh );

            scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );

            var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
            light.position.set( 1, 1, 1 );
            scene.add( light );

            this.scenes.push( scene );
        }

        this.animate();
    }
    
}