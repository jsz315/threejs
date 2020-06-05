import axios from "axios";
import Tooler from '../core/Tooler'
import listener from "./listener"

async function getList(){
    return new Promise(async resolve=>{
        let u = Tooler.getQueryString("u");
        if(!u){
            resolve();
        }
        
        var temp = u.split("-");
        let id = temp.pop();
        let sourcetype = temp.pop();
    
        let host = getHost();
        let res;
        if(isERP()){
            res = await axios({
                url: host + "/api/index/modelPrice",
                method: 'post',
                data: {
                    type: sourcetype,
                    id: id,
                    v: Math.random()
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
        }
        else{
            res = await axios.get(host + "/mapi/index.php", {
                params: {
                    app: "modelshow",
                    fnn: "modelDetailById",
                    sourcetype: sourcetype,
                    yun3d_id: id,
                    v: Math.random()
                }
            });
        }
        
    
        console.log(res);
        if (res.data && res.data.code == 200) {
            var list = [];
            var datas = res.data.datas;
          
            if(datas.plan && (datas.state == 1)){
                datas = datas.plan;
                if(datas.windoor){
                    for(var i in datas.windoor){
                        var item = datas.windoor[i];
                        if(item.show_offer == 2 && item.state == 1){
                            var t = await getWindoor(item);
                            if(t){
                                item.type = 'windoor';
                                list.push(item);
                            }
                        }
                    }
                }
                if(datas.balcony){
                    for(var i in datas.balcony){
                        var item = datas.balcony[i];
                        if(item.state == 1){
                            var t = await getBalcony(item);
                            if(t){
                                item.type = 'balcony';
                                list.push(item);
                            }
                        }
                    }
                }
                if(datas.sunroom){
                    for(var i in datas.sunroom){
                        var item = datas.sunroom[i];
                        if(item.state == 1){
                            var t = await getBalcony(item);
                            if(t){
                                item.type = 'sunroom';
                                list.push(item);
                            }
                        }
                    }
                }
            }
            else{
                //兼容旧数据接口
                for(var i in datas){
                    var item = datas[i];
                    if(item.show_offer == 2){
                        var t = await getWindoor(item, true);
                        if(t){
                            item.type = 'windoor';
                            item.old = true;
                            list.push(item);
                        }
                    }
                }
            }

            // for(var i in datas){
            //     var item = datas[i];
            //     item.price = '-';
            //     item.count = '-';
            //     item.area = '-';
            //     item.all = '-';
            //     item.size = '-';
                
            //     await getItem(item);
            //     if(item.show_offer == 2){
            //         list.push(item);
            //     }
            // }

            var totalNum = 0;
            var totalArea = 0;
            var totalPrice = 0;
            list.forEach(item=>{
                totalNum += item.setnum;
                totalArea += item.area;
                totalPrice += item.all;
            })
            resolve({
                list, totalNum, totalArea, totalPrice
            })
        }
        resolve();
    })
}

async function getBalcony(obj){
    
    return new Promise(async resolve=>{
        // var host = getHost();
        // var url = host + '/data/upload/' + obj.balcony_path + "/" + obj.balcony_file + "?v=" + Math.random();
        if(!obj.price_json){
            resolve(false);
            return;
        }
        var url = obj.price_json + "?v=" + Math.random();
        console.log(url);
        let res = await axios.get(url);
        if(res.data){
            var data = res.data;
            obj.detail = data;
            resolve(true);
        }
        else{
            resolve(false);
        }
    });
}

async function getWindoor(obj, old = false){
    return new Promise(async resolve=>{
        // var host = Tooler.isTest() ? 'http://3d.mendaow.com' : 'https://3d.mendaoyun.com';
        var host = getHost();

        if(obj.pricejson_file){
            // var url = host + '/data/upload' + obj.plan_path + "/" + obj.pricejson_file + "?v=" + Math.random();
            var url = obj.pricejson_file + "?v=" + Math.random();
            if(old){
                url = host + '/data/upload' + obj.plan_path + "/" + obj.pricejson_file + "?v=" + Math.random();
            }

            axios.get(url).then(res=>{
                if(res.data){
                    var data = res.data;
                    putItemData(obj, data);
                    resolve(true);
                }
                else{
                    resolve(false);
                }
            }).catch(e=>{
                console.log(url, "不存在");
                resolve(false);
            })
            
        }
        else{
            resolve(false);
        }
    });
}

function isERP(){
    if(location.search.indexOf('3d.mendaow.com') != -1 || location.search.indexOf('3d.mendaot.com') != -1 || location.search.indexOf('3d.mendaoyun.com') != -1){
        return false;
    }
    return true;
}

function getHost(){
    return location.search.match(/http.*?.com/)[0];
}

function putItemData(obj, data){
    obj.area = data.acreage;
    obj.price = data.amount || 0;
    obj.discount = isERP() ? data.items[0].discount : data.items[0].tmpDiscount;     
    obj.count = data.items[0].count;           
    obj.all = obj.count * obj.price * obj.setnum;
    obj.size = [data.length, data.height, data.width].join(" x ");
    obj.items = data.items;
    obj.seriesName = data.seriesName;
    obj.detail = data;
}

async function getItem(obj){
    return new Promise(async resolve=>{
        // var host = getHost();
        // var path = isERP() ? "json/" : "upload";
        // var url = host + '/data/' + path + obj.plan_path + "/" + obj.pricejson_file + "?v=" + Math.random();
        var url = obj.pricejson_file + "?v=" + Math.random();
        console.log(url);
        let res = await axios.get(url);
        var data = res.data;
        console.log(data);
        putItemData(obj, data);
        // obj.area = data.acreage;
        // obj.price = data.amount || 0;
        // obj.discount = isERP() ? data.items[0].discount : data.items[0].tmpDiscount;     
        // obj.count = data.items[0].count;           
        // obj.all = obj.count * obj.price * obj.setnum;
        // obj.size = [data.length, data.height, data.width].join(" x ");
        // obj.items = data.items;
        // obj.seriesName = data.seriesName;

        listener.emit('colorMap', !data.multiColor);
        // listener.emit("colorMap", this.isSingleColor);

        resolve();
    });
}


export default {
    getList,
    getItem,
    getHost,
    isERP
}