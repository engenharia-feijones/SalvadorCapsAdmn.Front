<template>
  <v-container>
    <v-card max-width="1400" class="mx-auto">
      <v-card-title>
        <v-col cols="12">
          <v-row justify="space-around" justify-md="start" align="baseline">
            <h2 class="ma-3">Produtos</h2>
            <v-btn fab small @click="newModal = !newModal"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </v-row>
        </v-col>

        <v-col cols="12">
          <div class="filter-container">
            <v-row align="baseline">
              <v-col cols="12" md="2">
                <v-text-field
                  label="Código"
                  class="input-code-search"
                  type="number"
                  prepend-inner-icon="mdi-magnify"
                  v-model="selectedCode"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  label="Nome do Produto"
                  prepend-inner-icon="mdi-magnify"
                  v-model="searchName"
                ></v-text-field>
              </v-col>

              <!-- Prodcuct.categoryDetails esta vindo como nulo no momento, então vou deixar esse campo desativado por hora 
                    <v-col cols="12" md="2">
                    <v-autocomplete
                        label="Categoria"
                        clearable
                        :items="filterCategory"
                        no-data-text="Categoria não encontrada."
                        v-model="selectedFitlerCategory"
                    ></v-autocomplete>
                </v-col> -->
              <v-btn @click="filterSearch()">Pesquisar</v-btn>
            </v-row>
          </div>
        </v-col>
      </v-card-title>
      <v-list>
        <v-list-group
          v-for="(product, index) in (filterResults ? filtredProducts : products)"
          :key="index"
        >
          <template v-slot:activator>
            <v-list-item-content class="my-1">
              <v-list-item-title>{{
                `${product.name} R$ ${product.price}`
              }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-card raised class="mt-2 ml-3">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-action>
                  <v-col cols="12">
                    <p>Código: {{ product.code }}</p>
                    <p>Imagem:{{ product.image }}</p>
                  </v-col>
                </v-list-item-action>
                <v-list-item-action>
                  <v-row justify="space-around" justify-md="start">
                    <v-btn x-small text class="mr-2" @click="editProduct(product)">
                      <v-icon>mdi-pencil</v-icon> Editar
                    </v-btn>
                    <v-btn
                      x-small
                      text
                      class="mr-2"
                      @click="confirmDeleteProduct(product)"
                    >
                      <v-icon>mdi-delete</v-icon> Deletar
                    </v-btn>
                  </v-row>
                </v-list-item-action>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-list-group>
      </v-list>
    </v-card>

    <!-- START POST PRODUCT -->
    <v-dialog v-model="newModal" v-if="newModal" max-width="400px">
      <ProdutosFormulario @close-modal="closeModal()" />
    </v-dialog>
    <!-- END POST PRODUCT -->

    <v-dialog v-model="deleteModal" max-width="800px">
      <DeleteModal @close-modal="deleteModal = false" 
        @action="deleteProduct()"
        categoria="Produto"
      />
    </v-dialog>

    <v-dialog v-model="errorModal" max-width="800px">
      <DeleteModalError @close-modal="errorModal = false" /> 
    </v-dialog>

    <!-- START PUT FORM  -->
    
        <v-dialog v-model="editModal" v-if="editModal" max-width="400px">
            <ProdutosFormulario :editProduct="productTemp" @close-modal="closeModal()" />
        </v-dialog>

    <!-- END PUT FORM -->

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
            product.name.includes(this.searchName)
        );
      } else if (this.selectedCode !== "" || this.searchName !== "") {
        if (this.selectedCode !== "") {
          this.filtredProducts = this.products.filter(
            (product) => product.code === this.selectedCode
          );
        } else if (this.searchName !== "") {
          this.filtredProducts = this.products.filter((product) =>
            product.name.includes(this.searchName)
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

    editProduct(temp) {
        this.editModal = !this.editModal
        this.productTemp = temp
    },

    async getProdutos() {
      this.loading = true;
      await axios.get(`http://localhost:5000/api/Product`).then(async response => {
         this.products = await response.data;
        console.log(response.data);
        this.loading = false;
      });
      console.log("get")
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