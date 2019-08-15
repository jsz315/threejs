import * as THREE from 'three'
// let OrbitControls = require('three-orbit-controls')(THREE);
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EquirectangularToCubeGenerator } from 'three/examples/jsm/loaders/EquirectangularToCubeGenerator';
import { PMREMGenerator } from 'three/examples/jsm/pmrem/PMREMGenerator';
import { PMREMCubeUVPacker } from 'three/examples/jsm/pmrem/PMREMCubeUVPacker';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';


const ThreeBSP = require('three-js-csg')(THREE);

export default class Game {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    ambient: THREE.AmbientLight;
    directional: THREE.DirectionalLight;
    raycaster: THREE.Raycaster = new THREE.Raycaster();
    model: THREE.Object3D;
    uniforms: any;
    mesh: THREE.Mesh;
    material: THREE.MeshStandardMaterial;
    group: THREE.Group;
    ball:THREE.Mesh;
    bufferView: THREE.BufferGeometry;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 900);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        });
        // window.addEventListener("mousedown", e => this.onMouseDown(e), false);
        window.addEventListener("resize", e => this.onResize(e), false);
    }

    onResize(e:Event):void{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    loadObject():void{
        let loader = new GLTFLoader();
        loader.setPath('/obj/gl/');
        loader.load('win.gltf', (gltf) => {
            console.log("gltf");
            console.log(gltf);
            gltf.scene.traverse((child: any) => {
                if(child.isMesh){
                    console.log(child);
                    child.receiveShadow = true;
                    child.castShadow = true;
                    if(child.material.map){
                        child.material.map.flipY = true;
                    }
                    
                    // child.material.map.rotation = -Math.PI;
                    // child.geometry.attributes.uv.array.forEach((v:number, i:number) => {
                    //     if(i % 2 == 1){
                    //         v = 1 - v;
                    //     }
                    // });
                    child.uvsNeedUpdate = true;
                }
            })
            gltf.scene.position.set(0, 4, 0);
            gltf.scene.scale.set(40, 40, 40);
            this.scene.add(gltf.scene);
            this.scene.add(new THREE.BoxHelper(gltf.scene, new THREE.Color(0x333333)));
        })
    }

    save( blob: any, filename: string ) {
        var link = document.createElement( 'a' );
        link.style.display = 'none';
        document.body.appendChild( link ); // Firefox workaround, see #6594
        link.href = URL.createObjectURL( blob );
        link.download = filename;
        link.click();
    }

     saveString( text: any, filename:string ) {
        this.save( new Blob( [ text ], { type: 'text/plain' } ), filename );
    }


    saveArrayBuffer( buffer: any, filename: string ) {
        this.save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
    }

    animate():void {
        requestAnimationFrame(() => {
            this.animate();
        });
        if(this.uniforms){
            this.uniforms.time.value += 0.02;
        }
        // if(this.group){
        //     this.group.rotateY(0.02);
        // }
        if(this.ball){
            this.ball.rotateY(0.02);
        }

        window.dispatchEvent(new CustomEvent("info", {
            detail: this.camera.position
        }))
        
        // this.directional.matrix = this.camera.matrix;
        // this.directional.position.copy(this.camera.position);
        // this.directional.rotation.copy(this.camera.rotation);
        // this.directional.position.copy(this.camera.position);
        this.renderer.render(this.scene, this.camera);
    }

    setup():void {
        this.model = new THREE.Group();
        this.scene.add(this.model);
       
        // this.camera.position.set(2, 4, 12);
        // this.camera.rotation.set(0.4, 0.2, 0.1);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0x909090));
        // this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
        new OrbitControls(this.camera, this.renderer.domElement);

        this.addGrid();
        this.addShader();
        this.addBall();
        this.addBufferView();
        this.addLights();
        this.animate();
    }

    addBufferView(){
        let colorArray = [ new THREE.Color( 0xff0080 ), new THREE.Color( 0xffffff ), new THREE.Color( 0x8000ff ) ];
        let positions: any = [];
        let colors: any = [];
        for(let i = 0; i < 3; i++){
            positions.push( (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30 );
            var clr = colorArray[ Math.floor( Math.random() * colorArray.length ) ];
            colors.push( clr.r, clr.g, clr.b );
        }

        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        let material = new THREE.PointsMaterial( { size: 4, vertexColors: THREE.VertexColors, depthTest: false, sizeAttenuation: false } );
        let mesh = new THREE.Points(geometry, material);
        
        this.group = new THREE.Group();
        this.group.add(mesh);
        this.scene.add(this.group);

        this.bufferView = geometry;
     
    }

    addBall():void{
        // let geometry = new THREE.SphereGeometry(4, 24, 24);
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        console.log("BoxGeometry--");
        console.log(geometry);

        let bg = new THREE.BoxBufferGeometry(1, 1, 1);
        console.log("BoxBufferGeometry--");
        console.log(bg);


        let material = new THREE.MeshStandardMaterial({
            lightMapIntensity: 0.2,
            aoMapIntensity: 0.2,
            emissiveIntensity: 0.1,
            opacity: 0.4,
            premultipliedAlpha: true,
            transparent: true,
            roughness: 0,
            metalness: 0,
            color: 0xffffff,
            emissive: 0xffffff
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 4, 0);
        this.scene.add(mesh);


        var textureLoader = new THREE.TextureLoader();
        textureLoader.load( "/texture/p4.jpg", function ( map ) {
            map.anisotropy = 8;
            material.map = map;
            material.needsUpdate = true;
        } );

        this.material = material;

        this.ball = mesh;
    }

    changeMaterial(gui: any){
        this.material.lightMapIntensity = gui.lightMapIntensity;
        this.material.aoMapIntensity = gui.aoMapIntensity;
        this.material.emissiveIntensity = gui.emissiveIntensity;
        this.material.opacity = gui.opacity;
        this.material.roughness = gui.roughness;
        this.material.metalness = gui.metalness;
        this.material.color = new THREE.Color(gui.color);
        this.material.emissive = new THREE.Color(gui.emissive);

        let colors:any = this.bufferView.getAttribute("color");
        for(let i = 0, l = colors.array.length; i < l; i++){
            colors.array[i] = Number(!colors.array[i]);
        }
        this.bufferView.addAttribute("color", new THREE.Float32BufferAttribute(colors.array, 3));
    }

    addGrid():void{
        let grid = new THREE.GridHelper(80, 80);
        this.scene.add(grid);
    }
    
    addShader():void{
        this.uniforms = {
            time: {type: "f", value: 0.1}
        }

        let vertexShader = $("#vertexShader").text();
        let fragmentShader = $("#fragmentShader").text();

        console.log(vertexShader);
        console.log(fragmentShader);

        let geometry = new THREE.BoxGeometry(2, 2, 2);
        let material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: this.uniforms
        })

        let mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        mesh.position.set(2, 6, -5);
        this.mesh = mesh;
    }

    addLights():void{
        //方向性光源
        var directional:THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff);
        directional.intensity = 0.7;
       
        //环境光
        var ambient:THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.intensity = 0.4;
     
        // directional.castShadow = true;
        // const shadowSize = 40;

        // directional.shadow.camera.left = -shadowSize;
        // directional.shadow.camera.right = shadowSize;
        // directional.shadow.camera.top = shadowSize;
        // directional.shadow.camera.bottom = -shadowSize;
        // directional.shadow.camera.far = 200;

        // directional.position.set(5, 5, -5);
        // directional.lookAt(new THREE.Vector3());


        // controllerFP.setObjectPosXYZ(0, 0, 140);
        // controllerFP.lookAtXYZ(0, 1, 140);
        directional.position.set(4, 4, 4);
        directional.lookAt(0, 0, 0);
        this.camera.position.set(1, 4, 10);
        this.camera.lookAt(0, 0, 0);
        // this.camera.add(new THREE.CameraHelper(this.camera));
        this.scene.add(directional);

        this.scene.add(new THREE.AxesHelper());
        // this.camera.add(directional);
        // directional.add(new THREE.DirectionalLightHelper(directional));
        
        this.ambient = ambient;
        this.directional = directional;


        var spotLight = new THREE.SpotLight( 0xff8888 );
        spotLight.position.set( 100, 200, 100 );
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.9;
        // this.scene.add( spotLight );

        var spotLight = new THREE.SpotLight( 0x8888ff );
        spotLight.position.set( - 100, - 200, - 100 );
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.9;
        this.scene.add( spotLight );
    }

}