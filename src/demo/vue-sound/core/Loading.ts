import * as THREE from 'three'

export default class Loading extends THREE.Object3D{

    canvas: any;
    w:number = 512;
    h:number = 512;
    spriteMaterial:THREE.SpriteMaterial;
    spriteMap: THREE.Texture;

    constructor(){
        super();
        this.init();
    }

    init(){
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.spriteMap = new THREE.CanvasTexture(this.canvas);
        this.spriteMaterial = new THREE.SpriteMaterial( { map: this.spriteMap, transparent: true, sizeAttenuation: false } );
        var sprite = new THREE.Sprite( this.spriteMaterial );
        this.add( sprite );
        sprite.scale.multiplyScalar(0.3);
    }

    update(tip:any, num:any, color:any = "#409EFF"){
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = color;
        ctx.arc(this.w / 2, this.h / 2, this.w / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = this.w / 6 + "px bold";
        ctx.fillText(tip, this.w / 2, this.h * 0.4);
        ctx.font = this.w / 4 + "px bold";
        ctx.fillText(num, this.w / 2, this.h * 0.7);

        this.spriteMap.needsUpdate = true;
        this.spriteMaterial.needsUpdate = true;
    }
}