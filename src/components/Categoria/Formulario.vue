<template>
  <v-form>
    <v-card>
      <v-card-title>
        <span class="headline">Nova Categoria</span>
      </v-card-title>
      <v-card-text v-if="editarCategoria">
        <v-col cols="12" align="center">
          <img
            :src="editarCategoria.desktopSpotlightImage"
            alt="#"
            width="50%"
          />
        </v-col>
        <v-col cols="12" align="center">
          <img
            :src="editarCategoria.mobileSpotlightImage"
            alt="#"
            width="50%"
          />
        </v-col>
      </v-card-text>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                v-model="categoriasNovas.name"
                label="Nome"
                prepend-icon="mdi-plus"
              >
              </v-text-field>
            </v-col>

            <!-- UPLOAD DESKTOP -->
            <v-col cols="12">
              <v-file-input
                v-model="imagePreviewDesktop"
                @change="readBase64Desktop"
                prepend-icon="mdi-remote-desktop"
                label="Imagem Desktop"
              >
              </v-file-input>
              <v-row
                v-if="imagePreviewDesktop"
                justify="center"
                align="center"
                align-md="baseline"
              >
                <v-col cols="3">
                  <v-img
                    width="3rem"
                    height="50px"
                    :src="base64Desktop.image"
                  ></v-img>
                </v-col>
                <v-col cols="2">
                  <v-btn
                    color="red"
                    dark
                    height="2rem"
                    width="2rem"
                    small
                    @click="removePreview('Desktop')"
                    >X</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
            <!-- END UPLOAD DESKTOP -->

            <!-- START UPLOAD MOBILE -->
            <v-col cols="12">
              <v-file-input
                @change="readBase64Mobile"
                prepend-icon="mdi-cellphone"
                v-model="imagePreviewMobile"
                label="Imagem Mobile"
              >
              </v-file-input>
              <v-row
                v-if="imagePreviewMobile"
                justify="center"
                align="center"
                align-md="baseline"
              >
                <v-col cols="3">
                  <v-img
                    width="3rem"
                    height="50px"
                    :src="base64Mobile.image"
                  ></v-img>
                </v-col>
               
                <v-col cols="2">
                  <v-btn color="red"
                  dark
                  height="2rem"
                  width="2rem"
                  small @click="removePreview('Mobile')">X</v-btn>
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
                @click="handleUpdateCategory"
                :disabled="disableBtn"
                v-if="editarCategoria"
                ><v-icon>mdi-check</v-icon>Editar</v-btn
              >
              <v-btn
                text
                color="blue"
                @click="handleCreateCategory"
                :disabled="disableBtn"
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
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("categorys");

export default {
  name: "Formulario",

  data: () => ({
    disableBtn: true,

    imagePreviewDesktop: null,
    imagePreviewMobile: null,

    base64Desktop: {
      name: null,
      data: null,
      image: null,
    },

    base64Mobile: {
      name: null,
      data: null,
      image: null,
    },

    categoriasNovas: {
      nome: "",
    },
  }),

  props: {
    editarCategoria: {
      type: Object,
    },
  },

  methods: {
    ...mapActions(["createCategory", "updateCategory"]),
    readBase64Desktop(file) {
      if (!file) return;
      const reader = new FileReader();

      this.base64Desktop.name = file.name;

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.base64Desktop.data = reader.result
          ?.toString()
          .replace("data:", "")
          .replace(/^.+,/, "");
        this.base64Desktop.image = reader.result;
      };
    },

    readBase64Mobile(file) {
      if (!file) return;
      const reader = new FileReader();
      this.base64Mobile.name = file.name;

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.base64Mobile.data = reader.result
          ?.toString()
          .replace("data:", "")
          .replace(/^.+,/, "");
        this.base64Mobile.image = reader.result;
      };
    },

    handleClicks() {
      if (this.disableBtn) return;

      this.disableBtn = true;
      setTimeout(() => (this.disableBtn = false), 600);
    },

    removePreview(imgType) {
      if (imgType === "Desktop") {
        this.imagePreviewDesktop = null;
        this.base64Desktop = {
          name: null,
          data: null,
          image: null,
        };
      } else {
        this.base64Mobile = {
          name: null,
          data: null,
          image: null,
        };
        this.imagePreviewMobile = null;
      }
    },

    async handleCreateCategory() {
      this.handleClicks();
      this.$emit("create-category-data", {
        ...this.categoriasNovas,
        blobDesktopSpotlightImage: this.base64Desktop,
        blobMobileSpotlightImage: this.base64Mobile,
      });
    },

    async handleUpdateCategory() {
      this.handleClicks();
      this.$emit("update-category-data", {
        ...this.categoriasNovas,
        blobDesktopSpotlightImage: this.base64Desktop,
        blobMobileSpotlightImage: this.base64Mobile,
      });
    },

    fecharModal() {
      this.$emit("fechar-formulario");
    },
  },

  watch: {
    "categoriasNovas.name"() {
      this.categoriasNovas.name
        ? (this.disableBtn = false)
        : (this.disableBtn = true);
    },
  },

  async created() {
    this.categoriasNovas = { ...this.editarCategoria } ?? {
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
