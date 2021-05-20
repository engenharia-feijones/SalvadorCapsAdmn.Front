<template>
  <v-data-table :headers="cabecalho" :items="brands" sort-by="nome">


       <template v-slot:[`item.desktopSpotlightImage`]="{item}">
            <v-img
                :src="item.desktopSpotlightImage"
                height="7rem"
                width="7rem"
                alt="Imagem não encontrada"
            >
            </v-img>
        </template>
        <template v-slot:[`item.mobileSpotlightImage`]="{item}">
                    <v-img
                        :src="item.mobileSpotlightImage"
                        height="7rem"
                        width="7rem"
                        alt="Imagem não encontrada"
                    >
                    </v-img>
        </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Marcas</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>


       



            <!-- formulario -->
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="white" darkr v-bind="attrs" v-on="on"> NEW </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Nova Marca</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row justify="center" align="center">
                  <v-col class="mb-0 pb-0" cols="12" sm="6" md="12">
                    <v-text-field
                      outlined
                      v-model="editedItem.nome"
                      label="Nome"
                    >
                    </v-text-field>
                  </v-col>

                  <v-col class="mb-0 ml-2">
                    <v-row align="center">
                      <v-checkbox value></v-checkbox>
                      <p class="mt-4">Promocional</p>
                    </v-row>
                  </v-col>

                  <!-- START UPLOAD IMG DESKTOP -->

                  <v-col cols="12" sm="6" md="12" lg="12">
                    <v-card style="background: #0b7ad1">
                      <v-btn small fab class="mb-2 mt-2 ml-2 txtBtn">
                        <v-file-input
                          accept="image/png, image/jpeg, image/bmp"
                          @change="previwerimage"
                          class="ml-2 mb-2"
                          prepend-icon="mdi-remote-desktop"
                          filled
                          hide-input
                        >
                        </v-file-input>
                      </v-btn>
                      <label style="color: white" class="ml-4"
                        >Imagem Desktop</label
                      >
                    </v-card>
                    <v-card height="auto" class="mt-3" elevation="1">
                      <v-row class="ml-4" justify="start">
                        <v-col cols="3">
                          <v-card elevation="0">
                            <v-img
                              class="mt-2"
                              max-height="70px"
                              max-width="70px"
                              :src="editedItem.imagemDesktop.previwer"
                            ></v-img>
                          </v-card>
                        </v-col>
                        <v-col align="start" cols="6">
                          <p
                            style="font-size: 10px"
                            v-if="editedItem.imagemDesktop.nome"
                          >
                            {{ editedItem.imagemDesktop.nome }}
                          </p>
                        </v-col>
                        <v-col class="btnX" align="end" cols="1">
                          <v-btn
                            @click="
                              (editedItem.imagemDesktop.previwer = ''),
                                (editedItem.imagemDesktop.nome = '')
                            "
                            v-if="editedItem.imagemDesktop.previwer"
                            text
                            fab
                            small
                          >
                            <v-icon small>mdi-delete</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>

                  <!-- END UPLOAD IMG DESKTOP -->

                  <!-- STARTP UPLOAD IMG MOBILE -->

                  <v-col cols="12" sm="6" md="12" lg="12">
                    <v-card style="background: #0b7ad1">
                      <v-btn small fab class="mb-2 mt-2 ml-2 txtBtn">
                        <v-file-input
                          accept="image/png, image/jpeg, image/bmp"
                          @change="previwerImageMob"
                          class="ml-2 mb-2"
                          prepend-icon="mdi-cellphone"
                          filled
                          hide-input
                        >
                        </v-file-input>
                      </v-btn>
                      <label style="color: white" class="ml-4"
                        >Imagem Mobile</label
                      >
                    </v-card>
                    <v-card class="mt-3">
                      <v-row class="ml-4" justify="start">
                        <v-col cols="3">
                          <v-card elevation="0">
                            <v-img
                              class="mt-2"
                              max-height="70"
                              max-width="70"
                              :src="editedItem.imagemMobile.previwer"
                            ></v-img>
                          </v-card>
                        </v-col>
                        <v-col align="start" cols="6">
                          <p
                            class="mt-2"
                            style="font-size: 10px; width: 100px"
                            v-if="editedItem.imagemMobile.nome"
                          >
                            {{ editedItem.imagemMobile.nome }}
                          </p>
                        </v-col>
                        <v-col class="btnX" align="end" cols="1">
                          <v-btn
                            @click="
                              (editedItem.imagemMobile.previwer = ''),
                                (editedItem.imagemMobile.nome = '')
                            "
                            v-if="editedItem.imagemMobile.previwer"
                            text
                            fab
                            small
                          >
                            <v-icon small>mdi-delete</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>

                  <!-- END UPLOAD IMG MOBILE -->

                  <v-col class="mt-6">
                    <v-row justify="end">
                      <v-btn small text @click="postBrand(),getBrand(),dialog = false" >
                        <v-icon color="primary" small> mdi-check </v-icon>
                        <a class="ml-1">Save</a>
                      </v-btn>
                      <v-btn
                        small
                        text
                        @click="
                          (editedItem.imagemDesktop.previwer = ''),
                            (editedItem.imagemDesktop.nome = ''),
                            (editedItem.imagemMobile.previwer = ''),
                            (editedItem.imagemMobile.nome = ''),
                            (editedItem.nome = ''),
                            (dialog = false)
                        "
                      >
                        <v-icon small color="error"> mdi-close </v-icon>
                        <a class="ml-1" style="color: Red">Cancel</a>
                      </v-btn>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
  </v-data-table>
</template>
<script>
import axios from "axios";

export default {
  name: "Marca",

 

  data: () => ({
    dialog: false,
    brandID: "",
    img64Mob: "",
    img64Desk: "",

    cabecalho: [
      { text: "Nome", align: "start", value: "name" },
      {
        text: "ImagemDesktop",
        align: "Start",
        value: "desktopSpotlightImage",
      },
      { text: "ImagemMobile", align: "Start", value: "mobileSpotlightImage" },
    ],
    brands: [
      {
        name: "",
        desktopSpotlight: false,
        desktopSpotlightImageID: " ",
        desktopSpotlightImage: " ",
        mobileSpotlight: false,
        mobileSpotlightImageID: " ",
        mobileSpotlightImage: " ",
      },
    ],
    editedItem: {
      nome: "",
      imagemDesktop: {
        nome: "",
        url: "",
        previwer: "",
      },

      imagemMobile: {
        nome: "",
        url: "",
        previwer: "",
      },
    },
  }),

  created() {
    this.getBrand();
    
  },
  methods: {
    previwerImageMob(file) {
      const reader = new FileReader();

      this.editedItem.imagemMobile.nome = file.name;

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.editedItem.imagemMobile.url = reader.result
          ?.toString()
          .replace("data:", "")
          .replace(/^.+,/, "");
        this.editedItem.imagemMobile.previwer = `data:image/jpeg;charset=utf-8;base64,${this.editedItem.imagemMobile.url}`;
      };
    },
    gambiarra(){
        document.location.reload(true)
    },

    previwerimage(file) {
      const reader = new FileReader();

      this.editedItem.imagemDesktop.nome = file.name;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.editedItem.imagemDesktop.url = reader.result
          ?.toString()
          .replace("data:", "")
          .replace(/^.+,/, "");
        this.editedItem.imagemDesktop.previwer = `data:image/jpeg;charset=utf-8;base64,${this.editedItem.imagemDesktop.url}`;
      };
    },

    async getLastBrandID() {
      await axios.get(`http://localhost:63633/api/Brand`).then((response) => {
        this.brandID = response.data[response.data.length - 1].id;
      });
    },
    async getBrand() {
      await axios.get(`http://localhost:63633/api/Brand`).then((response) => {
        this.brands = response.data;
      });
    },
    

    async postBrand() {
        console.log(this.editedItem.imagemMobile.url)
      await axios
        .post(`http://localhost:63633/api/Brand`, {
          name: this.editedItem.nome,
        })
        .then(async () => {
          await this.getLastBrandID();
          if (this.editedItem.imagemMobile.url){

              await axios.post(`http://localhost:63633/api/BrandImage`, {
                brandID: this.brandID,
                blobFile: {
                  name: this.editedItem.imagemMobile.nome,
                  data: this.editedItem.imagemMobile.url,
                },
                destination: 2,
              });
          }
          if(this.editedItem.imagemDesktop.url) {
                await axios.post(`http://localhost:63633/api/BrandImage`, {
                brandID: this.brandID,
                blobFile: {
                  name: this.editedItem.imagemDesktop.nome,
                  data: this.editedItem.imagemDesktop.url,
                },
                destination: 1,
              });
          }
        });
      console.log(this.brandID);
    },
  },
};
</script>


<style>
</style>