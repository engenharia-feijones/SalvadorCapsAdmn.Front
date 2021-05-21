<template>
  <v-container fluid>
    <v-card class="mx-auto" width="100%" max-width="1400px">
      <v-card-title>
        <v-col cols="12">
          <v-row justify="space-around" justify-md="start" align="baseline">
            <h2 class="ma-3">Produtos</h2>
            <v-btn fab small @click="newModal = !newModal"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </v-row>
        </v-col>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4" md="4">
            <v-text-field
              prepend-icon="mdi-magnify"
              placeholder="Pesquisar Código..."
              v-model="searchCode"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4">
            <v-text-field
              prepend-icon="mdi-magnify"
              placeholder="Pesquisar Produto..."
              v-model="searchProduct"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4">
            <v-select
              :items="searchCategoryName"
              @change="getProductByCategory()"
              v-model="selectedSearchCategory"
              clearable
              prepend-icon="mdi-magnify"
              placeholder="Pesquisar Categoria..."
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <v-data-table
        :headers="headers"
        :items="filtredProduct"
        hide-default-footer
        no-data-text="Nenhum Produto Encontrado."
        mobile-breakpoint="0"
      >
        <template v-slot:[`item.image`]="{ item }">
          <v-img
            v-if="show"
            :src="item.image"
            height="7rem"
            width="7rem"
            alt="Imagem não encontrada"
            style="display: inline-block"
          ></v-img>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-row justify="center" class="py-1 mt-1">
            <v-btn small text @click="editProduct(item)"
              ><v-icon>mdi-pencil</v-icon> Editar</v-btn
            >
          </v-row>
          <v-row justify="center" class="py-1 mb-1">
            <v-btn small text @click="confirmDeleteProduct(item)"
              ><v-icon>mdi-delete</v-icon> Deletar</v-btn
            >
          </v-row>
        </template>
      </v-data-table>
    </v-card>

    <!-- START POST PRODUCT -->
    <v-dialog v-model="newModal" v-if="newModal" max-width="400px">
      <ProdutosFormulario @close-modal="closeModal()" />
    </v-dialog>
    <!-- END POST PRODUCT -->

    <!-- START PUT FORM  -->
    <v-dialog v-model="editModal" v-if="editModal" max-width="400px">
      <ProdutosFormulario
        :editProduct="productTemp"
        @close-modal="closeModal()"
      />
    </v-dialog>
    <!-- END PUT FORM -->

    <v-dialog v-model="deleteModal" max-width="800px">
      <DeleteModal
        @close-modal="deleteModal = false"
        @action="deleteProduct()"
        categoria="Produto"
      />
    </v-dialog>

    <v-dialog v-model="errorModal" max-width="800px">
      <DeleteModalError @close-modal="errorModal = false" />
    </v-dialog>

    <Loading v-if="loading" />
  </v-container>
</template>

<script>
import axios from "axios";
import ProdutosFormulario from "./ProdutosFormulario";
import Loading from "@/components/Common/Loading";
import DeleteModal from "@/components/Common/DeleteModal";
import DeleteModalError from "@/components/Common/DeleteModalError";

export default {
  name: "Produtos",
  data: () => ({
    newModal: false,
    show: false,
    deleteModal: false,
    errorModal: false,
    editModal: false,
    filterResults: false,
    loading: true,

    products: [],
    filtredProducts: [],
    filterCategory: [],
    searchCategory: [],
    searchCategoryName: [],
    selectedSearchCategory: "",

    headers: [
      { text: "Código", aling: "center", value: "code" },
      { text: "Produtos", align: "center", value: "name" },
      { text: "Imagem", align: "center", value: "image" },
      { text: "Ações", align: "center", value: "actions" },
    ],

    productTemp: {},

    searchCode: "",
    searchProduct: "",

    selectedFitlerCategory: null,
  }),

  methods: {
    confirmDeleteProduct(product) {
      this.deleteModal = true;
      this.productTemp = product;
    },

    async editProduct(temp) {
      await axios
        .get(`https://salvadorcapsapi.azurewebsites.net/api/Product/${temp.id}`)
        .then((response) => {
          this.productTemp = response.data;
          this.editModal = !this.editModal;
        });
    },

    async getProdutos() {
      this.loading = true;
      this.show = false;
      await axios
        .get(`https://salvadorcapsapi.azurewebsites.net/api/Product`)
        .then(async (response) => {
          this.products = await response.data;
          this.loading = false;
          this.show = true;
        });
    },

    async deleteProduct() {
      await axios
        .delete(`https://salvadorcapsapi.azurewebsites.net/api/Product/${this.productTemp.id}`)
        .then(() => {
          this.deleteModal = !this.deleteModal;
          this.filtredProducts = this.filtredProducts.filter(
            (product) => product.id !== this.productTemp.id
          );
          this.getProdutos();
        })
        .catch(() => {
          this.deleteModal = !this.deleteModal;
          this.errorModal = !this.errorModal;
        });
    },

    async getCategory() {
      await axios.get(`https://salvadorcapsapi.azurewebsites.net/api/Category`).then((response) => {
        this.searchCategory = response.data;
        this.searchCategory.forEach(
          (category) =>
            (this.searchCategoryName = [
              ...this.searchCategoryName,
              category.name,
            ])
        );
      });
    },

    async getProductByCategory() {
      if (this.selectedSearchCategory) {
        let categoryID = +this.searchCategory.filter(
          (category) => category.name === this.selectedSearchCategory
        )[0].id;
        await axios
          .get(`https://salvadorcapsapi.azurewebsites.net/api/Product/?categoryID=${categoryID}`)
          .then((response) => {
            (this.products = response.data)
            console.log(response.data)
          });
      } else {
        await this.getProdutos();
      }
    },

    async closeModal() {
      document.location.reload(true);
      await this.getProdutos();
      this.newModal = false;
      this.editModal = false;
    },

    filterCode(product) {
      return +product.code === +this.searchCode;
    },

    filterName(product) {
      return product.name
        .toLowerCase()
        .includes(this.searchProduct.toLowerCase());
    },
  },

  computed: {
    filtredProduct() {
      let conditions = [];

      this.searchCode && conditions.push(this.filterCode);
      this.searchProduct && conditions.push(this.filterName);
      // this.searchCategory && conditions.push(this.searchCategory)

      if (conditions.length > 0) {
        return this.products.filter((product) => {
          return conditions.every((condition) => condition(product));
        });
      }

      return this.products;
    },
  },

  async mounted() {
    await this.getCategory();
    await this.getProdutos();
  },

  components: {
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