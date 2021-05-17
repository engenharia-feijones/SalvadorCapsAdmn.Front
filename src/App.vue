<template>
  <v-app>
    <v-app-bar
      app dense color="black"
      dark
    >
      <template v-slot:extension>
         <v-tabs align-with-title>
          <v-tab :to="{ name: 'Marca'}">Marca</v-tab>
          <v-tab :to="{ name: 'Categoria'}">Categoria</v-tab>
          <v-tab :to="{ name: 'Produto'}">Produto</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-container>
      <!-- <v-row cols="12">
        <v-col cols="12" md="2" class="ma-0"
          ><v-btn block :to="{ name: 'Marca' }">1. Marca</v-btn></v-col
        >
        <v-col cols="12" md="2"
          ><v-btn block :to="{ name: 'Categoria' }">2. Categoria</v-btn></v-col
        >
        <v-col cols="12" md="2"><v-btn block :to="{ name: 'Produto' }">3. Produtos</v-btn></v-col>
      </v-row> -->
      
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
