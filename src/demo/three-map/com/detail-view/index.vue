<template>
    <div class="detail-view">
        <div class="size">
            <div class="list" :class="{move}" :style="{'transform': 'translateX(' + x + 'px)'}">
                <div class="pic" v-for="(item, index) in list" v-bind:key="index" :style="{'background-image': 'url(' + item + ')'}"></div>
            </div>
        </div>
    </div>
</template>

<script>
let pics = [
    'http://gss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/42a98226cffc1e177a2eb0404290f603738de92a.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586502962707&di=ee98af61cb765ad0afa14e1f66e02629&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201505%2F13%2F20150513144838_UkA58.thumb.700_0.jpeg',
    'http://pic2.52pk.com/files/130426/1283568_114807_4882.jpg',
    'http://www.1lifan.com/uploads/allimg/180731/230ILS6-5.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586510568232&di=ff9c981c6849e5abc8fcd4dec7590851&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fbaike%2Fpic%2Fitem%2Ff11f3a292df5e0fe285a6174566034a85edf7201.jpg',
    'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2207089593,3263649201&fm=15&gp=0.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586502962693&di=83606ae7627dee2503a9a1e6ed163941&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2Fb90e7bec54e736d1e3eb0c7b9b504fc2d46269cd.jpg'
];

export default {
    props: {},
    data() {
        return {
            list: [],
            x: 0,
            move: true,
            id: 0
        };
    },
    components: {},
    computed:{
        
    },
    mounted() {
        this.$nextTick(()=>{
            this.resetPic();
            this.autoPlay();
        })
        
    },
    methods:{
        autoPlay(){
            setInterval(()=>{
                this.x = -window.innerWidth;
                setTimeout(() => {
                    if(++this.id == pics.length){
                        this.id = 0;
                    }
                    this.resetPic();
                }, 300);
            }, 3000);
        },
        resetPic(){
            this.move = false;
            var temp = [];
            temp.push(this.getPic(this.id - 1));
            temp.push(this.getPic(this.id));
            temp.push(this.getPic(this.id + 1));
            this.list = temp;
            this.x = 0;
            setTimeout(() => {
                this.move = true;
            }, 30);
        },
        getPic(n){
            if(n < 0){
                return pics[pics.length - 1];
            }
            if(n == pics.length){
                return pics[0];
            }
            return pics[n];
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import "./index.less";
</style>
