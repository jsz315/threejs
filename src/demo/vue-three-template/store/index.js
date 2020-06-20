import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        settingVisible: true,
        param: {
            ambient: 1.32,
            directional: 0.42,
            roughness: 0.36,
            metalness: 0.36
        }
    },
    mutations: {
        changeParam(state, value){
            state.param = value;
        },
        changeSettingVisible(state, value){
            state.settingVisible = value;
        },
    },
    actions: {

    }
});
