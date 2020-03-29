import * as THREE from 'three'

export default class Part {

    map:any = {};

    constructor(obj:THREE.Object3D) {
        var mat1:THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({color: 0xffad77});
        var mat2:THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({color: 0x3cce02});
        var mat3:THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
        // var mat4:THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({color: 0x00ffff});
        // var mat5:THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
        
        var muscle:Array<THREE.Mesh> = [];
        var bones:Array<THREE.Mesh> = [];
        var eye:Array<THREE.Mesh> = [];
        // var tooth:Array<THREE.Mesh> = [];
        // var other:Array<THREE.Mesh> = [];

        // var lights:Array<THREE.Object3D> = [];

        obj.traverse( function ( child:any) {
            if ( child.isMesh ) {
                // child.castShadow = true;
                // child.receiveShadow = true;
                // console.log(child.name);
                if(child.name.indexOf('肌肉') != -1){
                    (child as THREE.Mesh).material = mat1;
                    muscle.push(child);
                    
                }
                else if(child.name.indexOf('骨骼') != -1){
                    (child as THREE.Mesh).material = mat2;
                    bones.push(child);
                    // child.name = child.name.replace("Box", "骨骼");
                }
                else if(child.name.indexOf('眼睛') != -1){
                    (child as THREE.Mesh).material = mat3;
                    eye.push(child);
                }
                // else if(child.name.indexOf('牙') != -1){
                //     (child as THREE.Mesh).material = mat2;
                //     child.name = child.name.replace("牙", "骨骼");
                //     tooth.push(child);
                // }
                // else if(child.name.indexOf('QuadPatch') != -1){
                //     child.parent.remove(child);
                // }
                else{
                    // console.log(child.name);
                    // (child as THREE.Mesh).material = mat5;
                    // other.push(child);
                }
            }
            else{
                // if(child.name.indexOf('Omni') != -1){
                //     lights.push(child);
                // }
            }

        } );

        this.map['muscle'] = {material: mat1, mesh: muscle};
        this.map['bones'] = {material: mat2, mesh: bones};
        this.map['eye'] = {material: mat3, mesh: eye};
        // this.map['tooth'] = {material: mat4, mesh: tooth};
        // this.map['other'] = {material: mat5, mesh: other};

    }

    change(type:string, attr:string, data:any):void {
        if(attr == 'roughness' || attr == 'metalness' || attr == 'visible'){
            this.map[type].material[attr] = data;
        }
        else if(attr == 'color'){
            this.map[type].material[attr] = new THREE.Color(data);
        }
        else if(attr == 'alpha'){
            this.map[type].material.opacity = data;
            this.map[type].material.transparent = true;
        }
    }

    toggle(key:string):void{
        this.map[key].mesh.forEach((item:THREE.Mesh) => {
            item.visible = !item.visible;
        });
    }
}