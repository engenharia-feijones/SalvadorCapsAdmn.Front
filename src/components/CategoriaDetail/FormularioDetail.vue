<template>
  <v-form>
    <v-card>
      <v-card-title>
        <span class="headline">Novo Detalhe</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-img
              :src="categoryDetail.titleIcon"
              v-if="categoryDetail"
            ></v-img>
            <v-col cols="12">
              <v-text-field
                v-model.trim="newCategoryDetail.name"
                prepend-icon="mdi-plus"
                label="Nome"
              ></v-text-field>
            </v-col>

            <!-- START UPLOAD MOBILE -->
            <v-col cols="12" >
              <v-file-input
                v-model="iconPreview"
                @change="readBase64Icon"
                prepend-icon="mdi-cellphone"
                label="Icone"
              >
              </v-file-input>
              <v-row
                justify="center"
                align="center"
                v-if="iconPreview"
              >
                <v-col cols="3">
                  <v-img
                    width="3rem"
                    height="50px"
                    :src="base64Icon.image"
                  ></v-img>
                </v-col>

                <v-col cols="2">
                  <v-btn color="red"
                  dark
                  height="2rem"
                  width="2rem"
                  small @click="removePreview()">X</v-btn>
                </v-col>
              </v-row>
            </v-col>
            <!-- END UPLOAD MOBILE -->
          </v-row>
          <!-- START ACTIONS -->
          <v-card-actions class="mt-5">
            <v-row justify="end">
              <v-btn text color="blue" @click="closeForm()"
                ><v-icon>mdi-close</v-icon>Cancelar</v-btn
              >
              <v-btn
                text
                color="blue"
                :disabled="desativarBtn"
                @click="handleUpdateCategoryDetail()"
                v-if="categoryDetail"
                ><v-icon>mdi-check</v-icon>Editar</v-btn
              >
              <v-btn
                text
                color="blue"
                :disabled="desativarBtn"
                @click="handleCreateCategoryDetail()"
                v-else
                ><v-icon>mdi-check</v-icon>Salvar</v-btn
              >
            </v-row>
          </v-card-actions>
        </v-container>
      </v-card-text>
    </v-card>
    <Loading v-if="loadingModal" title="Atualizando Dados" />
  </v-form>
</template>
<script>
import Loading from "@/components/Common/Loading";

export default {
  name: "Formulario-Detail",
  data: () => ({
    newCategoryDetail: {
      name: "",
      titleIconID: "",
      titleIcon: "",
    },

    base64Icon: {
      name: null,
      data: null,
      image: null,
    },

    desativarBtn: true,
    iconPreview: null,
    loadingModal: false,
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
    readBase64Icon(file) {
      if (!file) return;
      const reader = new FileReader();

      this.base64Icon.name = file.name;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.base64Icon.data = reader.result
          ?.toString()
          .replace("data:", "")
          .replace(/^.+,/, "");
        this.base64Icon.image = reader.result;
      };
    },

    removePreview() {
      this.iconPreview = null;
      this.base64Icon = {
        name: null,
        data: null,
        image: null,
      };
    },

    closeForm() {
      this.$emit("close-form", { reload: false });
    },

    async handleCreateCategoryDetail() {
      this.$emit("create-detail-data", {
        ...this.newCategoryDetail,
        categoryID: +this.categoryID,
        blobIcon: this.base64Icon,
      });
    },

    async handleUpdateCategoryDetail() {
      this.$emit("update-detail-data", {
        ...this.newCategoryDetail,
        categoryID: +this.categoryID,
        blobIcon: this.base64Icon,
      });
    },
  },

  watch: {
    "newCategoryDetail.name"() {
      this.newCategoryDetail.name
        ? (this.desativarBtn = false)
        : (this.desativarBtn = true);
    },
  },

  components: {
    Loading,
  },

  async created() {
    this.newCategoryDetail = { ...this.categoryDetail } ?? {
      name: null,
      titleIconID: "",
      titleIcon: "",
    };
  },
};
</script>
