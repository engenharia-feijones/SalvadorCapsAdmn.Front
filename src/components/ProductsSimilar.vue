<template>
  <v-sheet width="100%" height="150px" class="transparent">
    <v-slide-group
      class="mx-auto"
      v-model="model"
      active-class="success"
      show-arrows
    >
      <v-slide-item
        v-for="(product, index) in products"
        :key="index"
        
      >
        <v-card class="transparent">
          <div class="product-similar-children">
            <img
              class="product-similar-image"
              width="50px"
              height="80px"
              :src="product.image"
              alt=""
            />
            <div class="product-similar-text">
              <p>
                <small>{{ product.name }}</small>
              </p>
              <p>
                <small>{{ product.price }}</small>
              </p>
            </div>
          </div>
        </v-card>
        <!-- <v-card
          :color="active ? undefined : 'grey lighten-1'"
          class="ma-4"
          height="50"
          width="50"
          @click="toggle"
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <img src="" alt="">
          </v-row>
        </v-card> -->
      </v-slide-item>
    </v-slide-group>
  </v-sheet>
</template>
<script>
export default {
  name: "SimilarProducts",
  props: {
    products: {
      Type: Array,
      default: [],
      required: true,
    },
  },

  data: () => ({
    model: null,
  }),
};
</script>

<style scoped>
.row {
  display: flex;
  /* justify-content: space-around; */
  flex-wrap: nowrap;
}

.row-item {
  width: 5em;
  height: 5em;
}

.similar-products-container {
  background-image: transparent !important;
}

.product-similar-children {
  padding: 0.4em;
  display: flex;
  justify-content: center;
  flex-flow: column wrap;
}

.product-similar-text {
  display: flex;
  flex-wrap: wrap;
  word-wrap: break-word;
  width: 90px;
}

.product-similar-image {
  object-fit: fill;
  margin: 0 auto;
}
</style>