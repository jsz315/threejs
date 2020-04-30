import axios from "axios";
import tooler from './fileTransform';
import listener from '../lib/listener'
var toWav = require('audiobuffer-to-wav')

let audioContext = new window.AudioContext();
let channels = 1;

function make(second) {
    let frameCount = audioContext.sampleRate * second;
    let arrayBuffer = audioContext.createBuffer(channels, frameCount, audioContext.sampleRate);

    let t = 0;
    let f = 0;

    for (let channel = 0; channel < channels; channel++) {
        // This gives us the actual array that contains the data
        let nowBuffering = arrayBuffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            // Math.random() is in [0; 1.0]
            // audio needs to be in [-1.0; 1.0]
            // nowBuffering[i] = Math.random() * 2 - 1;
            if(++f > 100){
                f = 0;
                nowBuffering[i] = Math.sin(t);
                t += Math.PI / 180;
            }
            
        }
    }

    audioContext.resume();

    // Get an AudioBufferSourceNode.
    // This is the AudioNode to use when we want to play an AudioBuffer
    let source = audioContext.createBufferSource();
    // set the buffer in the AudioBufferSourceNode
    source.buffer = arrayBuffer;

    setVol(source);

    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    // source.connect(audioContext.destination);

    // start the source playing
    source.start();

    source.onended = () => {
        console.log('White noise finished');
    }
}

async function load(){
    // axios.get('https://wlwol.cn/media/audio/1582017952748.mp3', {responseType: "arraybuffer"}).then(response => {
    //     console.log(response);
    //     play(response.data);
    // }).catch(err => {
    //     console.log(err);
    // });

    let res = await tooler.url2AudioBuffer('https://wlwol.cn/media/audio/1582017952748.mp3');
    let bf = cut(res, 0, 0.42);

    const context = new AudioContext();
    console.log(context)
    const dataSource = context.createBufferSource();
    // 加载缓存
    dataSource.buffer = bf.cutAudioBuffer;
    // 连接播放器节点destination，中间可以连接其他节点，比如音量调节节点createGain()，
    // 频率分析节点（用于傅里叶变换）createAnalyser()等等
    dataSource.connect(context.destination);

    // setVol(dataSource, context);

    //开始播放
    dataSource.start();

    var wav = toWav(bf.cutAudioBuffer);
    console.log(wav, 'wav');
    let file = new window.File([wav], 'test.mp3', {type: 'audio/mp3'});
    var src = URL.createObjectURL(file);
    console.log(src);
    listener.emit('url', src);
    // saveAudio(context);
}

function saveAudio(ac){
    var chunks = [];
    var dest = ac.createMediaStreamDestination();
    var osc = ac.createOscillator();
    var mediaRecorder = new MediaRecorder(dest.stream);
    mediaRecorder.start();
    osc.start(0);
    setTimeout(() => {
        mediaRecorder.stop();
        osc.stop(0);
    }, 3000);
    mediaRecorder.ondataavailable = function(evt) {
        // push each chunk (blobs) in an array
        chunks.push(evt.data);
    };
    mediaRecorder.onstop = function(evt) {
        // Make blob out of our blobs, and open it.
        var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        var src = URL.createObjectURL(blob);
        console.log(src);
        let file = new window.File([blob], 'test.mp3', {type: 'audio/mp3'});
        src = URL.createObjectURL(file);
        console.log(src);
        listener.emit('url', src);

    };
}

function play(encodedBuffer){
    const context = new AudioContext();
    // 解码
    context.decodeAudioData(encodedBuffer, decodedBuffer => {
        // 创建数据缓存节点
        const dataSource = context.createBufferSource();
        // 加载缓存
        dataSource.buffer = decodedBuffer;
        // 连接播放器节点destination，中间可以连接其他节点，比如音量调节节点createGain()，
        // 频率分析节点（用于傅里叶变换）createAnalyser()等等
        // dataSource.connect(context.destination);

        setVol(dataSource, context);

        // 开始播放
        dataSource.start();
    })
}

function read(){
    const reader = new FileReader();
    // file 为读取到的文件，可以通过<input type="file" />实现
    reader.readAsArrayBuffer(file);
    reader.onload = evt => {
        // 编码过的音频数据
        const encodedBuffer = evt.currentTarget.result;
        // 下面开始处理读取到的音频数据
        // 创建环境对象
        const context = new AudioContext();
        // 解码
        context.decodeAudioData(encodedBuffer, decodedBuffer => {
            // 创建数据缓存节点
            const dataSource = context.createBufferSource();
            // 加载缓存
            dataSource.buffer = decodedBuffer;
            // 连接播放器节点destination，中间可以连接其他节点，比如音量调节节点createGain()，
            // 频率分析节点（用于傅里叶变换）createAnalyser()等等
            dataSource.connect(context.destination);
            // 开始播放
            dataSource.start();
        })
    }
}

function setVol(source, audioContext){
    let analyser = audioContext.createAnalyser();
    let volume = audioContext.createGain();
    volume.gain.value = 0.8;
    source.connect(analyser);
    analyser.connect(volume);

    //变调
    let filter = audioContext.createBiquadFilter(); 
    filter.type = "lowshelf";
    filter.frequency.value = 24000; 
    volume.connect(filter);
 
    filter.connect(audioContext.destination); 
}

function cut(originalAudioBuffer, start, end) {
    const { numberOfChannels, sampleRate } = originalAudioBuffer;
    const lengthInSamples = (end - start) * sampleRate;
    // offlineAudioContext相对AudioContext更加节省资源
    const offlineAudioContext = new OfflineAudioContext(numberOfChannels, numberOfChannels, sampleRate);
    // 存放截取的数据
    const cutAudioBuffer = offlineAudioContext.createBuffer(
        numberOfChannels,
        lengthInSamples,
        sampleRate
    );
    // 存放截取后的数据
    // const newAudioBuffer = offlineAudioContext.createBuffer(
    //     numberOfChannels,
    //     originalAudioBuffer.length - cutSegment.length,
    //     originalAudioBuffer.sampleRate
    // );
    // 将截取数据和截取后的数据放入对应的缓存中
    for (let channel = 0; channel < numberOfChannels; channel++) {
        // const newChannelData = newAudioBuffer.getChannelData(channel);
        const cutChannelData = cutAudioBuffer.getChannelData(channel);
        const originalChannelData = originalAudioBuffer.getChannelData(channel);
        // const beforeData = originalChannelData.subarray(0,
        //     start * sampleRate - 1);
        const midData = originalChannelData.subarray(start * sampleRate,
            end * sampleRate - 1);
        // const afterData = originalChannelData.subarray(
        //     end * sampleRate
        // );
        cutChannelData.set(midData);
        // if (start > 0) {
        //     newChannelData.set(beforeData);
        //     newChannelData.set(afterData, (start * sampleRate));
        // } else {
        //     newChannelData.set(afterData);
        // }
    }
    return {
        // 截取后的数据
        // newAudioBuffer,
        // 截取部分的数据
        cutAudioBuffer
    };
};


function music(){
    
    // 创建新的音频上下文接口
    var audioCtx = new window.AudioContext();
    
    // 发出的声音频率数据，表现为音调的高低
    var arrFrequency = [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    
    // 音调依次递增或者递减处理需要的参数
    var start = 0, direction = 1;
    
   
    // 当前频率
    var frequency = arrFrequency[start];
    // 如果到头，改变音调的变化规则（增减切换）
    if (!frequency) {
        direction = -1 * direction;
        start = start + 2 * direction;
        frequency = arrFrequency[start];
    }
    // 改变索引，下一次hover时候使用
    start = start + direction;
    
    // 创建一个OscillatorNode, 它表示一个周期性波形（振荡），基本上来说创造了一个音调
    var oscillator = audioCtx.createOscillator();
    // 创建一个GainNode,它可以控制音频的总音量
    var gainNode = audioCtx.createGain();
    // 把音量，音调和终节点进行关联
    oscillator.connect(gainNode);
    // audioCtx.destination返回AudioDestinationNode对象，表示当前audio context中所有节点的最终节点，一般表示音频渲染设备
    gainNode.connect(audioCtx.destination);
    // 指定音调的类型，其他还有square|triangle|sawtooth
    oscillator.type = 'sine';
    // 设置当前播放声音的频率，也就是最终播放声音的调调
    oscillator.frequency.value = frequency;
    // 当前时间设置音量为0
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    // 0.01秒后音量为1
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
    // 音调从当前时间开始播放
    oscillator.start(audioCtx.currentTime);
    // 1秒内声音慢慢降低，是个不错的停止声音的方法
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
    // 1秒后完全停止声音
    oscillator.stop(audioCtx.currentTime + 1);
}

export default {
    make,
    load,
    read
}