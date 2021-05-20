<template>
  <v-form>
    <v-card>
      <v-card-title>
        <span class="headline">Novo Detalhe</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-img :src="categoryDetail.titleIcon" v-if="categoryDetail"></v-img>
            <v-col cols="12" sm="4" md="12">
              <v-text-field
                v-model="novaCategoriaDetail.name"
                label="Nome"
              ></v-text-field>
            </v-col>

            <!-- START UPLOAD MOBILE -->
            <v-col cols="12" sm="6" md="12" lg="12">
              <v-btn small fab class="txtBtn">
                <v-file-input
                  v-model="iconPreview"
                  @change="previewIcon"
                  class="ml-2 mb-2"
                  prepend-icon="mdi-cellphone"
                  filled
                  hide-input
                >
                </v-file-input>
              </v-btn>
              <label class="ml-4">Icone</label>
              <v-row
                justify="center"
                align="center"
                align-md="baseline"
                class="mt-3 elevation-2"
                v-if="iconPreview"
              >
                <v-col cols="3">
                  <v-img
                    width="3rem"
                    height="50px"
                    :src="icon.preview"
                  ></v-img>
                </v-col>
                <v-col cols="3">
                  <p>{{ icon.name }}</p>
                </v-col>
                <v-col cols="2">
                  <v-btn x-small @click="removerPreview()">X</v-btn>
                </v-col>
              </v-row>
            </v-col>
            <!-- END UPLOAD MOBILE -->
          </v-row>
          <!-- START ACTIONS -->
          <v-card-actions class="mt-5">
            <v-row justify="end">
              <v-btn
                text
                color="blue"
                @click="
                  fecharModal();
                "
                ><v-icon>mdi-close</v-icon>Cancelar</v-btn
              >
              <v-btn
                text
                color="blue"
                :disabled="desativarBtn"
                @click="putCategoryDetail()"
                v-if="categoryDetail"
                ><v-icon>mdi-check</v-icon>Editar</v-btn
              >
              <v-btn
                text
                color="blue"
                :disabled="desativarBtn"
                @click="postCategoryDetail()"
                v-else
                ><v-icon>mdi-check</v-icon>Salvar</v-btn
              >
            </v-row>
          </v-card-actions>
        </v-container>
      </v-card-text>
    </v-card>
  </v-form>
</template>
<script>
import axios from "axios";
export default {
  name: "Formulario-Detail",
  data: () => ({
    novaCategoriaDetail: {
      name: null,
      titleIconID: "",
      titleIcon: "",
    },
    icon: {
      name: "",
      blob: "",
      preview: "",
    },

    categoryDetailID: 0,

    desativarBtn: true,
    
    iconPreview: null,
  }),

  props: {
    categoryID: {
      type: Number,
      required: true,
    },

    categoryDetail: {
      Type: Object,
    },
  },

  methods: {
    previewIcon(file) {
      const reader = new FileReader()

      this.icon.name = file.name
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        this.icon.blob = reader.result?.toString().replace("data:", "").replace(/^.+,/, "");
        this.icon.preview = `data:image/jpeg;charset=utf-8;base64,${this.icon.blob}`;
      }
    },

    removerPreview() {
      this.iconPreview = null;
    },

    fecharModal() {
      this.$emit("fechar-formulario");
    },

    async postCategoryDetail() {
      await axios.post(`http://localhost:5000/api/CategoryDetail`, {
        categoryID: this.categoryID,
        name: this.novaCategoriaDetail.name,
      }).then(async () => {
       if (this.iconPreview) {
          await this.getLastCategoryDetailID()
          await this.postCategoryDetailIcon()
       }
      })
      this.fecharModal();
    },

    async postCategoryDetailIcon() {
      await axios.post(`http://localhost:5000/api/CategoryDetailImage`, {
        categoryDetailID: this.categoryDetailID, 
        blobFile: {
          name: this.icon.name,
          data: this.icon.blob
        }
      })
    },

    async putCategoryDetail() {
      console.log()
      await axios.put(
        `http://localhost:5000/api/CategoryDetail/${this.novaCategoriaDetail.id}`,
        {
          categoryID: this.categoryID,
          name: this.novaCategoriaDetail.name,
        }
      ).then(async () => {
        if (this.novaCategoriaDetail.titleIconID) {
          await this.putCategoryDetailIcon()
        } else {
          this.categoryDetailID = this.categoryDetail.id
          await this.postCategoryDetailIcon()
        }
      })
      this.fecharModal();
    },

    async putCategoryDetailIcon() {
      await axios.put(`http://localhost:5000/api/CategoryDetailImage/${this.novaCategoriaDetail.titleIconID}`, {
        categoryDetailID: +this.categoryDetail.id,
        blobFile: {
          name: this.icon.name,
          data: this.icon.blob
        }
      })
    },

    async getLastCategoryDetailID() {
      await axios.get(`http://localhost:5000/api/CategoryDetail`)
      .then((response) => this.categoryDetailID = response.data[response.data.length - 1]?.id)
    }
  },

  watch: {
    "novaCategoriaDetail.name"() {
      this.novaCategoriaDetail.name
        ? (this.desativarBtn = false)
        : (this.desativarBtn = true);
    },
  },

  async created() {
    this.novaCategoriaDetail = { ...this.categoryDetail } ?? {
      name: null,
      titleIconID: "",
      titleIcon: "",
    };

    await this.getLastCategoryDetailID()
  },
};
</script>