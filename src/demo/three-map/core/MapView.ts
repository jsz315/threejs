import * as THREE from 'three';
import Tooler from './Tooler';
import { NumberTooler } from '../lib/NumberTooler';

import * as Physijs from 'physijs';

export class MapView extends THREE.Object3D{

    row:number;
    col:number;
    data:any;

    meshes: any = [];

    constructor(){
        super();
        this.createMap();
        var helper = new THREE.AxesHelper(this.row);
        this.add(helper);
    }

    createMap(){
        var map:string = Tooler.getQueryString("m");
        map = decodeURIComponent(map);
        var t:any = map.split(",");
        this.row = Number(t[0]);
        this.col = Number(t[1]);
        this.decodeMap(t[2]);
        var pot = NumberTooler.decodeMap(Number(t[3]));
        console.log(pot);
        this.addPlayer(pot[0],pot[1], 0xffffff, 'start');
        this.addPlayer(pot[2],pot[3], 0xffffff, 'end');
        this.addFloor(this.row, this.col, 0xffffff);
    }

    addFloor(row:number, col:number, color:number){
        var mat = Physijs.createMaterial(
            new THREE.MeshStandardMaterial({
                color: color,
                map: new THREE.TextureLoader().load("./texture/p3.jpg")
            })
        );
        var box = new Physijs.BoxMesh(new THREE.BoxGeometry(row, 1, col), mat, 0);
        box.position.set(row / 2, 0, col / 2);
        box.name = 'floor';
        box.receiveShadow = true;
        // box.castShadow = true;
        this.add(box);
        console.log(box, 'floor');
        this.meshes.push(box);
    }

    decodeMap(str:string){
        this.data = [];
        var list = str.split(".");
        for(var i = 0; i < list.length; i++){
            this.data[i] = [];
            var rowStr = NumberTooler.addZero(NumberTooler.string16T2(list[i]), this.col);
            var rowList = rowStr.split("");
            for(var j = 0; j < rowList.length; j++){
                this.data[i][j] = Number(rowList[j]);
                if(this.data[i][j]){
                    this.addTile(i, j, this.data[i][j]);
                }
                
            }
        }
    }

    addPlayer(row:number, col:number, color:number, name:string){
        var mat = Physijs.createMaterial(
            new THREE.MeshStandardMaterial({
                color: color,
                map: new THREE.TextureLoader().load("./texture/p1.jpg"),
            }), 1, 0.5
        );
        var box = new Physijs.BoxMesh(new THREE.SphereGeometry(0.5, 12, 12), mat, 100);
        box.position.set(row, 8, col);
        box.name = name;
        // box.receiveShadow = true;
        box.castShadow = true;
        this.add(box);
        this.meshes.push(box);
    }

    addTile(row:number, col:number, type:number){
        var mat = Physijs.createMaterial(
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                map: new THREE.TextureLoader().load("./texture/p2.jpg")
            })
        );
        var box = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 1, 1), mat, 100);
        box.position.set(row + 0.5, type, col + 0.5);
        box.name = 'tile';
        // box.receiveShadow = true;
        box.castShadow = true;
        this.add(box);
        this.meshes.push(box);
    }

}