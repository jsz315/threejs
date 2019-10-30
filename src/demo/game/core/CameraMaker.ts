import * as BABYLON from 'babylonjs'

export default class CameraMaker{

    public static getArcRotateCamera(scene:BABYLON.Scene){
        var camera = new BABYLON.ArcRotateCamera("camera", Math.PI, Math.PI, Math.PI, new BABYLON.Vector3(0, 0, 0), scene);
        camera.lockedTarget = new BABYLON.Vector3(0, 0, 0);
        return camera;
    }

    public static getFreeCamera(scene:BABYLON.Scene){
        var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(16, 16, 8), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.speed = 0.2;
        console.log(camera);
        return camera;
    }
}