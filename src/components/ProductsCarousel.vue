<template>
  <v-carousel
    style="width: 300px"
    :continuous="true"
    :cycle="cycle"
    :show-arrows="images.length === 0"
    hide-delimiter-background
    hide-delimiters
    height="300px"
  >
    <v-carousel-item v-for="(image, i) in images" :key="i">
      <img id="img-container" class="carousel-images" :src="image" />
    </v-carousel-item>
  </v-carousel>
</template>
<script>
export default {
  name: "CarouselProduct",
  data: () => ({
    cycle: true,
  }),

  props: {
    images: {
      Type: Array,
      default: [],
      required: true,
    },
  },
};
</script>



<style scoped>
.carousel-images {
  height: 300px;
  width: 100%;
  max-width: 300px;
  border-radius: 5px;
  object-fit: cover;
  border: 5px solid #feb425 ;
}


</style>