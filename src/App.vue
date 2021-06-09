<template>
  <!-- v-app: elemento da biblioteca vuetify ultilizada para iniciar uma aplicação. Deve ser chamada uma unica vez -->
  <v-app class="panel">
    <v-app-bar-title id="topbar">
      <div class="center">
        <router-link :to="{ name: 'Home' }">
          <img id="logo" src="./assets/Logo.png" />
        </router-link>
      </div>

      <icons-navbar />
    </v-app-bar-title>

    <v-card tile>
      <v-tabs dark show-arrows class="navbar">
        <v-row justify="center" justify-md="center" class="navbar-row">
          <div v-for="(item, index) in menuItems" :key="index">
            <v-tab
              class="navbar-bullet"
              v-if="showBullets(index)"
              disabled="disabled"
            >
              <v-icon>mdi-circle-medium</v-icon>
            </v-tab>
            <v-tab
              :to="{ name: 'Products', params: { brandName: item.name } }"
              class="items"
            >
              {{ item.name }}
            </v-tab>
          </div>
        </v-row>
      </v-tabs>
    </v-card>

    <v-main class="pad-footer">
      <router-view />
    </v-main>

    <v-footer app class="footer">
      <div><b>(71) 99208-9249</b></div>
      <div><b>Av. Octávio Mangabeira, 13, GVT</b></div>
      <div><b>Salvador-BA 411740-000 / Shopping Pituba Sol Flat</b></div>
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";
import IconsNavbar from "./components/IconsNavbar.vue";
export default {
  components: {
    IconsNavbar,
  },
  data() {
    return {
      menuItems: [],
    };
  },
  created() {
    this.getBrands();
  },
  methods: {
    async getBrands() {
      await axios
        .get(`https://salvadorcapsapi.azurewebsites.net/api/Brand`)
        .then((response) => {
          this.menuItems = response.data.filter((item) => item.promo == false);
        });
    },

    showBullets(index) {
      return index != 0;
    },
  },
};
</script>

<!-- scoped: Utilizado para aplicar estilo somente neste componente.  -->
<style scoped>
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#topbar {
  color: white;
  background: url("./assets/black.jpeg") no-repeat bottom center scroll;
  background-position: auto;
  background-size: cover;
}

.navbar .items {
  font-family: "Montserrat";
  font-size: 1.5em;
  padding: 0.9em 0;
  color: #dadada;
  font-weight: 900;
  min-width: 50px !important;
}

.navbar-bullet {
  font-size: 2em !important;
  float: left;
  padding: 0px !important;
  min-width: 30px;
  height: 100%;
}

/* First option to create a black row above navbar TODO: GET EDU AND PEDRO FEEDBACK */
/* .navbar {
  border-bottom: 1.5rem solid black;
} */

/*  SECOND OPTION */
.navbar::after {
  content: "";
  width: 100%;
  height: 1rem;
  background: url("./assets/black.jpeg") no-repeat bottom center scroll;
  background-position: center;
  background-size: cover;
  display: block;
}

.panel {
  background: url("./assets/white.jpeg") no-repeat fixed !important;
  background-size: 100% 100% !important;
  color: #2c3e50 !important;
}

.footer {
  width: 100%;
  font-size: 12px;
  text-align: center;
  position: fixed;
  bottom: 0;
  background: url("./assets/black.jpeg");
}
.footer > div {
  width: 100%;
  float: left;
  padding: 4px;
  color: #dadada;
  font-weight: 900;
}

#logo {
  margin-top: 10px;
  width: 10rem;
}

.center {
  display: flex;
  justify-content: center;
}
</style>


<style>
div[role="tablist"] {
  background-image: linear-gradient(to right, #ebb738, #815823);
  /* transform: translateY(-1.3em); */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5em 0;
  position: relative;
}
.v-app-bar-title__content {
  display: none !important;
}

.v-tabs-slider-wrapper {
  display: none !important;
}

.container-wrapper {
  width: calc(100% - 10vw);
  max-width: 1800px;
  margin: 0 auto;
}


.transparent {
  background-color: transparent !important;
  box-shadow: none !important;
}

.main {
  position: relative;
}

.center {
  display: flex;
  justify-content: center;
}

.pad-footer {
  padding-bottom: 100px !important;
}

@media screen and (min-width: 768px) {
  div[role="tablist"] {
    padding: 2em 0;
  }
}
</style>