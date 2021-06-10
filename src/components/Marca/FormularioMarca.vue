<template>
  <v-form lazy-validation ref="form">
    <v-card>
      <v-col cols="12" v-if="editBrand" align="center">
        <img :src="editBrand.desktopSpotlightImage" alt="#" width="50%" />
      </v-col>
      <v-col cols="12" align="center" v-if="editBrand">
        <img :src="editBrand.mobileSpotlightImage" alt="#" width="50%" />
      </v-col>

      <v-card-title>
        <span class="headline">Nova Marca</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row align="center">
            <v-col cols="12">
              <v-text-field
                v-model="brand.name"
                :rules="nameRules"
                prepend-icon="mdi-plus"
                label="Nome"
              >
              </v-text-field>
            </v-col>
            <v-checkbox
              class="ml-6"
              label="Promocional"
              v-model="brand.promo"
              value
            ></v-checkbox>
          </v-row>

          <v-col cols="12" md="12">
            <v-file-input
              accept="image/png, image/jpeg, image/bmp"
              @change="readBase64Desktop"
              v-model="fileDesktop"
              prepend-icon="mdi-remote-desktop"
              label="Imagem Desktop"
            >
            </v-file-input>

            <!-- <v-card > -->
            <v-row
              v-if="fileDesktop"
              justify="center"
              align="center"
              align-md="baseline"
              class="mt-3 elevation-0"
            >
              <v-col cols="3">
                <v-img
                  width="3rem"
                  height="50px"
                  :src="base64Desktop.preview"
                ></v-img>
              </v-col>
              <v-col cols="2">
                <v-btn
                  color="red"
                  dark
                  height="2rem"
                  width="2rem"
                  small
                  @click="removerPreview('Desktop')"
                  >X</v-btn
                >
              </v-col>
            </v-row>
            <!-- </v-card> -->
          </v-col>
          <v-col cols="12" md="12">
            <v-file-input
              @change="readBase64Mobile"
              prepend-icon="mdi-cellphone"
              label="Imagem Mobile"
              v-model="fileMobile"
            >
            </v-file-input>

            <v-row
              v-if="fileMobile"
              justify="center"
              align="center"
              align-md="baseline"
            >
              <v-col cols="3">
                <v-img
                  width="3rem"
                  height="50px"
                  :src="base64Mobile.preview"
                ></v-img>
              </v-col>
              <v-col cols="2">
                <v-btn
                  color="red"
                  dark
                  height="2rem"
                  width="2rem"
                  small
                  @click="removerPreview('Mobile')"
                  >X</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-container>
        <v-card-actions>
          <v-row justify="end">
            <v-btn text color="blue" @click.prevent="closeModal()"
              ><v-icon>mdi-close</v-icon>Cancelar</v-btn
            >
            <v-btn
              text
              color="blue"
              v-show="!editBrand"
              :disabled="disabledBtn"
              @click="validateForm()"
              ><v-icon>mdi-check</v-icon>Salvar</v-btn
            >
            <v-btn
              text
              color="blue"
              @click.prevent="validateForm()"
              :disabled="disabledBtn"
              v-show="editBrand"
              ><v-icon>mdi-check</v-icon>Editar</v-btn
            >
          </v-row>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script>
export default {
  name: "BrandForm",

  data: () => ({
    brand: {
      name: "",
      promo: "",
    },

    base64Mobile: {
      name: null,
      data: null,
      preview: null,
    },
    base64Desktop: {
      name: null,
      data: null,
      preview: null,
    },

    nameRules: [(v) => !!v || "Insira o nome da marca"],
    disabledBtn: false,
    fileDesktop: null,
    fileMobile: null,
  }),

  props: {
    editBrand: {
      type: Object,
    },
  },

  methods: {
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
        this.base64Mobile.preview = reader.result;
      };
    },

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
        this.base64Desktop.preview = reader.result;
      };
    },

    closeModal() {
      this.$emit("close-modal");
    },

    removerPreview(type) {
      if (type === "Desktop") {
        this.fileDesktop = null;
        this.base64Destop = {
          name: null,
          data: null,
          preview: null,
        };
      } else {
        (this.base64Mobile = {
          name: null,
          data: null,
          preview: null,
        }),
          (this.fileMobile = null);
      }
    },

    handleClicks() {
      if (this.disabledBtn) return;

      this.disabledBtn = true;
      setTimeout(() => (this.disabledBtn = false), 500);
    },

    async validateForm() {
      if (this.$refs.form.validate()) {
        if (this.editBrand) {
          this.handleClicks();
          this.handleUpdateBrand();
        } else {
          this.handleClicks();
          this.handleCreateBrand();
        }
      }
    },

    handleCreateBrand() {
      this.$emit("create-brand-data", {
        ...this.brand,
        blobDesktopSpotlightImage: this.base64Desktop,
        blobMobileSpotlightImage: this.base64Mobile,
      });
    },

    handleUpdateBrand() {
      this.$emit("update-brand-data", {
        ...this.brand,
        blobDesktopSpotlightImage: this.base64Desktop,
        blobMobileSpotlightImage: this.base64Mobile,
      });
    },
  },
  created() {
    this.brand = { ...this.editBrand } ?? {
      name: "",
    };

  },
};
</script>