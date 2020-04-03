import * as THREE from 'three';


export default class Fire extends THREE.Object3D{

    list:THREE.Object3D[] = [];
    r: number = 10;
    angler:number = 0;

    constructor(){
        super();
        var box = new THREE.SphereBufferGeometry();
        for(var i = 0; i < 30; i ++){
            var mesh = new THREE.Mesh(box, new THREE.MeshBasicMaterial({
                opacity: 1 / (i + 1),
                transparent: true,
                alphaTest: 0.01,
            }));
            mesh.scale.setScalar(1 / (i * 0.04 + 1));
            this.list.push(mesh);
            this.add(mesh);
        }

        // setInterval(this.update.bind(this), 20);
    }

    addMesh(){
        var total = this.list.length;
        if(total > 10) return;
        var mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({
            opacity: 1 / (total + 1),
            transparent: true,
            alphaTest: 0.1
        }));
        mesh.position.set(total, total, total);
        this.list.push(mesh);
        this.add(mesh);
    }

    update(){
        // this.addMesh();
        // this.list.forEach((item: THREE.Object3D, index: number) => {
        //     if(index > 0){
        //         item.position.copy(this.list[index - 1].position.clone());
        //     }
        // })

        for(var i = this.list.length - 1; i > 0; i--){
            this.list[i].position.copy(this.list[i - 1].position.clone());
        }

        var start = this.list[0];
        // var distance = (1 - Math.random()) * 0.4;
        // start.translateX(distance);
        // start.translateY(distance);
        // start.translateZ(distance);

        this.angler += 3;
        var x = this.r * Math.sin(this.angler * Math.PI / 180);
        var z = this.r * Math.cos(this.angler * Math.PI / 180);
        start.position.set(x, 0, z);
    }

}