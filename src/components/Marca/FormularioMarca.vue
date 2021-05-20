<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="headline">Nova Marca</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row justify="center" align="center">
            <v-col class="mb-0 pb-0" cols="12" sm="6" md="12">
              <v-text-field outlined v-model="brand.name" label="Nome">
              </v-text-field>
            </v-col>

            <!-- <v-col class="mb-0 ml-2">
              <v-row align="center">
                <v-checkbox value></v-checkbox>
                <p class="mt-4">Promocional</p>
              </v-row>
            </v-col> -->
          </v-row>

        
            <v-col cols="12" sm="6" md="12" lg="12">
              <v-card style="background: #0b7ad1">
                <v-btn small fab class="mb-2 mt-2 ml-2 txtBtn">
                  <v-file-input
                    accept="image/png, image/jpeg, image/bmp"
                    @change="readBase64Desktop"
                    v-model="fileDesktop"
                    class="ml-2 mb-2"
                    prepend-icon="mdi-remote-desktop"
                    filled
                    hide-input
                  >
                  </v-file-input>
                </v-btn>
                <label style="color: white" class="ml-4">Imagem Desktop</label>
              </v-card>
              </v-col>
              <!-- <v-card height="auto" class="mt-3" elevation="1">
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
            </v-col> -->

<!--

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
                <label style="color: white" class="ml-4">Imagem Mobile</label>
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

      

            <v-col class="mt-6">
              <v-row justify="end">
                <v-btn
                  small
                  text
                  @click="postBrand(), getBrand(), (dialog = false)"
                >
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
          </v-row> -->
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "BrandForm",

  data: () => ({
    brand: {
      name: "",
      promo: false,
    },

    base64Mobile: {},
    base64Desktop: {},

    fileDesktop: null,
    fileMobile: null,
  }),

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
  },
};
</script>