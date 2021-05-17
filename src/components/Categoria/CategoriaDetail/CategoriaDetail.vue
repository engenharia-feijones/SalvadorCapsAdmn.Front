<template>
  <v-card class="mx-auto" max-width="1400px">
    <v-card-title class="mb-3">
      <v-row justify="start" justify-md="start" align="baseline">
        <h2 class="ma-3">Detalhes: {{ category.name }}</h2>
        <v-btn fab small @click="newModal = !newModal" v-if="category.id"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
      </v-row>
    </v-card-title>
    <v-expansion-panels>
      <v-expansion-panel v-for="(detail, index) in detail" :key="index">
        <v-expansion-panel-header>{{ detail.name }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-col cols="12">
            <p>Icone: {{ detail.titleIcon }}</p>
          </v-col>

          <v-row justify="space-around" justify-md="center">
            <v-btn x-small text @click="putCategoryDetail(detail)"
              ><v-icon>mdi-pencil</v-icon>Editar</v-btn
            >
            <v-btn x-small text @click="confirmarDeleteCategoryDetail(detail)"
              ><v-icon>mdi-delete</v-icon>Deletar</v-btn
            >
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- START DELETE MODAL -->
    <v-dialog v-model="dialogDeletarDetailCategory" max-width="400px">
      <v-card height="150px">
        <v-card-title>Deletar Detalhe</v-card-title>
        <v-card-text
          >Não sera possivel recuperar os dados ja cadastrados apos deletar
          esses detalhes
          <v-card-actions>
            <v-row justify="end" justify-md="start">
              <v-btn
                text
                color="blue"
                @click="
                  dialogDeletarDetailCategory = !dialogDeletarDetailCategory
                "
                >Cancelar</v-btn
              >
              <v-btn text color="red" @click="deleteCategoryDetail()"
                >Deletar</v-btn
              >
            </v-row>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- END DELETE MODAL -->

    <!-- START POST DETAIL -->
    <v-dialog v-model="newModal" v-if="newModal" max-width="400px">
      <FormularioDetail
        :categoryID="category.id"
        @fechar-formulario="fecharModal()"
      />
    </v-dialog>
    <!-- END POST DETAIL -->

    <!-- START PUT DETAIL -->
       <v-dialog v-model='editarCategoryDetailModal'  v-if="editarCategoryDetailModal" max-width="400px">
      <FormularioDetail :categoryDetail="categoryDetailTemp"  :categoryID="categoryDetailTemp.categoryID"
        @fechar-formulario="fecharModalEdit()"
       />
    </v-dialog>
    <!-- END PUT DETAIL -->
  </v-card>
</template>

<script>
import axios from "axios";
import FormularioDetail from "./FormularioDetail";

export default {
  name: "CategoriaDetail",
  data: () => ({
    cabecalho: [
      { text: "Nome", align: "Start", value: "name" },
      { text: "Icone", align: "Start", value: "titleIcon" },
      { text: "", align: "center", value: "acoes" },
    ],
    detail: [],
    detailTemp: {},
    categoryDetailTemp: null,

    newModal: false,
    dialogDeletarDetailCategory: false,
    editarCategoryDetailModal: false,
  }),

  props: {
    categoryDetails: {
      Type: [Array],
    },

    category: {
      Type: Object,
    },
  },

  methods: {
    fecharModal() {
      this.newModal = false;
      this.$emit("atualizar-category-detail", { id: this.category.id });
    },

    fecharModalEdit() {
      this.editarCategoryDetailModal = false;
      this.$emit("atualizar-category-detail", { id: this.category.id });
    },

    async confirmarDeleteCategoryDetail(categoryDetail) {
      this.dialogDeletarDetailCategory = !this.dialogDeletarDetailCategory;
      this.detailTemp = categoryDetail;
    },

    async deleteCategoryDetail() {
      await axios.delete(
        `http://localhost:5000/api/CategoryDetail/${this.detailTemp.id}`
      );
      this.$emit("deletar-category-detail", { id: this.detailTemp.categoryID });
      this.dialogDeletarDetailCategory = !this.dialogDeletarDetailCategory;
    },

    async putCategoryDetail(categoryDetail) {
      this.editarCategoryDetailModal = !this.editarCategoryDetailModal;
      this.categoryDetailTemp = categoryDetail;
    },
  },

  computed: {
    detailName() {
      return this.category.name ?? ""
    }
  },

  watch: {
    categoryDetails() {
      this.detail = this.categoryDetails;
    },
  },

  components: {
    FormularioDetail,
  },
};
</script>