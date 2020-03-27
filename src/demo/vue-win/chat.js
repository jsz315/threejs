import listener from './lib/listener';

var socket;
let t = getTime();
let list = [];
let all = readData();

function getTime(){
    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    return [h > 9 ? h : '0' + h, m > 9 ? m : '0' + m, s > 9 ? s : '0' + s].join(":");
}

function init(){
    console.log("=============== socket init ====================");
    // var socket = io('https://wlwol.cn');
    // var socket = io('http://127.0.0.1:8899');

    // socket.on('connect', ()=>{
    //     console.log('==== socket connect ====');
    //     socket.emit('login', 'ios');
    // });
    
    // socket.on('msg', (data)=>{
    //     console.log('==== socket msg ====');
    //     console.log(data);
    // });
    
    // socket.on('disconnect', ()=>{
    //     console.log('==== socket disconnect ====');
    // });

    listener.on('chat', msg=>{
        console.log(msg);
        // socket && socket.emit('msg', msg);
        saveData(msg);
    })
    
}


function saveData(msg){
    list.push(msg);
    all[t] = list.slice(-6);
    localStorage.setItem('loads', JSON.stringify(all));
}

function readData(){
    var str = localStorage.getItem('loads');
    return str ? JSON.parse(str) : {};
}

function clear(){
    localStorage.setItem('loads', '');
    localStorage.clear();
}

export default {
    init,
    saveData,
    readData,
    clear
}