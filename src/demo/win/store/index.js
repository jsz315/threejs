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
        colorList: [],
        isSingle: true,
        param: {
            ambient: 1.32,
            directional: 0.42,
            roughness: 0.36,
            metalness: 0.36
        },
        windoorImages: [],
        seriesImages: [],
        businessImages: [],
        brandImages: []
    },
    mutations: {

        changeWindoorImages(state, value){
            state.windoorImages = value;
        },
        changeSeriesImages(state, value){
            state.seriesImages = value;
        },
        changeBusinessImages(state, value){
            state.businessImages = value;
        },
        changeBrandImages(state, value){
            state.brandImages = value;
        },

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
    },
    actions: {

    }
});
