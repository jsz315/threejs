const listener = {

}

listener.on = function(type, callback){
    if(!listener[type]){
        listener[type] = [];
    }
    listener[type].push(callback);
    return {
        destory(){
            var id = listener[type].indexOf(callback);
            listener[type].splice(id, 1);
        }
    }
}

listener.emit = function(){
    let args = [...arguments];
    let type = args.shift();
    listener[type] && listener[type].forEach(item => {
        item.apply(null, args);
    })
}


listener.make = function(dom, type, callback){
    dom.addEventListener(type, callback, {passive: false});
    return {
        destory() {
            dom.removeEventListener(type, callback, {passive: false});
        },
    };
}

export default listener;