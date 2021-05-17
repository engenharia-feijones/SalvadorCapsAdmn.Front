<template>
  <v-form>
    <v-card>
      <v-card-title>
        <span class="headline">Nova Categoria</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="4" md="12">
              <v-text-field v-model="categoriasNovas.name" label="Nome">
              </v-text-field>
            </v-col>

            <!-- UPLOAD DESKTOP -->
            <v-col cols="12" sm="6" md="12" lg="12">
              <v-btn small fab class="txtBtn">
                <v-file-input
                  v-model="imagePreviewDesktop"
                  @change="previewImageDesktop"
                  class="ml-2 mb-2"
                  prepend-icon="mdi-remote-desktop"
                  filled
                  hide-input
                >
                </v-file-input>
              </v-btn>
              <label class="ml-4">Imagem Desktop</label>
              <v-row
                v-if="imagePreviewDesktop"
                justify="center"
                align="center"
                align-md="baseline"
                class="mt-3 elevation-2"
              >
                <v-col cols="3">
                  <v-img
                    width="3rem"
                    height="50px"
                    :src="categoriasNovas.desktopSpotlightImage"
                  ></v-img>
                </v-col>
                <v-col cols="3">
                  <p>{{ categoriasNovas.desktopSpotlightImageID }}</p>
                </v-col>
                <v-col cols="3">
                  <p>{{ categoriasNovas.desktopSize }}</p>
                </v-col>
                <v-col cols="2">
                  <v-btn x-small @click="removerPreview('Desktop')">X</v-btn>
                </v-col>
              </v-row>
            </v-col>
            <!-- END UPLOAD DESKTOP -->

            <!-- START UPLOAD MOBILE -->
            <v-col cols="12" sm="6" md="12" lg="12">
              <v-btn small fab class="txtBtn">
                <v-file-input
                  @change="previewImageMobile"
                  class="ml-2 mb-2"
                  prepend-icon="mdi-cellphone"
                  filled
                  hide-input
                  v-model="imagePreviewMobile"
                >
                </v-file-input>
              </v-btn>
              <label class="ml-4">Imagem Mobile</label>
              <v-row
                v-if="imagePreviewMobile"
                justify="center"
                align="center"
                align-md="baseline"
                class="mt-3 elevation-2"
              >
                <v-col cols="3">
                  <v-img
                    width="3rem"
                    height="50px"
                    :src="categoriasNovas.mobileSpotlightImage"
                  ></v-img>
                </v-col>
                <v-col cols="3">
                  <p>{{ categoriasNovas.mobileSpotlightImageID }}</p>
                </v-col>
                <v-col cols="3">
                  <p>{{ categoriasNovas.mobileSize }}</p>
                </v-col>
                <v-col cols="2">
                  <v-btn x-small @click="removerPreview('Mobile')">X</v-btn>
                </v-col>
              </v-row>
            </v-col>
            <!-- END UPLOAD MOBILE -->
          </v-row>
          <!-- START ACTIONS -->
          <v-card-actions class="mt-5">
            <v-row justify="end">
              <v-btn text color="blue" @click="fecharModal"
                ><v-icon>mdi-close</v-icon>Cancelar</v-btn
              >
              <v-btn
                text
                color="blue"
                @click="putCategoria"
                :disabled="desativarBtn"
                v-if="editarCategoria"
                ><v-icon>mdi-check</v-icon>Editar</v-btn
              >
              <v-btn
                text
                color="blue"
                @click="postCategoria"
                :disabled="desativarBtn"
                v-else
                ><v-icon>mdi-check</v-icon>Salvar</v-btn
              >
            </v-row>
          </v-card-actions>
          <!-- END ACTIONS -->
        </v-container>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script>
import axios from "axios";

export default {
  name: "Formulario",

  data: () => ({
    desativarBtn: true,

    imagePreviewDesktop: null,
    imagePreviewMobile: null,
    categoriasNovas: {
      nome: "",
      Desktop: {
        nome: "",
        url: "",
        tamanho: "",
      },

      Mobile: {
        nome: "",
        url: "",
        tamanho: "",
      },
    },
  }),

  props: {
    editarCategoria: {
      type: Object,
    },
  },

  methods: {
    previewImageDesktop(payload) {
      const file = payload;
      this.categoriasNovas.desktopSpotlightImage = window.URL.createObjectURL(
        file
      );
      this.categoriasNovas.desktopSize = Math.floor(+file.size / 1024) + "Kbs";
      this.categoriasNovas.desktopSpotlightImageID = file.name;
    },
    previewImageMobile(payload) {
      const file = payload;
      this.categoriasNovas.mobileSpotlightImageID = file.name;
      this.categoriasNovas.mobileSpotlightImage = window.URL.createObjectURL(
        file
      );
      this.categoriasNovas.mobileSize = Math.floor(+file.size / 1024) + "Kbs";
    },

    removerPreview(imgType) {
      imgType === "Desktop"
        ? (this.imagePreviewDesktop = null)
        : (this.imagePreviewMobile = null);
    },

    async postCategoria() {
      console.log(this.categoriasNovas);
      await axios.post(`http://localhost:5000/api/Category`, {
        name: this.categoriasNovas.name,
        desktopSpotlight: this.categoriasNovas.desktopSpotlight != "",
        desktopSpotlightImageID: this.categoriasNovas.desktopSpotlightImageID,
        desktopSpotlightImage: this.categoriasNovas.desktopSpotlightImage,
        mobileSpotlight: this.categoriasNovas.mobileSpotlight != "",
        mobileSpotlightImageID: this.categoriasNovas.mobileSpotlightImageID,
        mobileSpotlightImage: this.categoriasNovas.mobileSpotlightImage,
      });
      this.$emit("cadastro-feito");
      this.fecharModal();
    },

    async putCategoria() {
      await axios.put(`http://localhost:5000/api/Category/${this.categoriasNovas.id}`, {
        name: this.categoriasNovas.name,
        desktopSpotlight: this.categoriasNovas.desktopSpotlight != "",
        desktopSpotlightImageID: this.categoriasNovas.desktopSpotlightImageID,
        desktopSpotlightImage: this.categoriasNovas.desktopSpotlightImage,
        mobileSpotlight: this.categoriasNovas.mobileSpotlight != "",
        mobileSpotlightImageID: this.categoriasNovas.mobileSpotlightImageID,
        mobileSpotlightImage: this.categoriasNovas.mobileSpotlightImage,
      });
        this.$emit("cadastro-feito");
        this.fecharModal();
    },

    fecharModal() {
      this.categoriasNovas = {};

      this.imagePreviewDesktop = null;
      this.imagePreviewMobile = null;
      this.$emit("fechar-formulario");
    },
  },

  watch: {
    "categoriasNovas.name"() {
      this.categoriasNovas.name
        ? (this.desativarBtn = false)
        : (this.desativarBtn = true);
    },
  },

  created() {
    this.categoriasNovas = this.editarCategoria ?? {
      name: "",
      desktopSpotlight: "",
      desktopSpotlightImageID: "",
      desktopSpotlightImage: "",
      mobileSpotlight: "",
      mobileSpotlightImageID: "",
      mobileSpotlightImage: "",
    };
  },
};
</script>