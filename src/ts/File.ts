export default class File {


    constructor() {

    }

    write(data: any): void {
        this.saveArrayBuffer(data, "data.txt");
    }

    save(blob: any, filename: string) {
        // var link = document.createElement('a');
        // link.style.display = 'none';
        // document.body.appendChild(link); // Firefox workaround, see #6594
        // link.href = URL.createObjectURL(blob);
        // link.download = filename;
        // link.click();

        var reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = (r) => {
            console.info(reader.result);
            var rs = new DataView(reader.result as ArrayBuffer);
            console.log(rs);
            reader.readAsText(new Blob( [rs] ), 'utf-8');
            reader.onload = function(){
                console.info(reader.result);
            }
            this.download(new Blob( [rs], { type: 'text/plain' } ), filename);
        }
    }

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