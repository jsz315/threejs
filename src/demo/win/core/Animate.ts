import Tooler from "./Tooler";

export default class Animate {
    
    view:THREE.Object3D;
    animations:object[];
    running:boolean;
    aid:number;

    constructor(view:THREE.Object3D){
        this.view = view;
        this.animations = [];
    }

    addAnimation(animation:object){
        this.animations.push(animation);
    }

    start(){
        this.running = true;
        if(++this.aid >= this.animations.length){
            this.aid = 0;
        }
    }

    end(){
        this.running = false;
    }

    update(){
        if(this.running){
            var item:any = this.animations[this.aid];
            var duration:number = item.duration;
            Tooler.rotateOnAxis(this.view, item.rotate.pivot, item.rotate.axis, duration);
        }
    }
}