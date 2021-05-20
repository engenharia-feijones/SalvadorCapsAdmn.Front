<template>
  <v-form>
    <v-card>
      <v-card-title>
        <span class="headline">Nova Categoria</span>
      </v-card-title>
      <v-card-text v-if="editarCategoria">
        <v-row justify="space-between">
          <v-img
            height="5rem"
            width="5rem"
            :src="editarCategoria.desktopSpotlightImage"
          ></v-img>
          <v-img
            height="5rem"
            width="5rem"
            :src="editarCategoria.mobileSpotlightImage"
          ></v-img>
        </v-row>
      </v-card-text>
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
                    :src="categoriasNovas.desktopPreviewImage"
                  ></v-img>
                </v-col>
                <v-col cols="3">
                  <p>{{ categoriasNovas.desktopPreviewName }}</p>
                </v-col>
                <!-- <v-col cols="3">
                  <p>{{ categoriasNovas.desktopSize }}</p>
                </v-col> -->
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
                    :src="categoriasNovas.mobilePreviewImage"
                  ></v-img>
                </v-col>
                <v-col cols="3">
                  <p>{{ categoriasNovas.mobilePreviewName }}</p>
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
    // TODO: REFACT THESE VARIABLE
    categoriasNovas: {
      nome: "",
    },

    categoryID: 0,
  }),

  props: {
    editarCategoria: {
      type: Object,
    },
  },

  methods: {
    async previewImageDesktop(file) {
      const reader = new FileReader();

      this.categoriasNovas.desktopPreviewName = file.name;

      await reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.categoriasNovas.desktopBlob = reader.result
          ?.toString()
          .replace("data:", "")
          .replace(/^.+,/, "");
        this.categoriasNovas.desktopPreviewImage = `data:image/jpeg;charset=utf-8;base64,${this.categoriasNovas.desktopBlob}`;
      };
    },

    previewImageMobile(file) {
      const reader = new FileReader();
      this.categoriasNovas.mobilePreviewName = file.name;

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.categoriasNovas.mobileBlob = reader.result
          ?.toString()
          .replace("data:", "")
          .replace(/^.+,/, "");
        this.categoriasNovas.mobilePreviewImage = `data:image/jpeg;charset=utf-8;base64,${this.categoriasNovas.mobileBlob}`;
      };
    },

    removerPreview(imgType) {
      imgType === "Desktop"
        ? (this.imagePreviewDesktop = null)
        : (this.imagePreviewMobile = null);
    },

    async postCategoria() {
      await axios
        .post(`http://localhost:5000/api/Category`, {
          name: this.categoriasNovas.name,
        })
        .then(async () => {
          await this.getLastCategoryId();
          if (this.imagePreviewDesktop) {
            await this.postCategoryImage(
              this.categoriasNovas.desktopPreviewName,
              this.categoriasNovas.desktopBlob,
              1
            );
          }

          if (this.imagePreviewMobile) {
            await this.postCategoryImage(
              this.categoriasNovas.mobilePreviewName,
              this.categoriasNovas.mobileBlob,
              2
            );
          }
        });
      this.$emit("cadastro-feito");
      this.fecharModal();
    },

    async putCategoria() {
      await axios
        .put(`http://localhost:5000/api/Category/${this.categoriasNovas.id}`, {
          name: this.categoriasNovas.name,
        })
        .then(async () => {
          if (this.imagePreviewDesktop) {
            if (this.categoriasNovas.desktopSpotlightImageID) {
              await this.putCategoryImage(
                this.categoriasNovas.id,
                this.categoriasNovas.desktopSpotlightImageID,
                this.categoriasNovas.desktopPreviewName,
                this.categoriasNovas.desktopBlob,
                1
              );
            } else {
              this.categoryID = this.categoriasNovas.id;
              await this.postCategoryImage(
                this.categoriasNovas.desktopPreviewName,
                this.categoriasNovas.desktopBlob,
                1
              );
            }
          }

          if (this.imagePreviewMobile) {
            if (this.categoriasNovas.mobileSpotlightImageID) {
              await this.putCategoryImage(
                this.categoriasNovas.id,
                this.categoriasNovas.mobileSpotlightImageID,
                this.categoriasNovas.mobilePreviewName,
                this.categoriasNovas.mobileBlob,
                2
              );
            } else {
              this.categoryID = this.categoriasNovas.id;
              await this.postCategoryImage(
                this.categoriasNovas.mobilePreviewName,
                this.categoriasNovas.mobileBlob,
                2
              );
            }
          }
        });
      this.$emit("update-feito");
      this.fecharModal();
    },

    async getLastCategoryId() {
      await axios.get(`http://localhost:5000/api/Category`).then((response) => {
        this.categoryID = response.data[response.data.length - 1].id;
      });
    },

    async postCategoryImage(name, data, destination) {
      await axios.post(`http://localhost:5000/api/CategoryImage`, {
        categoryID: this.categoryID,
        blobFile: {
          name: name ?? " ",
          data: data ?? " ",
        },
        destination: destination,
      });
    },

    async putCategoryImage(categoryID, id, name, data, destination) {
      await axios
        .put(`http://localhost:5000/api/CategoryImage/${id}`, {
          categoryID: +categoryID,
          blobFile: {
            name: name ?? " ",
            data: data ?? " ",
          },
          destination: destination,
        })
        // .then(this.deleteCategoryImage(id));
    },

    async deleteCategoryImage(id) {
      await axios.delete(`http://localhost:5000/api/CategoryImage/${id}`);
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

  async created() {
    this.categoriasNovas = this.editarCategoria ?? {
      name: "",
      desktopSpotlight: "",
      desktopSpotlightImageID: "",
      desktopSpotlightImage: "",
      mobileSpotlight: "",
      mobileSpotlightImageID: "",
      mobileSpotlightImage: "",
      desktopPreviewName: "",
      desktopPreviewImage: "",
      mobilePreviewName: "",
      mobilePreviewImage: "",
    };

    if (this.editarCategoria) {
      this.categoriasNovas = {
        ...this.categoriasNovas,
        desktopPreviewName: "",
        desktopPreviewImage: "",
        mobilePreviewName: "",
        mobilePreviewImage: "",
      };
    }
  },
};
</script>
