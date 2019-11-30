import * as THREE from 'three';
import * as CANNON from 'cannon';

export default class Car extends THREE.Object3D{
    world:any;

    constructor(world:any){
        super();
        this.world = world;
        this.init();
    }

    init(){
        var chassisShape = new CANNON.Box(new CANNON.Vec3(2, 1, 0.5));
        var chassisBody = new CANNON.Body({mass: 100});
        chassisBody.addShape(chassisShape);
        chassisBody.position.set(0, 0, 4);
        chassisBody.angularVelocity.set(0, 0, 0.5);

        var options = {
            radius: 0.5,
            directionLocal: new CANNON.Vec3(0, 0, -1),
            suspensionStiffness: 30,
            suspensionRestLength: 0.3,
            frictionSlip: 5,
            dampingRelaxation: 2.3,
            dampingCompression: 4.4,
            maxSuspensionForce: 100000,
            rollInfluence:  0.01,
            axleLocal: new CANNON.Vec3(0, 1, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
            maxSuspensionTravel: 0.3,
            customSlidingRotationalSpeed: -30,
            useCustomSlidingRotationalSpeed: true
        };

        // Create the vehicle
        var vehicle = new CANNON.RaycastVehicle({
            chassisBody: chassisBody,
        });

        options.chassisConnectionPointLocal.set(1, 1, 0);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(1, -1, 0);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(-1, 1, 0);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(-1, -1, 0);
        vehicle.addWheel(options);

        vehicle.addToWorld(this.world);

        var wheelBodies:any[] = [];
        for(var i=0; i<vehicle.wheelInfos.length; i++){
            var wheel = vehicle.wheelInfos[i];
            var cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
            var wheelBody = new CANNON.Body({ mass: 1 });
            var q = new CANNON.Quaternion();
            q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
            wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
            wheelBodies.push(wheelBody);
            // demo.addVisual(wheelBody);
        }

        // Update wheels
        this.world.addEventListener('postStep', function(){
            for (var i = 0; i < vehicle.wheelInfos.length; i++) {
                vehicle.updateWheelTransform(i);
                var t = vehicle.wheelInfos[i].worldTransform;
                wheelBodies[i].position.copy(t.position);
                wheelBodies[i].quaternion.copy(t.quaternion);
            }
        });

    }
}