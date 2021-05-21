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
          
          <v-row justify="center" align="center">
            <v-col class="mb-0 pb-0" cols="12" md="12">
              <v-text-field
                outlined
                v-model="brand.name"
                :rules="nameRules"
                label="Nome"
              >
              </v-text-field>
            </v-col>
      
            <!-- <v-col class="mb-0 ml-2">|
              <v-row align="center">
                <v-checkbox value></v-checkbox>
                <p class="mt-4">Promocional</p>
              </v-row>
            </v-col> -->
          </v-row>

          <v-col cols="12" md="12">
            <v-btn small fab class=" ml-1 txtBtn">
              <v-file-input
                accept="image/png, image/jpeg, image/bmp"
                @change="readBase64Desktop"
                v-model="fileDesktop"
                class=" mb-2 ml-1"
                prepend-icon="mdi-remote-desktop"
                filled
                hide-input
              >
              </v-file-input>
            </v-btn>
            <label class="ml-4">Imagem Desktop</label>
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
                <v-col cols="3">
                  <p>{{ base64Desktop.name }}</p>
                </v-col>
                <v-col cols="2">
                  <v-btn x-small @click="removerPreview('Desktop')">X</v-btn>
                </v-col>
              </v-row> 
            <!-- </v-card> -->
          </v-col>
          <v-col cols="12" md="12">
            <v-btn small fab class="txtBtn">
              <v-file-input
                @change="readBase64Mobile"
                class="ml-2 mb-2"
                prepend-icon="mdi-cellphone"
                filled
                hide-input
                v-model="fileMobile"
              >
              </v-file-input>
            </v-btn>
            <label class="ml-4">Imagem Mobile</label>
             <v-row
              v-if="fileMobile"
              justify="center"
              align="center"
              align-md="baseline"
              class="mt-3 elevation-2"
            >
              <v-col cols="3">
                <v-img
                  width="3rem"
                  height="50px"
                  :src="base64Mobile.preview"
                ></v-img>
              </v-col>
              <v-col cols="3">
                <p>{{ base64Mobile.name }}</p>
              </v-col>
              <v-col cols="2">
                <v-btn x-small @click="removerPreview('Mobile')">X</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-container>
        <v-card-actions >
        <v-row justify="end" >
          <v-btn text color="blue" @click.prevent="closeModal()"
            ><v-icon>mdi-close</v-icon>Cancelar</v-btn
          >
          <v-btn text color="blue" v-show="!editBrand" @click="validateForm()"
            ><v-icon>mdi-check</v-icon>Salvar</v-btn
          >
          <v-btn text color="blue" @click.prevent="validateForm()" v-show="editBrand"
            ><v-icon>mdi-check</v-icon>Editar</v-btn
          >
        </v-row>
      </v-card-actions>
      </v-card-text>
       
    </v-card>
  </v-form>
</template>

<script>
import axios from "axios";
export default {
  name: "BrandForm",

  data: () => ({
    brand: {
      name: "",
      promo: false,
    },

    base64Mobile: {
      name: "",
      data: "",
      preview: "",
    },
    base64Desktop: {
      name: "",
      data: "",
      preview: "",
    },

    nameRules: [(v) => !!v || "Insira o nome da cateogria"],

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
      } else {
        this.fileMobile = null;
      }
    },

    async validateForm() {
      if (this.$refs.form.validate()) {
        if (this.editBrand) {
          await this.putBrand();
        } else {
          await this.postBrand();
        }
      }
    },

    async postBrand() {
      await axios
        .post(`https://salvadorcapsapi.azurewebsites.net/api/Brand`, {
          name: this.brand.name,
        })
        .then(async () => {
          await this.getLastBrandID();
          if (this.fileMobile) {
            await this.postBrandImage(
              this.base64Mobile.name,
              this.base64Mobile.data,
              2
            );
          }

          if (this.fileDesktop) {
            await this.postBrandImage(
              this.base64Desktop.name,
              this.base64Desktop.data,
              1
            );
          }
        });

      this.closeModal();
    },

    async putBrand() {
      await axios
        .put(`https://salvadorcapsapi.azurewebsites.net/api/Brand/${this.brand.id}`, {
          name: this.brand.name,
        })
        .then(async () => {
          if (this.fileDesktop) {
            if (this.brand.desktopSpotlightImageID) {
              await this.putBrandImage(
                this.brand.desktopSpotlightImageID,
                this.base64Desktop.name,
                this.base64Desktop.data,
                1
              );
            } else {
              this.lastBrandID = this.brand.id;
              await this.postBrandImage(
                this.base64Desktop.name,
                this.base64Desktop.data,
                1
              );
            }
          }

          if (this.fileMobile) {
            if (this.brand.mobileSpotlightImageID) {
              await this.putBrandImage(
                this.brand.mobileSpotlightImageID,
                this.base64Mobile.name,
                this.base64Mobile.data,
                2
              );
            } else {
              this.lastBrandID = this.brand.id;
              await this.postBrandImage(
                this.base64Mobile.name,
                this.base64Mobile.data,
                2
              );
            }
          }
        });
      this.closeModal();
    },

    async getLastBrandID() {
      await axios.get(`https://salvadorcapsapi.azurewebsites.net/api/Brand`).then((response) => {
        this.lastBrandID = response.data[response.data.length - 1].id;
      });
    },

    async postBrandImage(name, data, destination) {
      await axios.post(`https://salvadorcapsapi.azurewebsites.net/api/BrandImage`, {
        brandID: this.lastBrandID,
        blobFile: {
          name: name,
          data: data,
        },
        destination: destination,
      });
    },

    async putBrandImage(id, name, data, destination) {
      await axios.put(`https://salvadorcapsapi.azurewebsites.net/api/BrandImage/${id}`, {
        brandID: this.brand.id,
        blobFile: {
          name: name,
          data: data,
        },
        destination: destination,
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