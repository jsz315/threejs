import Tooler from "./Tooler";

export default class Animate {
    
    view:THREE.Object3D;
    animations:object[];
    running:boolean;
    aid:number;
    moveType:number;

    public static ROTATE:number = 1;
    public static TRANSLATE:number = 2;

    constructor(view:THREE.Object3D){
        this.view = view;
        this.animations = [];
    }

    addAnimation(animation:any){
        animation.times = animation.duration * 1000 / 30;
        animation.tid = 0;
        animation.moveType = animation.rotate ? Animate.ROTATE : Animate.TRANSLATE;
        this.animations.push(animation);
    }

    start(){
        this.running = true;
    }

    end(){
        this.running = false;
    }

    update(){
        if(this.running){
            var animation:any = this.animations[this.aid];
            if(++animation.tid < animation.times){
                if(animation.moveType == Animate.ROTATE){
                    var r:number = animation.rotate.angle / animation.times;
                    Tooler.rotateOnAxis(this.view, animation.rotate.pivot, animation.rotate.axis, r);
                }
                else{
                    let x = this.view.position.x + animation.offset.x / animation.times;
                    let y = this.view.position.y + animation.offset.y / animation.times;
                    let z = this.view.position.z + animation.offset.z / animation.times;
                    this.view.position.set(x, y, z);
                }
            }
            else{
                this.end();
                if(++this.aid >= this.animations.length){
                    this.aid = 0;
                }
            }
        }
    }
}