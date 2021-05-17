<template>
  <div>
    <v-data-table :headers="cabecalho" :items="brands" sort-by="nome">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Marcas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="white" darkr v-bind="attrs" v-on="on"> NEW </v-btn>
            </template>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.mobileSpotlightImage`] ="{ item }">
        <v-img :src="item.mobileSpotlightImage" :alt="item.name"></v-img>
      </template>
        <template v-slot:[`item.desktopSpotlightImage`]="{ item }">
        <v-img :src="item.desktopSpotlightImage" :alt="item.name"></v-img>
      </template>
    </v-data-table>
    <Loading v-if="loading" />
  </div>
</template>
<script>
import axios from "axios";
import Loading from "@/components/Common/Loading";

export default {
  name: "Marca",

  data: () => ({
    dialog: false,
    loading: false,

    cabecalho: [
      { text: "Nome", align: "start", value: "name" },
      { text: "Imagem Desktop", align: "Start", value: "desktopSpotlightImage" },
      { text: "Imagem Mobile", align: "Start", value: "mobileSpotlightImage" },
    ],
    brands: [],
    brand: {
      name: "",
      desktopSpotlight: false,
      desktopSpotlightImageID: "",
      desktopSpotlightImage: "",
      mobileSpotlight: false,
      mobileSpotlightImageID: "",
      mobileSpotlightImage: "",
      promo: false,
    },
  }),

  methods: {
    previwerImageMob(file) {
      this.brand.desktopSpotlightImage = window.URL.createObjectURL(file);
      this.brand.desktopSpotlightImageID = file.name;
    },
    previwerimage(file) {
      this.brand.mobileSpotlightImage = window.URL.createObjectURL(file);
      this.brand.mobileSpotlightImageID = file.name;
    },

    async getBrands() {
      this.loading = true;
      await axios.get(`http://localhost:5000/api/Brand`).then((response) => {
        this.brands = response.data;
        this.loading = false;
        console.log(this.brands);
      });
    },
  },
  async created() {
    await this.getBrands();
  },

  components: {
    Loading,
  },
};
</script>


<style>
</style>