import * as THREE from 'three';
import Tooler from './Tooler';
import { NumberTooler } from '../lib/NumberTooler';

export class MapView extends THREE.Object3D{

    row:number;
    col:number;
    data:any;

    constructor(){
        super();
        this.createMap();
    }

    createMap(){
        var map:string = Tooler.getQueryString("m");
        var t:any = map.split(",");
        this.row = Number(t[0]);
        this.col = Number(t[1]);
        this.decodeMap(t[2]);
        var pot = NumberTooler.decodeMap(Number(t[3]));
        console.log(pot);
        this.addPlayer(pot[0],pot[1], 0x00ff22);
        this.addPlayer(pot[2],pot[3], 0x006644);
        this.addFloor(this.row, this.col, 0x550033);
    }

    addFloor(row:number, col:number, color:number){
        var mat = new THREE.MeshStandardMaterial({
            color: color
        });
        var box = new THREE.Mesh(new THREE.BoxGeometry(row, 1, col), mat);
        box.position.set(row / 2, 0, col / 2);
        this.add(box);
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

    addPlayer(row:number, col:number, color:number){
        var mat = new THREE.MeshStandardMaterial({
            color: color
        });
        var box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), mat);
        box.position.set(row, 1, col);
        this.add(box);
    }

    addTile(row:number, col:number, type:number){
        var mat = new THREE.MeshStandardMaterial({
            color: type == 0 ? 0xffffff : 0xff0000
        });
        var box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
        box.position.set(row + 0.5, type, col + 0.5);
        this.add(box);
    }

}