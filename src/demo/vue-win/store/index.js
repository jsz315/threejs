import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        designVisible: false,
        effectVisible: false,
        detailVisible: false,
        colorVisible: false,
        guiderVisible: false,
        effectParam: {
            ambient: 1.32,
            directional: 0.42,
            roughness: 0.35,
            metalness: 0.36
        },
        modelId: 0,
        modelType: 0
    },
    mutations: {
        changeDesignVisible(state, value){
            state.designVisible = value;
        },
        changeEffectVisible(state, value){
            state.effectVisible = value;
        },
        changeDetailVisible(state, value){
            state.detailVisible = value;
        },
        changeEffectParam(state, value){
            state.effectParam = value;
        },
        changeColorVisible(state, value){
            state.colorVisible = value;
        },
        changeModelId(state, value){
            state.modelId = value;
        },
        changeModelType(state, value){
            state.modelType = value;
        },
        changeGuiderVisible(state, value){
            state.guiderVisible = value;
        }
    },
    actions: {

    }
});
