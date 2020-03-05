import THREE = require("three");

export default class Components{

    all: any[];
    main: any[];
    sub: any[];
    isSingleColor: boolean;
    isRoom: boolean;

    constructor(){
        this.all = [];
        this.main = [];
        this.sub = [];
        this.isSingleColor = true;
        this.isRoom = false;
    }

    initMap(materials: any[]){
        materials.forEach((m: any) => {
            if (m.map && m.map.image) {
                let src = m.map.image.src;
                if (src.indexOf("/dif_") != -1) {
                    this.isRoom = true;
                    this.all.push(m);
                }
                if (src.indexOf("/IPR_") != -1) {
                    this.all.push(m);
                }
                if(src.indexOf("/IPR_A_") != -1){
                    // this.isSingleColor = false;
                    this.main.push(m);
                }
                else if(src.indexOf("/IPR_B_") != -1){
                    this.isSingleColor = false;
                    this.sub.push(m);
                }
            }
            m.transparent = true;
            m.alphaTest = 0.2;
        })

        setTimeout(() => {
            this.all.forEach((m: any) => {
                if (m.map && m.map.image) {
                    let src = m.map.image.src;
                    this.resetMap(m, src);
                }
            })
        }, 300);

        window.dispatchEvent(new CustomEvent("colorMap", { bubbles: false, cancelable: false, detail: this.isSingleColor}));
    }

    resetMap(material: any, url: string): void {
        let texture: any = new THREE.TextureLoader().load(url, () => {
            material.map.needsUpdate = true;
            material.needsUpdate = true;
        });

        texture.wrapS = material.map.wrapS;
        texture.wrapT = material.map.wrapT;
        texture.repeat = new THREE.Vector2(material.map.repeat.x, material.map.repeat.y);
        texture.flipY = material.map.flipY;
        texture.flipX = material.map.flipY;
        material.map = texture;


        // let map = material.map;

        // let texture: any = new THREE.TextureLoader().load(url, () => {
        //     material.map.needsUpdate = true;
        //     material.needsUpdate = true;
        // });

        // texture.wrapS = map.wrapS;
        // texture.wrapT = map.wrapT;
        // texture.repeat = new THREE.Vector2(map.repeat.x, map.repeat.y);
        // texture.flipY = map.flipY;
        // texture.flipX = map.flipX;

        // material.map = texture;
    }

    changeMap(url: string, isSub: boolean){
        let list:any[] = [];
        //是否外框
        // if(isSub){
        //     list = this.sub;
        // }
        // else{
        //     if(this.isSingleColor){
        //         list = this.all;
        //     }
        //     else{
        //         list = this.main;
        //     }
            
        // }

        if(this.isSingleColor){
            list = this.all;
        }
        else{
            if(isSub){
                list = this.sub;
            }
            else{
                list = this.main;
            }
        }

        list.forEach((material: any) => {
            this.resetMap(material, url);
        })
    }

}