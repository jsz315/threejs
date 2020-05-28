import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        designVisible: false,
        effectVisible: false,
        detailVisible: false,
        priceVisible: false,
        priceAllVisible: false,
        priceWindowVisible: false,
        priceDetailVisible: false,
        colorVisible: false,
        guiderVisible: false,
        orderVisible: false,
        effectParam: {
            ambient: 0.4,
            directional: 0.6,
            roughness: 0.2,
            metalness: 0.2,
            far: 0.1
        },
        modelId: 0,
        modelType: 0,
        productImages: [],
        sellerImages: [],
        logoImage: null,
        priceItem: {},
        partItem: {}
    },
    mutations: {
        changeSellerImages(state, value){
            state.sellerImages = value;
        },
        changePriceItem(state, value){
            state.priceItem = value;
        },
        changePartItem(state, value){
            state.partItem = value;
        },
        changeOrderVisible(state, value){
            state.orderVisible = value;
        },
        changePriceAllVisible(state, value){
            state.priceAllVisible = value;
        },
        changePriceWindowVisible(state, value){
            state.priceWindowVisible = value;
        },
        changePriceDetailVisible(state, value){
            state.priceDetailVisible = value;
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
