<template>
  <v-container>
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
      
        <v-data-table
          :headers="headers"
          :items="products"
          hide-default-footer
          no-data-text="Nenhum Produto Encontrado."
          mobile-breakpoint="0"
        >
          <template v-slot:[`item.image`]="{ item }">
            <v-img
              :src="item.image"
              height="7rem"
              width="7rem"
              alt="Imagem não encontrada"
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
    deleteModal: false,
    errorModal: false,
    editModal: false,
    filterResults: false,
    loading: true,

    products: [],
    filtredProducts: [],
    filterCategory: [],

    headers: [
      { text: "Código", aling: "center", value: "code" },
      { text: "Produtos", align: "center", value: "name" },
      { text: "Imagem", align: "center", value: "image" },
      { text: "Ações", align: "center", value: "actions" },
    ],

    productTemp: {},

    searchName: "",
    selectedCode: "",
    selectedFitlerCategory: null,
  }),

  methods: {
    filterSearch() {
      this.handleSearchData();
      if (this.selectedCode !== "" && this.searchName !== "") {
        this.filtredProducts = this.products.filter(
          (product) =>
            product.code === this.selectedCode &&
            product.name.toLowerCase().includes(this.searchName.toLowerCase())
        );
      } else if (this.selectedCode !== "" || this.searchName !== "") {
        if (this.selectedCode !== "") {
          this.filtredProducts = this.products.filter(
            (product) => product.code === this.selectedCode
          );
        } else if (this.searchName !== "") {
          this.filtredProducts = this.products.filter((product) =>
            product.name.toLowerCase().includes(this.searchName.toLowerCase())
          );
        }
      }

      this.filterResults =
        this.selectedCode !== "" ||
        this.selectedFitlerCategory ||
        this.searchName != ""
          ? true
          : false;
    },

    handleSearchData() {
      this.searchName = this.searchName.trim();
      this.selectedCode =
        this.selectedCode === "" ? this.selectedCode : +this.selectedCode;
    },

    confirmDeleteProduct(product) {
      this.deleteModal = true;
      this.productTemp = product;
    },

    async editProduct(temp) {
      await axios
        .get(`http://localhost:5000/api/Product/${temp.id}`)
        .then((response) => {
          this.productTemp = response.data
          this.editModal = !this.editModal;
        });
    },

    async getProdutos() {
      this.loading = true;
      await axios
        .get(`http://localhost:5000/api/Product`)
        .then(async (response) => {
          this.products = await response.data;
          console.log(response.data);
          this.loading = false;
        });
      console.log("get");
    },

    async deleteProduct() {
      await axios
        .delete(`http://localhost:5000/api/Product/${this.productTemp.id}`)
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
      await axios.get(`http://localhost:5000/api/Category`).then((response) => {
        response.data.map(
          (category) =>
            (this.filterCategory = [...this.filterCategory, category.name])
        );
      });
    },

    async closeModal() {
      await this.getProdutos();
      this.newModal = false;
      this.editModal = false;
    },
  },

  computed: {
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true;
        default:
          return false;
      }
    },
  },

  mounted() {
    this.getCategory();
    this.getProdutos();
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