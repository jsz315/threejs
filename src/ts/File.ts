export default class File {


    constructor() {

    }

    write(data: any): void {
        // this.saveArrayBuffer(data, "data.txt");
        this.test();
    }

    save(blob: any, filename: string) {
        // this.download(blob, filename);

        // var link = document.createElement('a');
        // link.style.display = 'none';
        // document.body.appendChild(link); // Firefox workaround, see #6594
        // link.href = URL.createObjectURL(blob);
        // link.download = filename;
        // link.click();

        // var reader = new FileReader();
        // reader.readAsArrayBuffer(blob);
        // reader.onload = (r) => {
        //     console.info(reader.result);
        //     var rs = new DataView(reader.result as ArrayBuffer);
        //     console.log(rs);
        //     reader.readAsText(new Blob( [rs] ), 'utf-8');
        //     reader.onload = function(){
        //         console.info(reader.result);
        //     }
        //     this.download(new Blob( [rs], { type: 'text/plain' } ), filename);
        // }
    }

    test(){
        let uri = "data:application/octet-stream;base64,AACgwAAAoMAAACBAAACgQAAAoMAAACBAAACgQAAAoEAAACBAAACgQAAAoEAAACBAAABAwAAAQEAAACDAAACgwAAAoMAAACBAcFiSvnBYkj4aJ2o/AAAAAAAAAAAAAIA/cFiSvnBYkj4aJ2o/cFiSvnBYkj4aJ2o/pQYKv6UGCj+SoSU/cFiSvnBYkj4aJ2o/AACAPwAAgD8AAIA/AACAPwAAgD8AAIA/AACAPwAAgD8AAIA/AACAPwAAgD8AAIA/AACAPwAAgD8AAIA/AACAPwAAgD8AAIA/AAAAAAAAAAAAAIA/AAAAAAAAgD8AAIA/AACAPwAAgD8AAAAAAACAPwAAAAAAAAAAAAABAAIAAAADAAQABQAAAA==";
        let blob = this.dataURLtoBlob(uri);
        // this.download(blob, "scene.txt");

        var reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = (r) => {
            console.info(reader.result);
            var rs = new DataView(reader.result as ArrayBuffer);
            console.log(rs);
        }
    }

    //base64转blob
    dataURLtoBlob(dataurl:string) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    //blob转base64
    blobToDataURL(blob: Blob, callback: Function) {
        let a = new FileReader();
        a.onload = function (e) { callback(a.result); }
        a.readAsDataURL(blob);
    }

    //base64转文件
    // dataURLtoFile(dataurl: string, filename:string) {
    //     var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    //         bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    //     while(n--){
    //         u8arr[n] = bstr.charCodeAt(n);
    //     }
    //     return new File([u8arr], filename, {type:mime});
    // }

    download(blob: any, filename: string){
        var link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link); // Firefox workaround, see #6594
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    saveString(text: any, filename: string) {
        let blob = new Blob([text], { type: 'text/plain' });
        console.log(blob);
        this.save(blob, filename);
    }


    saveArrayBuffer(buffer: any, filename: string) {
        let blob = new Blob([buffer], { type: 'application/octet-stream' });
        console.log(blob);
        this.save(blob, filename);
    }
}