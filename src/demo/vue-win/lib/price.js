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
        var url;
        if(isERP()){
            url = host + "/api/index/modelPrice";
            res = await axios.get(url, {
                params: {
                    type: sourcetype,
                    id: id,
                    v: Math.random()
                }
            });
        }
        else{
            url = host + "/mapi/index.php";
            // url = "/test.json";
            res = await axios.get(url, {
                params: {
                    app:"modelshow",
                    fnn:"modelDetailById",
                    sourcetype: sourcetype,
                    yun3d_id: id,
                    v: Math.random()
                }
            });
        }
    
        if (res.data && res.data.code == 200) {
            var list = [];
            var datas = res.data.datas;
            if(datas.plan){
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
                        var t = await getBalcony(item);
                        if(t){
                            item.type = 'balcony';
                            list.push(item);
                        }
                    }
                }
                if(datas.sunroom){
                    for(var i in datas.sunroom){
                        var item = datas.sunroom[i];
                        var t = await getBalcony(item);
                        if(t){
                            item.type = 'sunroom';
                            list.push(item);
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

            resolve(list)
        }
        resolve();
    })
}

function getParts(obj){
    return new Promise(async resolve=>{
        var list = [];
        for(var i in obj.plan){
            var item = obj.plan[i];
            if(item.show_offer == 2 && item.state == 1){
                var t = await getWindoor(item);
                if(t){
                    item.type = 'windoor';
                    list.push(item);
                }
            }
        }

        resolve(list);
    })
}

function isERP(){
    if(location.search.indexOf('3d.mendaow.com') != -1 || location.search.indexOf('3d.mendaoyun.com') != -1 || location.search.indexOf('3d.mendaot.com') != -1){
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

async function getBalcony(obj){
    return new Promise(async resolve=>{
        // var host = getHost();
        // var url = host + '/data/upload/' + obj.balcony_path + "/" + obj.balcony_file + "?v=" + Math.random();
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
           
            // let res = await axios.get(url);
            // if(res.data){
            //     var data = res.data;
            //     obj.detail = data;
            //     resolve(true);
            // }
            // else{
            //     resolve(false);
            // }

            axios.get(url).then(res=>{
                if(res.data){
                    var data = res.data;
                    obj.detail = data;
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
    getParts,
    getSize,
    getHost,
    timerFormat
}