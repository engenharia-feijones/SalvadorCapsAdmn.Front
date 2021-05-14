<template>
  <v-container>
    <v-data-table :headers="cabecalho" :items="detail" sort-by="nome">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title
            >Detalhes da Categoria: {{ category.name }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            light
            v-if="category.id"
            @click="newModal = !newModal"
          >
            NEW
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`item.acoes`]="{ item }">
        <v-icon small class="mr-2" @click="putCategoryDetail(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="confirmarDeleteCategoryDetail(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="newModal" v-if="newModal" max-width="400px">
      <FormularioDetail
        :categoryID="category.id"
        @fechar-formulario="fecharModal()"
      />
    </v-dialog>

    <!-- START DIALOG DELETE -->
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
    <!-- END DIALOG DELETE -->
    <v-dialog v-model='editarCategoryDetailModal'  v-if="editarCategoryDetailModal" max-width="400px">
      <FormularioDetail :categoryDetail="categoryDetailTemp"  :categoryID="categoryDetailTemp.categoryID"
        @fechar-formulario="fecharModalEdit()"
       />
    </v-dialog>
  </v-container>
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
        this.categoryDetailTemp = categoryDetail
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