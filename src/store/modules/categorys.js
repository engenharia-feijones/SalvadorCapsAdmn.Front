import axios from "axios";

const BASE_URL = "https://salvadorcapsapi.azurewebsites.net/api";

const state = () => ({
  categorys: [],
  category: {}
});

const mutations = {
  setCategorys: (state, categorys) => state.categorys = categorys,
  setCategory: (state, category) => state.category = category
};

const actions = {
  async getCategorys({ commit }) {
    const response = await axios.get(`${BASE_URL}/Category`);
    commit("setCategorys", response.data);
  },

  async getCategory({ commit }, id) {
    const response = await axios.get(`${BASE_URL}/Category/${id}`)
    commit("setCategory", response.data)
  },

  // eslint-disable-next-line no-unused-vars
  async deleteCategory({ dispatch }, id) {
    await axios.delete(`${BASE_URL}/Category/${id}`);
    dispatch("getCategorys");
  },

  // eslint-disable-next-line no-unused-vars
  async createCategory({ dispatch }, body) {
    await axios.post(`${BASE_URL}/Category`, body);
  },


    // eslint-disable-next-line no-unused-vars
  async updateCategory({ dispatch }, {id, ...body}) {
    await axios.put(`${BASE_URL}/Category/${id}`, body);
  },

};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
