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
            ambient: 0.4,
            directional: 0.8,
            roughness: 0.3,
            metalness: 0.6
        },
        transformParam: {
            x: 0,
            y: 0,
            z: 0
        },
        transformVisible: false,
        modelId: 0,
        modelType: 0,
        productImages: [],
        logoImage: null
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
        changeTransformVisible(state, value){
            state.transformVisible = value;
        },
        changeTransformParam(state, value){
            state.transformParam = value;
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
        changeLogoImage(state, value){
            state.logoImage = value;
        }
    },
    actions: {

    }
});
