<template>
  <div class="container-product-details">
    <v-card class="transparent mt-4">
      <v-card-title class="mt-3">
        <v-row justify="center">
          <h1 class="product-name">{{ product.externalName }}</h1>
        </v-row>
      </v-card-title>
      <div class="grid-details mt-9">
        <ProductsCarousel
          v-if="isMobile"
          class="carousel-container"
          :images="images"
        />
        <ProductsImages :images="images" v-else />
        <div
          class="grid-details-childreen mt-3"
          :class="[!isMobile ? 'left-bar' : '']"
        >
          <ProductsInfo :product="product" :details="details" />
        </div>
      </div>
    </v-card>

    <!-- <ProductsSimilar :products="products" /> -->
  </div>
</template>
<script>
import axios from "axios";
import ProductsCarousel from "../components/ProductsCarousel.vue";
import ProductsImages from '../components/ProductsImages.vue'
import ProductsInfo from "../components/ProductsInfo.vue";
import ProductsSimilar from '../components/ProductsSimilar.vue'

export default {
  data: () => ({
    productID: null,
    products: [],
    product: [],
    details: [],
    images: [],

    windowWidth: null,
    // isMobile: true,
  }),

  components: {
    ProductsCarousel,
    ProductsImages,
    ProductsInfo,
      ProductsSimilar
  },

  computed: {
    isMobile() {
            switch (this.$vuetify.breakpoint.name) {
                case "xs":
                    return true;
                case "sm":
                    return true;
               default:
                 return false;
            }
        },
  },




  methods: {
    async handleGetProduct() {
      try {
        const response = await axios.get(
          `https://salvadorcapsapi.azurewebsites.net/api/Product/${this.productID}`
        );
        this.product = await response.data;

        await this.handleGetProductDetail(this.product.productCategoryDetails);
      } catch {
        console.log("Unable to find db");
      }
    },

    async handleGetProductDetail(detailsList) {
      detailsList.forEach(async ({ categoryDetailID }) => {
        await this.getProuctDetails(categoryDetailID);
      });
    },

    async getProuctDetails(id) {
      try {
        const response = await axios.get(
          `https://salvadorcapsapi.azurewebsites.net/api/CategoryDetail/${id}`
        );
        this.details = [...this.details, response.data];
        this.handleProducts(this.details[0].products);
      } catch {
        console.log(`Cannot fetch server data ${id}`);
      }
    },

    handleImages() {
      // TODO: SE NÃO APARECER IMAGENS NO FUTURO AQUI TÁ O B.O
      this.images.push(this.product.image);

      this.product.productImages.map(({ image }) => {
        this.images.push(image);
      });

     
    },

    handleProducts(products) {
      const filtredProducts = products.filter(
        ({ id }) => id !== this.product.id
      );
      this.products = filtredProducts;
    },
  },

  async created() {
    this.productID = this.$route.params.id;

    await this.handleGetProduct();
    this.handleImages();
  },

  mounted() {
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth;
    });

  },
};
</script>
<style scoped>
* {
  font-family: "Montserrat";
}

.container-product-details {
    width: calc(100% - 10vw);
  max-width: 1100px;
  margin: 0 auto;
}

.product-name {
  font-weight: 700;
}
.carousel-container {
  margin: 0 auto;
}



.left-bar {
  border-left: 0.1em solid gray;
}
.grid-details-childreen {
  padding-left: 0.7em;
}

@media screen and (min-width: 768px) {
  .grid-details {
    display: grid;

    grid-template-columns: 65fr 35fr;
  }
}
</style>