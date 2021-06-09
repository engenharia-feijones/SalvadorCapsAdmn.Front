<template>
  <div class="container-wrapper">
  <v-row class="center main">
    <v-col xl="2" lg="3" md="4" sm="5" cols="7" v-for="item in items" :key="item.id">
      <v-card class="transparent brand">
        <router-link :to="{ name:'Products', params: { brandName: item.name }}">
          <img class="brand-box" :src=item.desktopSpotlightImage />
        </router-link>
      </v-card>
    </v-col>
  </v-row>

  </div>
</template>
<script>

export default {
  // Definição das props do componente
  props: {
    items: {
      Required: true,
      type: [Object, Array]
    }
  },
  data: () => ({
    selection: '',
  })
}
</script>
<!-- scoped: a camada de estilo se aplica somente a este component -->
<style scoped>
.brand {
  margin: 12px;
  transform: skewX(17deg) !important;
  overflow: hidden;
}
.brand-box {
  width: 180%;
  transform: skewX(-17deg);
  margin: -8% -39% !important;
}
</style>
