<template>
  <v-container fluid>
    <v-card class="mx-auto" width="100%" max-width="1400px">
      <v-card-title>
        <v-col cols="12">
          <v-row justify="space-around" justify-md="start" align="baseline">
            <h2 class="ma-3">Produtos</h2>
            <v-btn fab small @click="openNewProductModal()"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </v-row>
        </v-col>
      </v-card-title>
      <Tabela
        :products="products"
        :categorysName="categorysName"
        :categorys="categorys"
        @get-products-by-category="handleGetProductsByCategoryId($event)"
        @get-products="handleGetProducts()"
        @open-delete-confirm-modal="openConfirmDeleteModal($event)"
        @handle-edit-product="handleEditProduct($event)"
      />     
    <!-- START POST PRODUCT -->
    <v-dialog v-model="newModal" v-if="newModal" max-width="400px">
      <ProdutosFormulario
        :brands="brands"
        :categorys="categorys"
        @close-modal="closeNewProductModal()"
        @create-product-data="handleCreateProduct($event)"
      />
    </v-dialog>
    <!-- END POST PRODUCT -->

    <!-- START PUT FORM  -->
    <v-dialog v-model="editModal" v-if="editModal" max-width="400px">
      <ProdutosFormulario
        :editProduct="product"
        :brands="brands"
        :categorys="categorys"
        @close-modal="closeEditProductModal()"
        @update-product-data="handleUpdateProduct($event)"
      />
    </v-dialog>
    <!-- END PUT FORM -->

    <v-dialog v-model="deleteModal" max-width="800px">
      <DeleteModal
        @close-modal="closeConfirmDeleteModal()"
        @action="handleDeleteProduct()"
        categoria="Produto"
      />
    </v-dialog>

    <v-dialog v-model="deleteErrorModal" max-width="800px">
      <DeleteModalError @close-modal="closeDeleteErrorModal()" />
    </v-dialog>

    <Loading v-if="loading" />
    </v-card>

  </v-container>
</template>

<script>
// import axios from "axios";

import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState, mapGetters } = createNamespacedHelpers(
  "products"
);
import Tabela from "@/components/Produtos/Tabela"
import ProdutosFormulario from "@/components/Produtos/ProdutosFormulario";
import Loading from "@/components/Common/Loading";
import DeleteModal from "@/components/Common/DeleteModal";
import DeleteModalError from "@/components/Common/DeleteModalError";

export default {
  name: "Produtos",
  data: () => ({
    newModal: false,
    show: false,
    deleteModal: false,
    deleteErrorModal: false,
    editModal: false,

    categorysName: [],
    productTemp: {},
    productIdToDelete: null,

    loading: true,
  }),

  methods: {
    ...mapActions([
      "getProducts",
      "getProductsByCategoryId",
      "getProductById",
      "deleteProduct",
      "createProduct",
      "updateProduct"
    ]),

    openConfirmDeleteModal({ id }) {
      this.deleteModal = true;
      this.productIdToDelete = +id;
    },

    closeConfirmDeleteModal() {
      this.deleteModal = false;
    },

    openDeleteErrorModal() {
      this.closeConfirmDeleteModal();
      this.deleteErrorModal = true;
    },

    closeDeleteErrorModal() {
      this.deleteErrorModal = false;
    },

    openNewProductModal() {
      this.newModal = true;
    },

    closeNewProductModal() {
      this.newModal = false;
    },

    openEditProductModal() {
      this.editModal = true;
    },

    closeEditProductModal() {
      this.editModal = false
    },

    cleanCategorysData() {
      this.categorysName = this.categorys.map(({ name }) => name);
    },

    async handleGetProducts() {
      this.loading = true;
      try {
        await this.getProducts();
        this.loading = false;
      } catch {
        //
      }
    },

    async handleGetProductsByCategoryId({ id }) {
        this.loading = true;
        try {
          await this.getProductsByCategoryId(id);
        } catch {
          //
        }
        this.loading = false;
      
    },

    async handleDeleteProduct() {
      try {
        await this.deleteProduct(this.productIdToDelete);
        this.closeConfirmDeleteModal();
      } catch {
        this.openDeleteErrorModal();
      }
    },

    async handleCreateProduct({ body }) {
      console.log(body)
      this.loading = true;
      try {
        await this.createProduct(body);
      } catch {
        //
      }
      setTimeout(async () => {
        await this.getProducts();
        this.loading = false
      }, 1000);
    },

    async handleEditProduct({ id }) {
      this.loading = true
      try {
        await this.getProductById(id)
      } catch {
        // 
      }
      this.openEditProductModal()
      this.$forceUpdate()
      this.loading = false
    },

    async handleUpdateProduct({ data }) {
      const { id, ...body } = data
      this.loading = true
      try {
        this.updateProduct({id, body})
      } catch {
        // 
      }

      setTimeout(() => {
        this.getProducts()
        this.loading = false
      }, 400)
    },

  },

  computed: {
    ...mapState(["products", "product"]),
    ...mapGetters(["categorys", "brands"]),
   
  },

  async created() {
    await this.handleGetProducts();
    this.cleanCategorysData();
  },

  components: {
    Tabela,
    ProdutosFormulario,
    Loading,
    DeleteModal,
    DeleteModalError,
  },
};
</script>

<style>
.input-code-search input::-webkit-outer-spin-button,
.input-code-search input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
