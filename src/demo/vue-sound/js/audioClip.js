import AudioSculptor from 'audio-sculptor';

const audioSculptor = new AudioSculptor({
    timeout: 20 * 1000, // 将超时设置为20s
})


async function test(src){
    // const workerPath = '/js/ffmpeg-worker-mp4.js';
    // audioSculptor.open(workerPath).then(() => {
        console.log('open success!');
        const audio = new Audio(src);
        const blob = await audioSculptor.toBlob(audio);
        const clippedBlob = await audioSculptor.clip(blob, 1, 2);
        const clippedAudio = await audioSculptor.toAudio(clippedBlob);
        console.log(clippedAudio);
    // });
}

export default {
    test
}
