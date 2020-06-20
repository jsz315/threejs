<template>
    <!-- <swiper ref="mySwiper" class="swiper-view" :style="{'height': height + 'px'}" :options="swiperOptions">
        <swiper-slide class="item" v-for="(item, index) in pics" v-bind:key="index" :style="style(item)"></swiper-slide>
        <div class="swiper-pagination" slot="pagination" v-if="this.pics.length > 1"></div>
    </swiper> -->

    <swiper ref="mySwiper" class="swiper-view" :options="swiperOptions">
        <swiper-slide ref="slide" class="item" v-for="(item, index) in pics" :style="style(item)" v-bind:key="index"></swiper-slide>
        <div class="swiper-pagination" slot="pagination" v-if="this.pics.length > 1"></div>
    </swiper>
</template>

<script>
import listener from "../../lib/listener"
let resizeEvent;

export default {
    props: ['pics'],
    data() {
        return {
            swiperOptions: {
                pagination: {
                    el: '.swiper-pagination'
                },
                autoplay: {
                    delay: 5000,
                    //当用户滑动图片后继续自动轮播
                    disableOnInteraction: false,
                },
                //开启循环模式
                loop: true,
                // Some Swiper option/callback...
                on: {
                    slideChange: ()=>{
                        this.$emit('change');
                    }
                }
            }
        };
    },
    components: {},
    computed:{
        
    },
    mounted() {
        resizeEvent = listener.make(window, "resize", this.changeHight.bind(this));
        // window.addEventListener("resize", this.changeHight.bind(this))
        this.changeHight();

        if(this.pics.length == 1){
            this.$refs.mySwiper.$swiper.autoplay.stop();
        }
    },
    destroyed(){
        resizeEvent.destory();
        // window.removeEventListener("resize", this.changeHight.bind(this));
        console.log("移除侦听舞台变换事件");
    },
    methods:{
        style(item){
            return {
                'background-image': 'url(' + item + ')'
            }
        },
        changeHight(){
            var h = window.innerHeight - 148 + 'px';
            this.$refs.mySwiper.$el.style.height = h;
            this.$refs.slide.forEach(div=>{
                div.$el.style.height = h;
            })
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
