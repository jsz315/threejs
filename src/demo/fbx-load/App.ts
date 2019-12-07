import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { FBXLoader } from './tool/FBXLoader'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { JSZip } from 'three/examples/js/libs/jszip.min.js';
const JSZip = require('three/examples/js/libs/jszip.min.js');
import Tooler from './Tooler'

import vlist from './ver';

export default class App {
    
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    stats: any;
    clock:THREE.Clock = new THREE.Clock();
    mixer: any;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 600);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        window.addEventListener("resize", e => this.onResize(e), false);
    }
    
    onResize(e:Event):void{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setStats(stats: any):void{
        this.stats = stats;
    }

    animate():void {
        var delta = this.clock.getDelta();
        // console.log("delta: " + delta);
        if ( this.mixer ) this.mixer.update( delta );
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
        this.camera.position.set(20, 20, 20);

        this.addLights();
        // this.addObj();
        this.animate();
        // this.test();
        // this.addPots();
        this.loadZip();
        this.camera.lookAt(new THREE.Vector3());
        document.body.appendChild(this.renderer.domElement);
    }

    loadZip3(){
        new THREE.FileLoader()
        .setResponseType( 'arraybuffer' )
        .load( 'obj/fbx/box.zip', ( data )=> {
            JSZip.loadAsync(data).then((zip:any)=>{
                const loadingManager = new THREE.LoadingManager();
                loadingManager.setURLModifier(url => {
                    const buffer = zip.files[url].async("arraybuffer");
                    const blob = new Blob( [ buffer.buffer ] );
                    const NewUrl = URL.createObjectURL( blob );
                    console.log("NewUrl", NewUrl);
                    return NewUrl
                });

                var loader = new FBXLoader(loadingManager);
                var ab = zip.file('box.fbx').async("arraybuffer");
                ab.then((res:any)=>{
                    console.log(res);
                    var obj = loader.parse(res, "");
                
                    // var obj = loader.parse(zip.files[ 'box.fbx' ].asArrayBuffer(), "");
                    this.scene.add(obj);
                })
                
            })
        });
    }

    loadZip(){
        new THREE.FileLoader()
        .setResponseType( 'arraybuffer' )
        .load( 'obj/fbx/box.zip', ( data )=> {

            console.log("ookk");

            // var zip = new JSZip( data );
            // var array = zip.files[ 'head256x256x109' ].asUint8Array();

            const zip = new JSZip( data );
            const loadingManager = new THREE.LoadingManager();
            loadingManager.setURLModifier(url => {
                const buffer = zip.files[url].asUint8Array();
                const blob = new Blob( [ buffer.buffer ] );
                const NewUrl = URL.createObjectURL( blob );
                console.log("NewUrl", NewUrl);
                return NewUrl
            });

            // const mtlLoader = new THREE.MTLLoader(loadingManager);
            // const materials = mtlLoader.parse( zip.file( 'materials.mtl' ).asText() );
            // const object = new THREE.OBJLoader()

            var loader = new FBXLoader(loadingManager);
            console.log(zip);
            let f = zip.files['box.fbx'];
            let bf = f.asArrayBuffer()
            var obj = loader.parse(bf, "");
            console.log("--");
            // this.scene.add(obj);

            this.fitModel(obj);

            /*
            // given image data extracted from zip file
            const extractedImage = XXXX;

            // create a blob URL of the image
            const buffer = new Uint8Array( extractedImage );
            const blob = new Blob( [ buffer.buffer ] );
            const url = URL.createObjectURL( blob );

            // then create a library of extracted images
            images[ extractedImageFilename ] = url;

            // finally use LoadingManager.setURLModifier#

            LoadingManager.setURLModifier = ( url ) => {

            // check if the URL is an image, then check if the image is in your library
            /// and return the extracted image if it is

            }
            */

           /*
           var loader = new THREE.XHRLoader( scope.manager );
           loader.setResponseType( 'arraybuffer' );
           loader.load( url, function ( text ) {
       
               if (url.split('/').pop().split('.')[1] == 'zip') {
                       JSZip.loadAsync(text)
                       .then(function (zip) {
                           return zip.file(Object.keys(zip.files)[0]).async("arrayBuffer");
                       })
                       .then(function success(text) {
                               onLoad( scope.parse( text ) );
                           }, function error(e) {
                               console.log(e);
                       });
               }
               else {
                   onLoad( scope.parse( text ) );
               }
       
           }, onProgress, onError );
           */


        } );
    }

    test(){
        var loader = new OBJLoader();
        
        loader.load("/obj/box.obj", (obj)=>{
            console.log("box.obj");
            console.log(obj);
            // this.scene.add(obj);
            this.fitModel(obj);

            var textureLoader = new THREE.TextureLoader();
            var texture = textureLoader.load( '/obj/box.jpg' );
            obj.traverse( function ( child:any ) {

                if ( child.isMesh ) child.material.map = texture;

            } );

        })


    }

    addPots(){
        var geometry = new THREE.Geometry();

        let t = vlist.length;
        let group = new THREE.Group();
        let box = new THREE.BoxGeometry(40, 40, 40);
        let mat = new THREE.MeshNormalMaterial();
        for(let i = 0; i < t; i += 3){

            // let pot = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({
            //     color: App.SELECTED_COLOR,
            //     map: new THREE.CanvasTexture(this.getCanvas(++App.TOTAL))
            // }));

            let pot = new THREE.Mesh(box, mat);
            pot.position.set(vlist[i], vlist[i + 1], vlist[i + 2]);
            group.add(pot);

            geometry.vertices.push(
                new THREE.Vector3(vlist[i], vlist[i + 1], vlist[i + 2])
            );
        }
        var line = new THREE.Line( geometry, mat );
        group.add( line );

        this.scene.add(group);
        this.fitModel(group);
        console.log(this.scene);

    }
    
    addObj(){
        let url = '/obj/fbx/Running.fbx';
        if(url.indexOf(".fbx") != -1){
            this.loadFbxObj(url);
        }
        else{
            this.loadDaeObj(url);
        }

        this.scene.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial()));

    }

    fitModel(group: THREE.Object3D): void {
        let parent: THREE.Object3D = group;

        // while (parent.children.length == 1) {
        //     parent = parent.children[0];
        // }
        let scale: number = Tooler.getFitScale(parent, 10);
        // parent.position.set(0, 0, 0);
        parent.scale.multiplyScalar(scale);
        // parent.rotateX(-Math.PI / 2);
        // this.scene.add(parent);
        parent.name = "load_scene";

        let aim = new THREE.Object3D();
        aim.name = "aim_scene";
        aim.add(parent);
        this.scene.add(aim);
        let offset: THREE.Vector3 = Tooler.getOffsetVector3(aim);
        console.log("offset ==== ");
        console.log(offset);
        aim.position.set(0 - offset.x, 0 - offset.y, 0 - offset.z);
    }

    loadDaeObj(url:string){
        var loader = new ColladaLoader();
        loader.load(url, (object:any) => {
            let daeModel = object.scene;
            // daeModel.scale.set( 0.1, 0.1, 0.1 );
            // daeModel.position.set( -6, 0, 0 );
            this.fitModel( daeModel );
        })
    }

    loadFbxObj(url:string){
        var loader = new FBXLoader();
        loader.load(url, ( object:any )=> {
            this.mixer = new THREE.AnimationMixer( object );
            var action = this.mixer.clipAction( object.animations[ 0 ] );
            action.play();

            object.traverse( function ( child:any) {

                if ( child.isMesh ) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                }

            } );

            this.fitModel( object );

        } );
    }


    addLights():void{
        var ambient:THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.intensity = 0.4;
        this.scene.add(ambient);

        var directionalLight:THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff);
        this.scene.add(directionalLight);
        directionalLight.position.set(20, 60, 20);
        directionalLight.lookAt(new THREE.Vector3());
    }
}