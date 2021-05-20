<template>
  <v-app>
    <v-app-bar v-if="!isLogin"
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
  computed: {
    isLogin() {
      return this.$route.path == "/" ? true : false
    }
  }
 
};
</script>
