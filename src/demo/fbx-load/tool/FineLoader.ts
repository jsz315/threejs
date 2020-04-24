import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { FBXLoader } from './FBXLoader'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class FineLoader{

    constructor(){

    }

    static loadFbx(url: string) {
        return new Promise(resolve => {
            var loader = new FBXLoader();
            loader.load(url, (object: any) => {
                console.log('fbx loaded', object);
                // this.mixer = new THREE.AnimationMixer( object );
                // var action = this.mixer.clipAction( object.animations[ 0 ] );
                // action.play();

                // object.traverse( function ( child:any) {

                //     if ( child.isMesh ) {

                //         child.castShadow = true;
                //         child.receiveShadow = true;

                //     }

                // } );
                resolve(object);
            });
        })
    }

    static loadDae(url: string) {
        return new Promise(resolve => {
            var loader = new ColladaLoader();
            loader.load(url, (object: any) => {
                console.log('dea loaded', object);
                let daeModel = object.scene;
                resolve(daeModel);
            })
        })
    }

    static loadObj(url: string) {
        return new Promise(resolve => {
            var loader = new OBJLoader();
            loader.load(url, (object: any) => {
                console.log('obj loaded', object);

                // var textureLoader = new THREE.TextureLoader();
                // var texture = textureLoader.load('/obj/box.jpg');
                // object.traverse(function (child: any) {
                //     if (child.isMesh) child.material.map = texture;
                // });

                resolve(object);
            })
        });

    }

    static loadZip() {
        new THREE.FileLoader().setResponseType('arraybuffer').load('obj/fbx/man.zip', (data) => {
            JSZip.loadAsync(data).then((zip: any) => {
                const loadingManager = new THREE.LoadingManager();
                loadingManager.setURLModifier(url => {
                    const buffer = zip.files[url].async("arraybuffer");
                    const blob = new Blob([buffer.buffer]);
                    const NewUrl = URL.createObjectURL(blob);
                    console.log("NewUrl", NewUrl);
                    return NewUrl
                });

                var loader = new FBXLoader(loadingManager);
                var ab = zip.file('man.fbx').async("arraybuffer");
                ab.then((res: any) => {
                    console.log(res);
                    var obj = loader.parse(res, "");
                    // var obj = loader.parse(zip.files[ 'box.fbx' ].asArrayBuffer(), "");
                    // this.scene.add(obj);
                })

            })
        });
    }

}