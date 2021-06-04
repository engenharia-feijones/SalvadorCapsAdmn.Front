<template>
  <v-container fluid>
    <v-card class="mx-auto" width="100%" max-width="1400px">
      <v-card-title class="mb-3">
        <v-row justify="start" justify-md="start" align="baseline">
          <h2 class="ma-3">Marcas</h2>
          <v-btn fab small @click="openNewBrandModal()"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-row>
      </v-card-title>
      
      <Tabela 
        :brands="brands"
        @open-edit-brand-modal="openEditBrandModal($event)"
        @open-confirm-delete-modal="openDeleteModal($event)"
      />

      <v-dialog v-model="newBradModal" v-if="newBradModal" max-width="400px">
        <FormularioMarca
          @close-modal="closeModal()"
          @create-brand-data="handleCreateBrand($event)"
        />
      </v-dialog>

      <v-dialog
        v-model="editBrandModal"
        v-if="editBrandModal"
        max-width="400px"
      >
        <FormularioMarca
          @close-modal="closeEditBrandModal()"
          @update-brand-data="handleUpdateBrand($event)"
          :editBrand="brand"
        />
      </v-dialog>

      <v-dialog v-model="deleteModal" max-width="500px">
        <DeleteModal
          @action="handleDeleteBrand()"
          @close-modal="closeDeleteModal()"
        />
      </v-dialog>

      <v-dialog
        v-if="deleteErrorModal"
        v-model="deleteErrorModal"
        max-width="500px"
      >
        <DeleteModalError @close-modal="closeDeleteErrorModal()" />
      </v-dialog>
      <Loading v-if="loading" />
    </v-card>
  </v-container>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("brands");

import Tabela from "@/components/Marca/Tabela"
import DeleteModal from "@/components/Common/DeleteModal";
import DeleteModalError from "@/components/Common/DeleteModalError";
import FormularioMarca from "@/components/Marca/FormularioMarca";
import Loading from "@/components/Common/Loading";

export default {
  name: "Marca",

  data: () => ({
    newBradModal: false,
    editBrandModal: false,
    deleteModal: false,
    deleteErrorModal: false,
    loading: false,
    brandToEdit: {},

    brandIdDelete: null,
  }),
  methods: {
    ...mapActions([
      "getBrands",
      "getBrand",
      "deleteBrand",
      "createBrand",
      "updateBrand",
    ]),


    closeModal() {
      this.newBradModal = false;
    },

    openDeleteModal({ id }) {
      this.brandIdDelete = id;
      this.deleteModal = true;
    },

    closeDeleteModal() {
      this.deleteModal = false;
    },

    openDeleteErrorModal() {
      this.closeDeleteModal();
      this.deleteErrorModal = true;
    },

    closeDeleteErrorModal() {
      this.deleteErrorModal = false;
    },

    async handleGetBrands() {
      (this.loading = true), await this.getBrands();
      this.loading = false;
    },

    async handleDeleteBrand() {
      try {
        await this.deleteBrand(this.brandIdDelete);
        this.closeDeleteModal();
        this.handleGetBrands();
      } catch {
        this.deleteErrorModal = true;
        this.openDeleteErrorModal();
      }
    },

    openNewBrandModal() {
      this.newBradModal = true;
    },

    closeNewBrandModal() {
      this.newBradModal = false;
    },

    async handleCreateBrand(body) {
      try {
        await this.createBrand(body);
      } catch {
        //
      }
      this.closeNewBrandModal();
      this.loading = true;
      setTimeout(async () => {
        await this.handleGetBrands();
      }, 500);
    },

    async openEditBrandModal({ id }) {
      this.loading = true;
      try {
        await this.getBrand(id);
        this.editBrandModal = true;
      } catch {
        // console.log("a")
      }

      this.loading = false;
    },

    closeEditBrandModal() {
      this.editBrandModal = false;
    },

    async handleUpdateBrand(body) {
      this.loading = true;
      try {
        await this.updateBrand(body);
        this.closeEditBrandModal();
      } catch {
        //
      }

      setTimeout(() => this.handleGetBrands(), 300);
    },
  },

  computed: {
    ...mapState(["brands", "brand"]),
  },
  async created() {
    await this.handleGetBrands();
  },

  components: {
    Tabela,
    DeleteModal,
    Loading,
    DeleteModalError,
    FormularioMarca,
  },
};
</script>
<style>
</style>