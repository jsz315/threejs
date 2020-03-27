import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        designVisible: false,
        effectVisible: false,
        detailVisible: false,
        priceVisible: false,
        colorVisible: false,
        guiderVisible: false,
        effectParam: {
            ambient: 0.4,
            directional: 0.6,
            roughness: 0.2,
            metalness: 0.2,
            color: '#ffffff',
            far: 0.1
        },
        modelId: 0,
        modelType: 0,
        productImages: [],
        logoImage: null,
        panel: {
            type: '',
            visible: false,
        },
        params: {
            muscle: {
                name: "肌肉",
                roughness: 0.2,
                metalness: 0.2,
                alpha: 1,
                color: '#ffffff',
                visible: true
            },
            bones: {
                name: "骨骼",
                roughness: 0.2,
                metalness: 0.2,
                alpha: 1,
                color: '#ffffff',
                visible: true
            },
            eye: {
                name: "眼睛",
                roughness: 0.2,
                metalness: 0.2,
                alpha: 1,
                color: '#ffffff',
                visible: true
            },
            tooth: {
                name: "牙齿",
                roughness: 0.2,
                metalness: 0.2,
                alpha: 1,
                color: '#ffffff',
                visible: true
            },
            other: {
                name: "其他",
                roughness: 0.2,
                metalness: 0.2,
                alpha: 1,
                color: '#ffffff',
                visible: true
            },
            ambient: {
                name: "环境光",
                intensity: 0.1,
                color: '#ffffff',
                visible: true
            },
            directional: {
                name: "平行光",
                intensity: 0.1,
                color: '#ffffff',
                visible: true
            }
        }
    },
    mutations: {
        changePanel(state, value){
            state.panel = value;
        },
        changeParams(state, value){
            state.params = value;
        },
        changeTypeParams(state, value){
            var type = state.panel.type;
            state.params[type] = value;
        },

        changeDesignVisible(state, value){
            state.designVisible = value;
        },
        changeEffectVisible(state, value){
            state.effectVisible = value;
        },
        changeDetailVisible(state, value){
            state.detailVisible = value;
        },
        changePriceVisible(state, value){
            state.priceVisible = value;
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
