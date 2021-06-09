<template>

    <div class="container-wrapper">
      <v-row justify="center" align="center">
      <v-card-title class="title">
        <h1>{{ brand.name }}</h1>
      </v-card-title>
      <v-col xl="2" lg="3" md="4" sm="5" xs="11" v-for="product in products" :key="product.id" align="center">
        <div class="product-card">
          <v-card max-width="374px" @click="redirectToProductDetails(product)" class="transparent product">
          <v-img class="product-box" :src="product.image"></v-img>
          <v-card-title class="center product-name">
             {{
            removeBrandFromName(product)
          }} 
          <!-- {{ product.externalName }} -->
          </v-card-title>
          <div class="center product-price">
            <small>R$</small><b>{{ getInteger(product.price) }},</b><small>{{ getDecimal(product.price) }}</small>
          </div>
        </v-card>
        </div>
      </v-col>
    </v-row>
    </div >

</template>
<script>
import axios from "axios";
export default {
  // Definição das props do componente

  data: () => ({
    selection: "",
  }),

  props: {
    brand: {
      Type: Object,
    },
    products: {
      type: [Object, Array]
    }
  },

  methods: {
    getInteger(num) {
      return Math.floor(num).toString();
    },
    getDecimal(num) {
      return (num - Math.floor(num)).toFixed(2).replace("0.", "");
    },

    removeBrandFromName({ externalName }) {
      return externalName.includes(this.brand.name) ? externalName.replace(this.brand.name, '').trim() : externalName.trim()
    },

    redirectToProductDetails({ id }) {
      this.$router.push({name: "ProductsDetails", params: { id }}) 
    }
  },
};
</script>
<!-- scoped: a camada de estilo se aplica somente a este component -->
<style scoped>
.title {
  width: 100%;
  margin: 1.25em 0px 0px;
  display: flex;
  justify-content: center;
}
.title h1 {
  font-family: "Montserrat";
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
}

.product-card {
  transition: all .3s;
}

.product-card:hover {
  transform: translateY(-2px);
}

.product {
  margin: 0.75em;
}
.product-box {
  max-height: 23.38em;
  max-width: 23.38em;
  border: 10px solid #feb425;
}
.product-name {
  padding: 0.63em 0.63em 0px;
  word-wrap: normal;
  font-size: 1.13rem;
  font-weight: 700;
}
.product-price {
  display: flex;
}
.product-price > small {
  align-self: flex-end;
  font-size: 12px;
  font-weight: 600;
  padding: 2px;
}
.product-price > b {
  align-self: flex-end;
}

</style>
