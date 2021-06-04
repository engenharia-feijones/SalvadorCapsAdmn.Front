import axios from 'axios';

const BASE_URL = "https://salvadorcapsapi.azurewebsites.net/api";

const state = () => ({
    brands: [],
    brand: {}
})

const mutations = {
    setBrands: (state, brands) => state.brands = brands,
    setBrand: (state, brand) => state.brand = brand
}

const actions = {
    async getBrands({ commit }) { 
        const response = await axios.get(`${BASE_URL}/Brand`)
        commit("setBrands", response.data)
    },

    async getBrand({ commit }, id) {
        const response = await axios.get(`${BASE_URL}/Brand/${id}`)
        commit("setBrand", response.data)

    },

    async deleteBrand(context, id) {
        await axios.delete(`${BASE_URL}/Brand/${id}`)
    },

    async createBrand(context, body) {
        await axios.post(`${BASE_URL}/Brand`, body)
    },

    async updateBrand(context, {id, ...body})  {
        await axios.put(`${BASE_URL}/Brand/${id}`, body)
    }
}


export default {
    namespaced: true,
    actions,
    mutations,
    state
}