<template>
  <div class="home">
      {{msg}}
  </div>
</template>

<script>
export default {
    data(){
        return {
            msg: "vue"
        }
    }
}
</script>

<style lang="less" scoped>
.home{
    color: #ffffff;
    font-size: 16px;
    position: fixed;
    bottom: 10px;
    right: 10px;
    display: inline-block;
    z-index: 1;
}
</style>
