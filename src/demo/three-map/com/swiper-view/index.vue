<template>
    <swiper ref="mySwiper" class="swiper-view" :style="{'height': height + 'px'}" :options="swiperOptions">
        <swiper-slide class="item" v-for="(item, index) in pics" v-bind:key="index" :style="style(item)"></swiper-slide>
        <div class="swiper-pagination" slot="pagination" v-if="this.pics.length > 1"></div>
    </swiper>
</template>

<script>
export default {
    props: ['pics'],
    data() {
        return {
            height: window.innerHeight - 148,
            swiperOptions: {
                pagination: {
                    el: '.swiper-pagination'
                },
                autoplay: {
                    delay: 2000,
                    //当用户滑动图片后继续自动轮播
                    disableOnInteraction: false,
                },
                //开启循环模式
                loop: true,
                // Some Swiper option/callback...
                on: {
                    slideChange: ()=>{
                        // console.log(this, 'slideChange');
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
        // window.addEventListener("resize", ()=>{
        //     console.log("resize");
        //     this.height = 820 * window.innerWidth / 1920;
        // })
        console.log(this, 'this');
        console.log('swiper', this.$refs.mySwiper);
        if(this.pics.length == 1){
            this.$refs.mySwiper.$swiper.autoplay.stop();
            // this.$refs.mySwiper.$swiper.stopAutoplay();
            // this.$refs.mySwiper.lockSwipes();
        }
    },
    destroyed(){
        
    },
    methods:{
        style(item){
            return {
                'background-image': 'url(' + item + ')',
                'height': this.height + 'px'
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
