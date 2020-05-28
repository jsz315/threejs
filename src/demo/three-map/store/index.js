import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        effectVisible: false,
        detailVisible: false,
        colorVisible: false,
        phoneVisible: false,
        settingVisible: false,
        modelId: 0,
        modelType: 0,
        productImages: [],
        colorList: [],
        isSingle: true,
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
        changeIsSingle(state, value){
            state.isSingle = value;
        },
        changeColorList(state, value){
            state.colorList = value;
        },
        changeSettingVisible(state, value){
            state.settingVisible = value;
        },
        changeEffectVisible(state, value){
            state.effectVisible = value;
        },
        changePhoneVisible(state, value){
            state.phoneVisible = value;
        },
        changeDetailVisible(state, value){
            state.detailVisible = value;
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
        },
        changeProductImages(state, value){
            state.productImages = value;
        },
    },
    actions: {

    }
});
