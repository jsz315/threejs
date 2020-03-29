import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        effectVisible: false,
        guiderVisible: false,
        panel: {
            type: '',
            visible: false,
        },
        tempParam: {},
        params: {
            muscle: {
                name: "肌肉",
                roughness: 0.72,
                metalness: 0.2,
                alpha: 1,
                color: '#ff824f',
                visible: true
            },
            bones: {
                name: "骨骼",
                roughness: 0.2,
                metalness: 0.52,
                alpha: 1,
                color: '#00ffff',
                visible: true
            },
            eye: {
                name: "眼睛",
                roughness: 0.2,
                metalness: 0.2,
                alpha: 1,
                color: '#ff0000',
                visible: true
            },
            ambient: {
                name: "环境光",
                intensity: 0.32,
                color: '#ffffff',
                visible: true
            },
            directional: {
                name: "平行光",
                intensity: 0.4,
                color: '#ffe944',
                visible: true
            },
            system: {
                name: "系统",
                background: '#c9c9c9',
                exposure: false
            }
        }
    },
    mutations: {
        changePanel(state, value){
            state.panel = value;
            state.tempParam = state.params[value.type];
            console.log("临时数据：", state.tempParam);
        },
        changeParams(state, value){
            state.params = value;
        },
        changeTypeParams(state, value){
            var type = state.panel.type;
            state.params[type] = value;
        },
        changeEffectVisible(state, value){
            state.effectVisible = value;
        },
        changeGuiderVisible(state, value){
            state.guiderVisible = value;
        },
        limitMax(state){
            console.log('ok');
            for(var i in state.params){
                for(var j in state.params[i]){
                    if(j == 'roughness' || j == 'metalness' || j == 'intensity'){
                        if(state.params[i][j] > 1){
                            console.log(i, j, state.params[i][j]);
                            state.params[i][j] = 1;
                        }
                    }
                }
            }
        }
    },
    actions: {

    }
});
