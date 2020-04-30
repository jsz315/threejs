import axios from "axios";

//url转arrayBuffer
function url2ArrayBuffer(url) {
    return axios({
        url,
        method: 'get',
        responseType: 'arraybuffer',
    }).then(res => res.data);
}

//file转arrayBuffer
function file2ArrayBuffer(file) {
    return new Promise(resolve => {
        const fileReader = new FileReader();
        fileReader.onload = function () {
            resolve(fileReader.result);
        };
        fileReader.readAsArrayBuffer(file);
    });
}

//arrayBuffer转file
function arrayBuffer2File(arrayBuffer, name, type) {
    // arrayBuffer2file(arrayBuffer, 'test.mp3', 'audio/mp3')
    const file = new File([arrayBuffer], name, {
        type: type
    });
    return file;
}

//file转url
function file2Url(file) {
    const url = URL.createObjectURL(file);
    return url;
}

//url转AudioBuffer
function url2AudioBuffer(url) {
    return new Promise(async (resolve) => {
        let encodedBuffer = await url2ArrayBuffer(url);
        const context = new AudioContext();
        // 解码
        context.decodeAudioData(encodedBuffer, decodedBuffer => {
            resolve(decodedBuffer);
        });
    })
}

export default {
    url2ArrayBuffer,
    file2ArrayBuffer,
    arrayBuffer2File,
    file2Url,
    url2AudioBuffer,
}