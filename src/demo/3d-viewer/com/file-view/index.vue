<template>
    <div class="file-view" v-if="visible">
        <div class="panel">
            <div class="info">在线预览模型，您可以上传gltf,fbx,obj格式的模型</div>
            <div class="upload" ref="box">
                <input @change="chooseFile" class="file" type="file" ref="file" multiple/>
                <span class="choose">选择文件</span>或拖拽文件到这里
            </div>
        </div>
    </div>
</template>

<script>
import listener from '../../lib/listener'

let fileList = [];
let tid = 0;

export default {
    data() {
        return {
            visible: true
        };
    },
    components: {},
    computed: {
        // visible(){
        //     return this.$store.state.guiderVisible;
        // }
    },
    mounted(){
        var box = this.$refs.box;
        box.addEventListener("dragenter", this.onDrag, false);
        box.addEventListener("dragover", this.onDrag, false);
        box.addEventListener("dragleave", this.onDragLeave, false);
        box.addEventListener("drop", this.onDrop, false);
    },
    methods: {
        // hideGuider(){
        //     this.$store.commit("changeGuiderVisible", false);
        // },
        onDrag: function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log("进入");
        },
        onDragLeave: function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log("离开");
        },
        onDrop: function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log("松手");
            console.log(e);
            fileList = [];

            let items = e.dataTransfer.items;
            for(let i = 0; i < items.length; i++){
                let item = items[i].webkitGetAsEntry();
                if(item){
                    this.scanFiles(item);
                }
            }
        },
        scanFiles(item){
            console.log("path: " + item.fullPath);
            if(item.isDirectory){
                let dirReader = item.createReader();
                dirReader.readEntries((entries)=>{
                    entries.forEach((entry)=>{
                        this.scanFiles(entry);
                    })
                })
            }
            else{
                item.file(file=>{
                    this.addFiles([file]);
                })
            }
            
        },
        chooseFile(e){
            fileList = [];
            var files = e.target.files;
            this.addFiles(files);
        },
        addFiles(files){
            for(let i = 0; i < files.length; i++) {
                var file = files[i];
                console.log(file);
                fileList.push(file);
            }
            tid && clearTimeout(tid);
            tid = setTimeout(()=>{
                console.log(`读取完成，文件总数为${fileList.length}`);
                listener.emit("file", fileList);
                this.visible = false;
            }, 600)
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>