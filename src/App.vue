<template>
  <v-app>
    <v-container>
      <v-row cols="12">
        <v-col cols="12" md="2" class="ma-0"
          ><v-btn block :to="{ name: 'Marca' }">1. Marca</v-btn></v-col
        >
        <v-col cols="12" md="2"
          ><v-btn block :to="{ name: 'Categoria' }">2. Categoria</v-btn></v-col
        >
        <v-col cols="12" md="2"><v-btn block :to="{ name: 'Produto' }">3. Produtos</v-btn></v-col>
      </v-row>
    </v-container>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
