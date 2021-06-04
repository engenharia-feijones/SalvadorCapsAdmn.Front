import axios from "axios";

const BASE_URL = "https://salvadorcapsapi.azurewebsites.net/api";

const state = () => ({
  products: [],
  product: [],
  // uniqueProducts: [],
});

const mutations = {
  setProducts: (state, products) => (state.products = products),
  setProduct: (state, product) => state.product = product
  // setUniqueProducts: (state, products) => {
  //   const uniqueIds = [...new Set(state.products.map(({ id }) => id))];
  //   return (state.uniqueProducts = uniqueIds.map(
  //     (uniqueId) => products.filter(({ id }) => id === uniqueId)[0]
  //   ));
  // },
};

const getters = {
  categorys: (state, getters, rootState) => {
    let categorysData = rootState["categorys"].categorys;
    categorysData.forEach(async (category, index) => {
      const response = await axios.get(
        `${BASE_URL}/CategoryDetail?categoryID=${+category.id}`
      );
      categorysData[index]["detail"] = response.data;
    });
    return categorysData;
  },
  brands: (state, getters, rootState) => rootState["brands"].brands,
};

const actions = {
  async getProducts({ commit, dispatch }) {
    const response = await axios.get(`${BASE_URL}/Product`);
    commit("setProducts", response.data);
    // commit("setUniqueProducts", response.data);
    await dispatch("categorys/getCategorys", {}, { root: true });
    await dispatch("brands/getBrands", {}, { root: true });
  },

  async getProductsByCategoryId({ commit }, categoryID) {
    const response = await axios.get(
      `${BASE_URL}/Product?categoryID=${categoryID}`
    );
    commit("setProducts", response.data);
    // commit("setUniqueProducts", response.data);
  },

  async getProductById({ commit }, id) {
    const response = await axios.get(`${BASE_URL}/Product/${id}`)
    commit("setProduct", response.data)
  },

  async createProduct(context, body) {
    await axios.post(`${BASE_URL}/Product`, body)
  },

  async updateProduct(context, {id, body}) {
    await axios.put(`${BASE_URL}/Product/${id}`, body)
  },

  async deleteProduct({ dispatch }, id) {
    await axios.delete(`${BASE_URL}/Product/${id}`);
    await dispatch("getProducts");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
