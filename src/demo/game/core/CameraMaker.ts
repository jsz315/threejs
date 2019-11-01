import * as BABYLON from 'babylonjs'

export default class CameraMaker{

    public static getArcRotateCamera(scene:BABYLON.Scene){
        var camera = new BABYLON.ArcRotateCamera("camera", Math.PI, Math.PI, Math.PI, new BABYLON.Vector3(10, 8, -40), scene);
        camera.lockedTarget = new BABYLON.Vector3(0, 0, 0);
        
        return camera;
    }

    public static getFreeCamera(scene:BABYLON.Scene){
        var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(7, 0, -24), scene);
        // camera.setTarget(BABYLON.Vector3.Zero());
        camera.rotation.set(0.1604435790259675, -0.17874767124658136, 0);
        camera.speed = 0.2;
        console.log(camera);
        return camera;
    }
}