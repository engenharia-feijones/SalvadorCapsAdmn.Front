<template>
  <Search :brand="brand" :products="products" />
</template>

<script>
// @ is an alias to /src
import Search from "@/components/Search.vue";
import Axios from "axios";

export default {
  name: "Produtos",
  components: {
    Search,
    Axios,
  },
  data() {
    return {
      products: [],
      brand: {},
    };
  },

  watch: {
    '$route.params.brandName'() {
      this.getBrand(this.$route.params.brandName).then((response) => {
        this.getProducts();
      })
    },
  },
  async created() {
    await this.getBrand(this.$route.params.brandName).then(async (response) => {
      await this.getProducts();
    })
  },
  methods: {
    async getProducts() {
      await Axios.get('https://salvadorcapsapi.azurewebsites.net/api/Product').then((response) => {
        this.products = response.data.filter(
          (product) => product.brandID == this.brand.id
        );
      });
    },

    async getBrand(brandName) {
      let params = {
        name: brandName
      }
      await Axios.get('https://salvadorcapsapi.azurewebsites.net/api/Brand', {
        params: params
      }).then((response => {
        this.brand = response.data[0];
      }))
    },
  },
};
</script>
