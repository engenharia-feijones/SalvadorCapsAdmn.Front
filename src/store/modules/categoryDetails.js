import axios from "axios";

const BASE_URL = "https://salvadorcapsapi.azurewebsites.net/api";

const state = () => ({
  categoryDetails: [],
  categoryDetail: [],
  categoryId: null,
});

const getters = {
  category: (state, getters, rootState) =>
    rootState.categorys.categorys.filter(
      ({ id }) => id === state.categoryId
    )[0],

  categoryName: (state, getters) => getters.category?.name,
  
  lastDetailId: (state) =>
    state.categoryDetails[state.categoryDetails.length - 1]?.id,
};

const mutations = {
  setCategoryDetails(state, categoryDetails) {
    state.categoryDetails = categoryDetails;
  },

  setCategoryDetail: (state, categoryDetail) => state.categoryDetail = categoryDetail,

  setCategoryId(state, categoryId) {
    state.categoryId = categoryId;
  },
};

const actions = {
  async getCategoryDetails({ commit, dispatch }, categoryId) {
    const response = await axios.get(
      `${BASE_URL}/CategoryDetail/?categoryID=${categoryId}`
    );
     commit("setCategoryDetails", response.data);
     commit("setCategoryId", categoryId);
    await dispatch("categorys/getCategorys", {}, { root: true });
  },

  async getCategoryDetailById({ commit }, id) {
    const response = await axios.get(`${BASE_URL}/CategoryDetail/${id}`)
    commit("setCategoryDetail", response.data)
  },

  async deleteCategoryDetail({ dispatch, state }, idDetailToDelete) {
    await axios.delete(`${BASE_URL}/CategoryDetail/${idDetailToDelete}`);
    dispatch("getCategoryDetails", state.categoryId);
  },

  async createCategoryDetail(context, body) {
    await axios.post(`${BASE_URL}/CategoryDetail`, body);
  },


  async updateCategoryDetail(context, {id, ...body}) {
    await axios.put(`${BASE_URL}/CategoryDetail/${id}`, body);

  },

};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
