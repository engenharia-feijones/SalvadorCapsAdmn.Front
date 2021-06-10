<template>
  <v-container fluid>
    <v-card class="mx-auto" width="100%" max-width="1400px">
      <v-card-title class="mb-3" v-if="categoryName">
        <v-row justify="start" justify-md="start" align="baseline">
          <h4 class="ma-3">Detalhes da Categoria: {{ categoryName }}</h4>
          <v-btn fab small @click="openNewDetailModal()"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
          <v-spacer></v-spacer>
            <v-btn to="/Categoria" color="black" dark ><v-icon>mdi-arrow-left</v-icon>  Voltar Para Categorias</v-btn>
        </v-row>
      </v-card-title>
      
      <Tabela 
        :categoryDetails="categoryDetails"
        @open-edit-modal="openEditModal($event)"
        @open-delete-confirm-modal="openDeleteConfirmModal($event)"
      />
      

      <Loading v-if="loading" />

      <v-dialog v-model="modalDeleteCategoryDetail" max-width="400px">
        <DeleteModal
          categoria="Detalhe"
          @close-modal="closeDeleteConfirmModal()"
          @action="handleDeleteCategoryDetail()"
        />
      </v-dialog>

      <v-dialog v-model="dialogDeleteError" max-width="400px">
        <DeleteModalError
          @close-modal="closeDeleteErrorModal()"
          categoria="o Detalhe"
        />
      </v-dialog>

      <!-- START POST DETAIL -->
      <v-dialog v-model="newModal" v-if="newModal" max-width="400px">
        <FormularioDetail
          :categoryID="categoryId"
          @close-form="closeNewDetailModal()"
          @create-detail-data="handleCreateCategoryDetail($event)"
        />
      </v-dialog>
      <!-- END POST DETAIL -->

      <!-- START PUT DETAIL -->
      <v-dialog
        v-model="editCategoryDetailModal"
        v-if="editCategoryDetailModal"
        max-width="400px"
      >
        <FormularioDetail
          :categoryDetail="categoryDetail"
          :categoryID="categoryDetail.categoryID"
          @close-form="closeEditModal($event)"
          @update-detail-data="handleUpdateCategoryDetail($event)"
        />
      </v-dialog>
      <!-- END PUT DETAIL -->
    </v-card>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState, mapGetters } = createNamespacedHelpers(
  "categoryDetails"
);

import Tabela from '@/components/CategoriaDetail/Tabela'
import FormularioDetail from "@/components/CategoriaDetail/FormularioDetail";
import Loading from "@/components/Common/Loading";
import DeleteModal from "@/components/Common/DeleteModal";
import DeleteModalError from "@/components/Common/DeleteModalError";

export default {
  name: "CategoriaDetail",
  data: () => ({
   

    idDetailToDelete: null,
    categoryDetailTemp: null,

    newModal: false,
    loading: false,
    modalDeleteCategoryDetail: false,
    dialogDeleteError: false,
    editCategoryDetailModal: false,
    deleteModalError: false,
  }),

  computed: {
    ...mapState(["categoryDetails", "categoryDetail", "categoryId"]),
    ...mapGetters(["categoryName", "lastDetailId"]),
  },

  methods: {
    ...mapActions([
      "deleteCategoryDetail",
      "getCategoryDetails",
      "getCategoryDetailById",
      "createCategoryDetail",
      "createCategoryDetailImage",
      "updateCategoryDetail",
      "updateCategoryDetailImage"
    ]),

    async closeNewDetailModal(handleGetCategoryDetails) {
      this.newModal = false;
      handleGetCategoryDetails && (await handleGetCategoryDetails());
    },

    openNewDetailModal() {
      this.newModal = true;
    },

    async openEditModal({ id }) {
      await this.handleGetCategoryDetailById(id)
      this.editCategoryDetailModal = true;
      // this.categoryDetailTemp = categoryDetail;
    },

    async handleGetCategoryDetailById(id) {
      this.loading = true
      try {
        await this.getCategoryDetailById(id)
      } catch {
        //  Implement error on get 
      }

      this.loading = false
    },

    closeEditModal() {
      this.editCategoryDetailModal = false;
    },

    openDeleteConfirmModal({ id }) {
      this.modalDeleteCategoryDetail = true;
      this.idDetailToDelete = +id;
    },

    closeDeleteConfirmModal() {
      this.modalDeleteCategoryDetail = false;
    },

    openDeleteErrorModal() {
      this.modalDeleteCategoryDetail = false;
      this.dialogDeleteError = true;
    },

    closeDeleteErrorModal() {
      this.dialogDeleteError = false;
    },

    gambiarra() {
      document.location.reload(true);
    },

    async handleDeleteCategoryDetail() {
      try {
        await this.deleteCategoryDetail(this.idDetailToDelete);
        this.closeDeleteConfirmModal();
      } catch {
        this.openDeleteErrorModal();
      }

    },

    async handleGetCategoryDetails() {
      this.loading = true;
      const id = +this.$route.params.id;
      try {
        await this.getCategoryDetails(id);
      } catch {
        // Implementar redirect para as categorias.
      }

      this.loading = false;
    },

    async handleCreateCategoryDetail(body) {
      
      this.loading = true
      try {
        await this.createCategoryDetail(body);
        this.closeNewDetailModal()
      } catch {
        //
      }

      setTimeout(() => this.handleGetCategoryDetails(), 400)
    },

    async handleUpdateCategoryDetail(body) {
      try {
        this.loading = true
        this.closeEditModal()
        await this.updateCategoryDetail(body);
      } catch {
        // 
      }
      setTimeout(() => this.handleGetCategoryDetails(), 400)
    },

  },

  async created() {
    await this.handleGetCategoryDetails();
  },

  components: {
    Tabela,
    FormularioDetail,
    Loading,
    DeleteModal,
    DeleteModalError,
  },
};
</script>
