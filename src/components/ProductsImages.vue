<template>
  <div class="image-container">
    <div class="image-preview">
      <img
        class="image"
        :key="index"
        v-for="(image, index) in images"
        :src="image"
        alt=""
        @click="changeImageOnScreen(index)"
      />
    </div>
    <div class="current-image">
      <img class="image-on-screen" :src="currentImage" />
    </div>
  </div>
</template>
<script>
export default {
  name: "ProductImagesDesktop",
  props: {
    images: {
      Type: Array,
      required: true,
    },
  },

  data: () => ({
    currentImage: null,
  }),

  methods: {
    changeImageOnScreen(index) {
      this.currentImage = this.images[index];
    },
  },

  watch: {
    images() {
      this.currentImage = this.images[0];
    },
  },

  created() {
    this.currentImage = this.images[0];
  },
};
</script>
<style scoped>
.image-container {
  display: flex;
  
}

.image-preview {
  display: flex;
  flex-direction: column;
  margin: 0.6em;
}

.image:hover {
  transform: scaleX(1.1);
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  cursor: pointer;
}

.image {
  margin: 0.3em;
  width: 4em;
  height: 4em;
  transition: all 0.4s;
}

.image-on-screen {
  width: 100%;
  max-width: 400px;
  border: 5px solid #feb425 ;
  object-fit: fill;
  height: 400px;
}
</style>