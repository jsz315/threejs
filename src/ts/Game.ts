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

const ThreeBSP = require('three-js-csg')(THREE);

export default class Game {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    ambient: THREE.AmbientLight;
    directional: THREE.DirectionalLight;
    raycaster: THREE.Raycaster = new THREE.Raycaster();
    model: THREE.Object3D;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 900);
        this.renderer = new THREE.WebGLRenderer();
        // window.addEventListener("mousedown", e => this.onMouseDown(e), false);
        window.addEventListener("resize", e => this.onResize(e), false);
    }

    onResize(e:Event):void{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseDown(e: MouseEvent):void{
        // let x = (e.clientX / window.innerWidth) * 2 - 1;
        // let y = -(e.clientY / window.innerHeight) * 2 + 1;
        // this.raycaster.setFromCamera({x: x, y: y}, this.camera);
        // let intersects = this.raycaster.intersectObjects(this.scene.children);
        // if(intersects[0]){
        //     this.saveObject(intersects[0].object);
        // }
    }

    changeColor(param: any):void {
        if (param.name == "Background") {
            this.renderer.setClearColor(new THREE.Color(param.data));
        }
        else if (param.name == "AmbientLight") {
            this.ambient.color = new THREE.Color(param.data);
        }
        else if (param.name == "DirectionalLight") {
            this.directional.color = new THREE.Color(param.data)
        }
    }

    saveObject():void{
        let embed = $('#embed').is(':checked');
        let exporter = new GLTFExporter();
        exporter.parse(this.model, (result: any) => {
            console.log(result);
            if ( result instanceof ArrayBuffer ) {
                this.saveArrayBuffer( result, 'scene.glb' );
            } else {
                var output = JSON.stringify( result, null, 2 );
                this.saveString( output, 'scene.gltf' );
            }
        }, {
            binary: false,
            embedImages: embed,
            forcePowerOfTwoTextures: embed,
            truncateDrawRange: false
        });
    }

    loadObject():void{
        let loader = new GLTFLoader();
        loader.setPath('/obj/glTF/');
        loader.load('scene.gltf', (gltf) => {
            console.log("gltf");
            console.log(gltf);
            gltf.scene.traverse((child: any) => {
                if(child.isMesh){
                    console.log(child);
                    child.receiveShadow = true;
                    child.castShadow = true;
                    // child.geometry.attributes.uv.array.forEach((v:number, i:number) => {
                    //     v = 1 - v;
                    // });
                    child.uvsNeedUpdate = true;
                }
            })
            gltf.scene.position.set(4, 5, 4);
            this.scene.add(gltf.scene);
            this.scene.add(new THREE.BoxHelper(gltf.scene));
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
        this.renderer.render(this.scene, this.camera);
    }

    setup():void {
        this.model = new THREE.Group();
        this.scene.add(this.model);

        let m = new THREE.MeshStandardMaterial();
        // specularMap//高光贴图
        // diffuseMap//颜色贴图
        let list = [
            m.envMap,
            m.bumpMap,//细节贴图，没有光影效果
            m.alphaMap,
            m.lightMap,
            m.metalnessMap,//金属性
            m.normalMap,//凹凸细节，模拟光影效果
            m.emissiveMap,//自发光
            m.displacementMap//高模烘培贴图，给低模更真实的效果
        ]

        this.camera.position.set(2, 4, 12);
        this.camera.rotation.set(0.4, 0.2, 0.1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0x909090));
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
        new OrbitControls(this.camera, this.renderer.domElement);

        this.addGrid();
        this.addPlane();
        this.addLights();

        this.addBSPObject();
        this.addLine();
        this.addTube();
        this.addExtrude();
        this.addBalls();
        this.addFacesImage();
        this.addDraw();

        this.loadJSON();
        this.load3DS();
        this.loadGLTF();

        this.animate();
    }

    addGrid():void{
        let grid = new THREE.GridHelper(80, 80);
        this.scene.add(grid);
    }
    
    addPlane():void{
        let geometry = new THREE.PlaneGeometry(40, 40);
        let meterial = new THREE.MeshStandardMaterial({color: 0xffaa88, side: THREE.DoubleSide});
        let mesh = new THREE.Mesh(geometry, meterial);
        mesh.receiveShadow = true;
        mesh.rotateX(Math.PI * -90 / 180);
        this.scene.add(mesh);
    }

    addLights():void{
        let ambient = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambient);

        let directional = new THREE.DirectionalLight(0xffffff);
        directional.castShadow = true;
        const shadowSize = 20;

        directional.shadow.camera.left = -shadowSize;
        directional.shadow.camera.right = shadowSize;
        directional.shadow.camera.top = shadowSize;
        directional.shadow.camera.bottom = -shadowSize;
        directional.shadow.camera.far = 200;

        directional.position.set(4, 24, 8);
        directional.lookAt(new THREE.Vector3());
        this.scene.add(directional);
        this.scene.add(new THREE.DirectionalLightHelper(directional));
        
        this.ambient = ambient;
        this.directional = directional;
    }

    addFacesImage():void{
        var material1 = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('/texture/p1.jpg')} );
        var material2 = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('/texture/p2.jpg')} );
        var material3 = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('/texture/p3.jpg')} );
        var material4 = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('/texture/p4.jpg')} );
        var material5 = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('/texture/p5.jpg')} );
        var material6 = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('/texture/p6.jpg')} );

                
        var materials = [material1, material2, material3, material4, material5, material6];

        let geometry = new THREE.BoxGeometry(2, 2, 2);
        // geometry.vertices = [];
        // geometry.faceVertexUvs[0] = [];
        // geometry.uvsNeedUpdate = true;

        let mesh = new THREE.Mesh(geometry, materials);
        mesh.position.set(2, 4, -8);
        this.scene.add(mesh);
        // this.model.add(mesh);
    }

    addDraw():void{
        let material1 = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/girl.jpg'), side: THREE.FrontSide, color:0xff0000});
        let material2 = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/boy.jpg'), side: THREE.FrontSide, color: 0x00ff00});
        let geometry = new THREE.Geometry();

        let A = new THREE.Vector3(0, 0, 0);
        let B = new THREE.Vector3(10, 0, 0);
        let C = new THREE.Vector3(10, 10, 0);
        let D = new THREE.Vector3(2, 8, -5);

        geometry.vertices.push(A, B, C, D);

        let ABC = new THREE.Face3(0, 1, 2, null, new THREE.Color(0xffffff), 0);
        let CDA = new THREE.Face3(2, 3, 0, null, new THREE.Color(0xffffff), 1);
        geometry.faces.push(ABC);
        geometry.faces.push(CDA);
        
        let uvs = geometry.faceVertexUvs[0];
        uvs[0] = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 0),
            new THREE.Vector2(1, 1)
        ];
        uvs[1] = [
            new THREE.Vector2(1, 1),
            new THREE.Vector2(0, 1),
            new THREE.Vector2(0, 0)
        ]

        // uvs[0].forEach((v: THREE.Vector2) => {
        //     v.y = 1 - v.y;
        // })

        // uvs[1].forEach((v: THREE.Vector2) => {
        //     v.y = 1 - v.y;
        // })

        // material2.map.rotation = Math.PI * 0.5;

        geometry.uvsNeedUpdate = true;
        geometry.center();
        geometry.computeVertexNormals();
        geometry.computeFaceNormals();

        let mesh = new THREE.Mesh(geometry, [material1, material2]);
        mesh.position.set(-6, 6, -6);
        // this.scene.add(mesh);
        this.model.add(mesh);
    }

    addLine():void{
        let group = new THREE.Group();
        let curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(3, 4, 2),
            new THREE.Vector3(1, 2, -3),
            new THREE.Vector3(-3, 0, 4),
            new THREE.Vector3(2, -3, 1),
        ], true);
        let geometry = new THREE.Geometry();
        geometry.vertices = curve.getSpacedPoints(50);
        let mesh = new THREE.Line(geometry);
        group.add(mesh);

        let sphereGeometry = new THREE.SphereGeometry(0.1);
        let mat = new THREE.MeshNormalMaterial();
        let spacePoints = curve.getPoints(50);
        for(let point of spacePoints){
            let helper = new THREE.Mesh(sphereGeometry, mat);
            helper.position.copy(point);
            group.add(helper);
        }

        group.position.set(-4, 4, 6);
        this.scene.add(group);
    }

    addBSPObject():void{
        let mat = new THREE.MeshStandardMaterial({color: 0xf0f0f0});
        mat.map = new THREE.TextureLoader().load("/girl.jpg");

        let aMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, opacity: 0.72, transparent: true});
        let aMesh = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), aMaterial);
        this.scene.add(aMesh);
        aMesh.receiveShadow = true;
        aMesh.castShadow = true;

        let bMaterial = new THREE.MeshToonMaterial({
            color: new THREE.Color(0xff4400),
            specular: new THREE.Color(0x0022ff),
            reflectivity: 0.4,
            shininess: 30
        });

        let bMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1), bMaterial);
        this.scene.add(bMesh);
        bMesh.receiveShadow = true;
        bMesh.castShadow = true;

        bMesh.position.y = 1;

        let aBSP = new ThreeBSP(aMesh);
        let bBSP = new ThreeBSP(bMesh);
        let rBSP = aBSP.subtract(bBSP);
        // let rBSP = cBSP.union(sBSP);
        let rMesh = rBSP.toMesh();
        rMesh.material = mat;
        this.scene.add(rMesh);
        rMesh.receiveShadow = true;
        rMesh.castShadow = true;

        aMesh.position.set(-4, 3, 0);
        bMesh.position.set(0, 3, 0);
        rMesh.position.set(4, 3, 0);

        let helper = new THREE.BoxHelper(rMesh, new THREE.Color(0xff0000));
        this.scene.add(helper);
        helper.position.copy(rMesh.position);

        // this.model.add(rMesh);
    }

    addBalls():void{
        let sphere = new THREE.SphereGeometry(1, 16, 16);
        let material = new THREE.MeshToonMaterial({
            color: new THREE.Color(0xff8855),
            specular: new THREE.Color(0x4422ff),
            reflectivity: 0.7,
            shininess: 40
        })
        let ball = new THREE.Mesh(sphere, material);
        this.scene.add(ball);
        ball.receiveShadow = true;
        ball.castShadow = true;
        ball.position.set(4, 2, -5);
    }

    addExtrude():void{
        let shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(1, 0);
        shape.lineTo(1, 1.2);
        shape.lineTo(0, 1);
        // shape.arc(0, 0, 1, 0, Math.PI * 2, false);
        let p1 = new THREE.Vector3(-5, 10, 2);
        let p2 = new THREE.Vector3(-2, 4, 10);
        let path = new THREE.LineCurve3(p1, p2);

        let extrudeSettings = {
            bevelEnabled: true,
            bevelSize: 0.4,
            bevelThickness: 0.4,
            bevelOffset: 0,
            bevelSegments: 4,
            step: 4,
            depth: 2,
            extrudePath: path
        }
        let extrude = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        let mesh = new THREE.Mesh(extrude, new THREE.MeshNormalMaterial())
        this.scene.add(mesh);
    }

    addTube():void{
        var curve = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( 0, 10, - 10 ), new THREE.Vector3( 10, 0, - 10 ),
            new THREE.Vector3( 20, 0, 0 ), new THREE.Vector3( 30, 0, 10 ),
            new THREE.Vector3( 30, 0, 20 ), new THREE.Vector3( 20, 0, 30 ),
            new THREE.Vector3( 10, 0, 30 ), new THREE.Vector3( 0, 0, 30 ),
            new THREE.Vector3( - 10, 10, 30 ), new THREE.Vector3( - 10, 20, 30 ),
            new THREE.Vector3( 0, 30, 30 ), new THREE.Vector3( 10, 30, 30 ),
            new THREE.Vector3( 20, 30, 15 ), new THREE.Vector3( 10, 30, 10 ),
            new THREE.Vector3( 0, 30, 10 ), new THREE.Vector3( - 10, 20, 10 ),
            new THREE.Vector3( - 10, 10, 10 ), new THREE.Vector3( 0, 0, 10 ),
            new THREE.Vector3( 10, - 10, 10 ), new THREE.Vector3( 20, - 15, 10 ),
            new THREE.Vector3( 30, - 15, 10 ), new THREE.Vector3( 40, - 15, 10 ),
            new THREE.Vector3( 50, - 15, 10 ), new THREE.Vector3( 60, 0, 10 ),
            new THREE.Vector3( 70, 0, 0 ), new THREE.Vector3( 80, 0, 0 ),
            new THREE.Vector3( 90, 0, 0 ), new THREE.Vector3( 100, 0, 0 )
        ] );
        let geometry = new THREE.TubeGeometry(curve, 180, 1, 12, false);
        let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xff3388}));
        this.scene.add(mesh);

        var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.3, wireframe: true, transparent: true } );
        var wireframe = new THREE.Mesh( geometry, wireframeMaterial );
		mesh.add( wireframe );
        mesh.position.set(-12, 5, -8);
    }

    

    loadJSON():void {
        let loader = new THREE.ObjectLoader();
        loader.load("/obj/teapot-claraio.json", (obj: any) => {
            obj.material = new THREE.MeshStandardMaterial({color: 0x33ff88});
            obj.position.set(0, 2, -3);
            this.scene.add(obj);
            this.scene.add(new THREE.BoxHelper(obj, new THREE.Color(0xff0000)));
        })
    }

    load3DS():void {
        let loader = new TDSLoader();
        let isDebug = location.search.indexOf("debug=1") != -1;
        var resourcePath = '/obj/portalgun/textures/';
        var url = '/obj/portalgun/portalgun.3ds';
        
        if(isDebug){
            resourcePath = '/obj/house/';
            url = '/obj/house/QQ.3DS';
        }

        loader.setResourcePath(resourcePath);
        loader.load(url, (object) => {
            object.traverse((child: any) => {
                if (child.isMesh) {
                    console.log("3ds mesh");
                    console.log(child);
                    child.receiveShadow = true;
                    child.castShadow = true;
                }

            });
            isDebug && object.scale.set(0.05, 0.05, 0.05);
            object.position.set(4, 3, 4);
            this.scene.add(object);
            this.scene.add(new THREE.BoxHelper(object));
        })
    }

    loadGLTF():void{
        let rgbeLoader = new RGBELoader();
        rgbeLoader.setDataType(THREE.UnsignedByteType);
        rgbeLoader.load( '/obj/glTF/pedestrian_overpass_2k.hdr', texture => {
            var cubeGenerator = new EquirectangularToCubeGenerator( texture, { resolution: 1024 } );
            var texture: THREE.DataTexture = cubeGenerator.update( this.renderer );

            var pmremGenerator = new PMREMGenerator( texture );
            pmremGenerator.update( this.renderer );

            var pmremCubeUVPacker = new PMREMCubeUVPacker( pmremGenerator.cubeLods );
            pmremCubeUVPacker.update( this.renderer );

            var envMap = pmremCubeUVPacker.CubeUVRenderTarget.texture;

            let loader = new GLTFLoader();
            loader.setPath('/obj/glTF/');
            loader.load('DamagedHelmet.gltf', (gltf) => {
                gltf.scene.traverse((child:any) => {
                    if(child.isMesh){
                        child.material.envMap = envMap;
                        child.receiveShadow = true;
                        child.castShadow = true;
                    }
                })
                gltf.scene.position.set(0, 3, 3);
                this.scene.add(gltf.scene);
                this.scene.add(new THREE.BoxHelper(gltf.scene));
            })
        })
    }
}