<template>
  <div>
    <v-card-text>
      <v-row>
        <!-- <v-col cols="12" sm="4" md="4">
             <v-text-field
              prepend-icon="mdi-magnify"
              placeholder="Pesquisar Código..."
              v-model="searchCode"
            ></v-text-field>  
          </v-col>-->
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            prepend-icon="mdi-magnify"
            placeholder="Pesquisar Produto..."
            v-model.trim="searchProduct"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-select
            :items="categorysName"
            @change="filterProductsBy()"
            v-model="selectedCategory"
            clearable
            prepend-icon="mdi-magnify"
            placeholder="Pesquisar Categoria..."
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>

    <v-data-table
      :headers="headers"
      :items="filtredProducts"
      :footer-props="{ 'items-per-page-text': 'Linhas Por Página' }"
      no-data-text="Nenhum Produto Encontrado."
      mobile-breakpoint="0"
    >
      <template v-slot:[`item.image`]="{ item }">
        <v-img
          :src="item.image + '#'"
          height="7rem"
          width="7rem"
          alt="Imagem não encontrada"
          style="display: inline-block"
        ></v-img>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-row justify="center" class="py-1 mt-1">
          <v-btn small text @click="handleEditProduct(item)"
            ><v-icon>mdi-pencil</v-icon> Editar</v-btn
          >
        </v-row>
        <v-row justify="center" class="py-1 mb-1">
          <v-btn small text @click="openConfirmDeleteModal(item)"
            ><v-icon>mdi-delete</v-icon> Deletar</v-btn
          >
        </v-row>
      </template>
    </v-data-table>
  </div>
</template>
<script>
export default {
  data: () => ({
    headers: [
      // { text: "Código", aling: "center", value: "code" },
      { text: "Produtos", align: "center", value: "name" },
      { text: "Imagem", align: "center", value: "image" },
      { text: "Ações", align: "center", value: "actions" },
    ],
    searchCode: "",
    searchProduct: "",
    selectedCategory: "",
  }),

  props: {
    products: {
      Type: Array,
      default: [],
      required: true,
    },
    categorysName: {
      Type: Array,
      default: [],
      required: true,
    },
    categorys: {
        Type: Array,
        default: [],
        required: true,
    }
  },

  computed: {
    filtredProducts() {
      let conditions = [];

      // this.searchCode && conditions.push(this.filterCode);
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

  methods: {
    filterProductsBy() {
      if (this.selectedCategory) {
        const id = this.categorys.filter(
          ({ name }) => name === this.selectedCategory
        )[0]?.id;
        this.$emit("get-products-by-category", {
          id,
        });
      } else {
        this.$emit("get-products")
      }
    },

     filterCode(product) {
      return +product.code === +this.searchCode;
    },
    filterName(product) {
      return product.name
        .toLowerCase()
        .includes(this.searchProduct.toLowerCase());
    },

    openConfirmDeleteModal({ id }) {
        this.$emit("open-delete-confirm-modal", {
            id
        })
    },

    handleEditProduct({ id }) {
        this.$emit("handle-edit-product", {
            id
        })
    }
  },
};
</script>