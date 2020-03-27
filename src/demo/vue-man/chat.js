import listener from './lib/listener';

function chat(){
    var socket = io('https://wlwol.cn');

    socket.on('connect', ()=>{
        console.log('connect');
        socket.emit('login', 'ios');
    });
    
    socket.on('msg', (data)=>{
        console.log('msg');
        console.log(data);
    });
    
    socket.on('disconnect', ()=>{
        console.log('disconnect');
    });
    
    listener.on('chat', msg=>{
        socket.emit('msg', msg);
    })
    
}

export default chat;