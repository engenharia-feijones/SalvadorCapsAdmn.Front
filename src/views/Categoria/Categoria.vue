<template>
  <v-container fluid>
    <v-card width="100%" max-width="1400px" class="mx-auto">
      <v-card-title class="mb-3">
        <v-row justify="space-around" justify-md="start" align="baseline">
          <h2 class="ma-3">Categorias</h2>
          <v-btn fab small @click="openNewCategoryModal()"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-row>
      </v-card-title>

      <Tabela
        @open-edit-category-modal="openEditCategoryModal($event)"
        @open-delete-confirm-modal="confirmarDeletarCategoria($event)"
        :categorys="categorys"
      />

      <!-- START POST CATEGORY -->
      <v-dialog
        v-model="modalNewCategory"
        v-if="modalNewCategory"
        max-width="400px"
      >
        <Formulario
          @fechar-formulario="closeNewCategoryModal()"
          @create-category-data="handleCreateCategory($event)"
        />
      </v-dialog>
      <!-- END POST CATEGORY -->

      <!-- START PUT CATEGORY -->
      <v-dialog v-model="editarModal" max-width="400px">
        <Formulario
          :editarCategoria="category"
          @update-category-data="handleUpdateCategory($event)"
          @fechar-formulario="closeEditCategoryModal()"
          v-if="editarModal"
        />
      </v-dialog>
      <!-- END PUT CATEGORY -->

      <v-dialog v-model="modalDeleteCategory" max-width="800px">
        <DeleteModal
          categoria="Detalhe"
          @close-modal="modalDeleteCategory = false"
          @action="handleDeleteCategory(categoryIdToDelete)"
        />
      </v-dialog>

      <v-dialog v-model="modalDeleteError" max-width="800px">
        <DeleteModalError
          categoria="a Categoria"
          @close-modal="modalDeleteError = false"
        />
      </v-dialog>

      <Loading v-if="loading" />
    </v-card>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState } = createNamespacedHelpers("categorys");

import Tabela from "@/components/Categoria/Tabela";
import Formulario from "@/components/Categoria/Formulario";
import Loading from "@/components/Common/Loading";
import DeleteModal from "@/components/Common/DeleteModal";
import DeleteModalError from "@/components/Common/DeleteModalError";

export default {
  name: "Categoria",

  data: () => ({
    modalNewCategory: false,
    modalDeleteCategory: false,
    modalDeleteError: false,
    editarModal: false,
    loading: true,

    filter: null,
    categoryIdToDelete: null,
  }),

  computed: {
    ...mapState(["categorys", "category"]),
  },

  methods: {
    ...mapActions([
      "deleteCategory",
      "getCategorys",
      "getCategory",
      "createCategory",
      "updateCategory",
    ]),

    openNewCategoryModal() {
      this.modalNewCategory = true;
    },

    closeNewCategoryModal() {
      this.modalNewCategory = false;
    },

    confirmarDeletarCategoria({ id }) {
      this.modalDeleteCategory = true;
      this.categoryIdToDelete = id;
    },

    async handleDeleteCategory() {
      try {
        await this.deleteCategory(this.categoryIdToDelete);
        this.modalDeleteCategory = false;
      } catch {
        this.modalDeleteCategory = false;
        this.modalDeleteError = true;
      }
    },

    async handleGetCategorys() {
      this.loading = true;
      await this.getCategorys();
      this.loading = false;
    },

    async handleCreateCategory(body) {
      this.loading = true;
      try {
        this.closeNewCategoryModal();
        await this.createCategory(body);
      } catch {
        //
      }

      setTimeout(() => this.handleGetCategorys(), 400);
    },

    async handleUpdateCategory(body) {
      this.loading = true;

      try {
        this.closeEditCategoryModal();
        await this.updateCategory(body);
      } catch {
        //
      }

      setTimeout(() => this.handleGetCategorys(), 400);
    },

    async openEditCategoryModal({ id }) {
      this.loading = true;
      try {
        await this.getCategory(id);
      } catch {
        //
      }

      this.loading = false;
      this.editarModal = true;
    },

    closeEditCategoryModal() {
      this.editarModal = false;
    },
  },

  async created() {
    await this.handleGetCategorys();
  },

  components: {
    Tabela,
    Formulario,
    Loading,
    DeleteModal,
    DeleteModalError,
  },
};
</script>
