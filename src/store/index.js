import Vue from 'vue'
import Vuex from 'vuex'
import brands from './modules/brands'
import categorys from './modules/categorys'
import categoryDetails from './modules/categoryDetails'
import products from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        categorys,
        categoryDetails,
        products,
        brands
    }
})