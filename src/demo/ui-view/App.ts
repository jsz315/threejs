import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 
import { DragControls } from 'three/examples/jsm/controls/DragControls'

export default class App {
    
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    stats: any;

    box:THREE.Mesh;
    cameraOrtho: THREE.OrthographicCamera;
    sceneOrtho: THREE.Scene;

    spriteBL: THREE.Sprite;
    spriteTL: THREE.Sprite;
    spriteBR: THREE.Sprite;
    spriteTR: THREE.Sprite;
    spriteC: THREE.Sprite;

    
    raycaster: THREE.Raycaster;
    mouseVector: THREE.Vector3;
    selectedObject: THREE.Sprite;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 900);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.autoClear = false;

        this.cameraOrtho = new THREE.OrthographicCamera( - window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, - window.innerHeight / 2, 0, 100 );
        this.cameraOrtho.position.z = 100;
        this.sceneOrtho = new THREE.Scene();

        this.raycaster = new THREE.Raycaster();
		this.mouseVector = new THREE.Vector3();

        window.addEventListener("resize", e => this.onResize(e), false);
        window.addEventListener( "mousedown", e => this.onDocumentMouseDown(e), false );
    }

    onDocumentMouseDown( event:any ) {
        event.preventDefault();
        if ( this.selectedObject ) {
            this.selectedObject.material.color.set( '#ff9900' );
            this.selectedObject = null;
        }

        var intersects = this.getIntersects( event.layerX, event.layerY );
        if ( intersects.length > 0 ) {

            var res = intersects.filter( function ( res:any ) {

                return res && res.object;

            } )[ 0 ];

            if ( res && res.object ) {

                this.selectedObject = res.object as THREE.Sprite;
                this.selectedObject.material.color.set( '#f00' );

            }

        }

    }

    getIntersects( x:number, y:number ) {

        x = ( x / window.innerWidth ) * 2 - 1;
        y = - ( y / window.innerHeight ) * 2 + 1;

        this.mouseVector.set( x, y, 0.5 );
        this.raycaster.setFromCamera( this.mouseVector, this.cameraOrtho );

        return this.raycaster.intersectObject( this.sceneOrtho, true );

    }

    
    onResize(e:Event):void{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        var width = window.innerWidth;
        var height = window.innerHeight;

        this.cameraOrtho.left = - width / 2;
        this.cameraOrtho.right = width / 2;
        this.cameraOrtho.top = height / 2;
        this.cameraOrtho.bottom = - height / 2;
        this.cameraOrtho.updateProjectionMatrix();

        this.updateHUDSprites();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateHUDSprites(){
        var width = window.innerWidth / 2;
        var height = window.innerHeight / 2;

        this.spriteTL.position.set( - width, height, 1 ); // top left
        this.spriteTR.position.set( width, height, 1 ); // top right
        this.spriteBL.position.set( - width, - height, 1 ); // bottom left
        this.spriteBR.position.set( width, - height, 1 ); // bottom right
        this.spriteC.position.set( 0, 0, 1 ); // center
    }

    setStats(stats: any):void{
        this.stats = stats;
    }

    animate():void {
        
        this.camera.lookAt(this.box.position);
        this.box.rotation.copy(this.camera.rotation);
        this.renderer.clear();
        this.renderer.render( this.scene, this.camera );
        this.renderer.clearDepth();
        this.renderer.render( this.sceneOrtho, this.cameraOrtho );

        requestAnimationFrame(() => {
            this.animate();
        });
        this.stats && this.stats.update();
        this.renderer.render(this.scene, this.camera);
      
    }

    updateGUIParam(param: any){

    }

    setup():void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0x909090));
        this.renderer.shadowMap.enabled = true;
      
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = true;
        this.camera.position.set(0, 0, 100);

        this.addLights();
        this.addObj();
        this.animate();
        this.addUI();
        document.body.appendChild(this.renderer.domElement);
    }

    addUI(){
        var width = 100;
        var height = 80;
        let scanvas = document.createElement("canvas");
        scanvas.width = width * window.devicePixelRatio;
        scanvas.height = height * window.devicePixelRatio;
        let ctx = scanvas.getContext("2d");
        ctx.fillStyle = "#0000ff";
        ctx.fillRect(20, 20, scanvas.width - 40, scanvas.height - 40);
        ctx.fillStyle = "#ffffff";
        ctx.font = "32px Arial";
        ctx.fillText("hello", 40, 40);

        var material = new THREE.SpriteMaterial( { 
            color: 0x999999,
            map: new THREE.CanvasTexture(scanvas)
         } );

        this.spriteTL = new THREE.Sprite( material );
        this.spriteTL.center.set( 0.0, 1.0 );
        this.spriteTL.scale.set( width, height, 1 );
        this.sceneOrtho.add( this.spriteTL );

        this.spriteTR = new THREE.Sprite( material );
        this.spriteTR.center.set( 1.0, 1.0 );
        this.spriteTR.scale.set( width, height, 1 );
        this.sceneOrtho.add( this.spriteTR );

        this.spriteBL = new THREE.Sprite( material );
        this.spriteBL.center.set( 0.0, 0.0 );
        this.spriteBL.scale.set( width, height, 1 );
        this.sceneOrtho.add( this.spriteBL );

        this.spriteBR = new THREE.Sprite( material );
        this.spriteBR.center.set( 1.0, 0.0 );
        this.spriteBR.scale.set( width, height, 1 );
        this.sceneOrtho.add( this.spriteBR );

        this.spriteC = new THREE.Sprite( material );
        this.spriteC.center.set( 0.5, 0.5 );
        this.spriteC.scale.set( width, height, 1 );
        this.sceneOrtho.add( this.spriteC );

        this.updateHUDSprites();
    }
    
    addObj(){
        this.box = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshStandardMaterial({
            color: 0xff0000,
            opacity: 0.5
        }));
        this.scene.add(this.box);
        this.camera.lookAt(this.box.position);
        this.box.rotation.copy(this.camera.rotation);
        this.box.position.z = 8;

        this.scene.add(new THREE.CameraHelper(this.camera));
        let other = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshStandardMaterial({
            color: 0xffff00,
            opacity: 0.5
        }));
        this.scene.add(other);
        other.position.set(0, 0, 10);

        var spriteMap = new THREE.TextureLoader().load( 'p3.jpg' );

        var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff, sizeAttenuation: false } );
        console.log(spriteMaterial);

        var sprite = new THREE.Sprite( spriteMaterial );
        console.log(sprite);
        // sprite.scale.set(2, 2, 1)

        this.scene.add( sprite );

        var sprite1 = new THREE.Sprite( new THREE.SpriteMaterial( { color: '#f00' } ) );
        sprite1.position.set( 0, 0, 20 );
        sprite1.scale.set( 10, 5, 1 );
        sprite1.center.set( 0.5, 0.5 );
        // sprite1.material.rotation = Math.PI / 3;
        this.scene.add( sprite1 );

        var sprite2 = new THREE.Sprite( new THREE.SpriteMaterial( { color: '#ff0' } ) );
        sprite2.position.set( 0, 0, 20 );
        sprite2.scale.set( 10, 5, 1 );
        sprite2.center.set( 0.5, 0.5 );
        // sprite2.material.rotation = Math.PI / 3;
        this.scene.add( sprite2 );
    }


    addLights():void{
        var ambient:THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.intensity = 0.4;
        this.scene.add(ambient);
    }
}