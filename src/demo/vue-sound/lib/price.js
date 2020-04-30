import axios from "axios";
import Tooler from '../core/Tooler'

async function getList(){
    return new Promise(async resolve=>{
        let u = Tooler.getQueryString("u");
        if(!u){
            resolve();
        }
        
        var temp = u.split("-");
        let id = temp.pop();
        let sourcetype = temp.pop();
        let res;
        let host = getHost();
        if(isERP()){
            res = await axios.get(host + "/api/index/modelPrice", {
                params: {
                    type: sourcetype,
                    id: id,
                    v: Math.random()
                }
            });
        }
        else{
            res = await axios.get(host + "/mapi/index.php", {
                params: {
                    app:"modelshow",
                    fnn:"modelDetailById",
                    sourcetype: sourcetype,
                    yun3d_id: id,
                    v: Math.random()
                }
            });
        }
    
        console.log(res);
        if (res.data && res.data.code == 200) {
            var list = [];
            for(var i in res.data.datas){
                var item = res.data.datas[i];
                if(item.show_offer == 2){
                    await getItem(item);
                    list.push(item);
                }
            }

            resolve(list)
        }
        resolve();
    })
}

function isERP(){
    if(location.search.indexOf('3d.mendaow.com') != -1 || location.search.indexOf('3d.mendaoyun.com') != -1){
        return false;
    }
    return true;
}

function getHost(){
    return location.search.match(/http.*?.com/)[0];
}

function getSize(data){
    var list = [];
    if(data.length){
        list.push(data.length);
    }
    if(data.height){
        list.push(data.height);
    }
    if(data.width){
        list.push(data.width);
    }
    return list.join("x");
}

async function getItem(obj){
    return new Promise(async resolve=>{
        // var host = Tooler.isTest() ? 'http://3d.mendaow.com' : 'https://3d.mendaoyun.com';
        var host = getHost();

        var url = host + '/data/upload' + obj.plan_path + "/" + obj.pricejson_file + "?v=" + Math.random();
        console.log(url);
        let res = await axios.get(url);
        var data = res.data;
        obj.detail = data;

        // console.log(data);
        // obj.area = data.acreage;
        // obj.price = data.cost;
        // obj.count = data.items[0] ? data.items[0].discount : 1;           
        // obj.all = obj.count * obj.price * obj.setnum;
        // obj.size = getSize(data);
        // obj.items = data.items;
        resolve();
    });
}

function timerFormat(timer){
    var date = new Date(timer);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return [y, addZero(m), addZero(d)].join("/");
}

function addZero(value, size){
    return (Array(size).join(0) + value).substr(-size); 
}

export default {
    getList,
    getItem,
    getSize,
    getHost,
    timerFormat
}