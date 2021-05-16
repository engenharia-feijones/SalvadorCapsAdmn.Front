<template>
  <v-card>
    <v-card-title>
      <v-row justify="space-around" justify-md="space-between" align="baseline">
        <h3>Produto</h3>
        <v-btn fab icon><v-icon>mdi-close</v-icon></v-btn>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-col cols="12">
        <v-text-field label="Nome" v-model="produto.name"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="Nome Externo"
          v-model="produto.externalName"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-autocomplete
          :items="brandsNames"
          v-model="produto.brand"
          label="Marcas"
          clearable
        ></v-autocomplete>
      </v-col>

      <v-col cols="12">
        <v-text-field
          label="Preço"
          v-model="produto.price"
          v-mask="['##,##', '###,##', '####,##']"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-textarea
          label="Descrição"
          no-resize
          outlined
          v-model="produto.description"
        ></v-textarea>
      </v-col>
      <v-col cols="12" sm="6" md="12" lg="12">
        <v-btn small fab class="txtBtn">
          <v-file-input
            v-model="imagePreview"
            @change="previewImage"
            class="ml-2 mb-2"
            prepend-icon="mdi-cellphone"
            filled
            hide-input
          >
          </v-file-input>
        </v-btn>
        <label class="ml-4">Imagem</label>
        <v-row
          justify="center"
          align="center"
          align-md="baseline"
          class="mt-3 elevation-2"
          v-if="imagePreview"
        >
          <v-col cols="3">
            <v-img
              width="3rem"
              height="50px"
              :src="imagePreviewDetails.image"
            ></v-img>
          </v-col>
          <v-col cols="3">
            <p>{{ imagePreviewDetails.imageID }}</p>
          </v-col>
          <v-col cols="3">
            <p>{{ imagePreviewDetails.size }}</p>
          </v-col>
          <v-col cols="2">
            <v-btn x-small @click="removerPreview()">X</v-btn>
          </v-col>
        </v-row>
      </v-col>
      <!-- <v-col cols="12">
        <v-btn block style="pointer-events: none;">Categoria</v-btn> 
      </v-col>
      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel v-for="(category, index) in categorys" :key="index">
            <v-expansion-panel-header>{{ category.name }}</v-expansion-panel-header>
            <div v-if="category.detail">
            <v-expansion-panel-content v-for="(detail, index) in category.detail" :key="index"><v-checkbox :label="detail.name" :value="detail.id"></v-checkbox></v-expansion-panel-content>

            </div>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col> -->
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  name: "ProdutosFormulario",
  data: () => ({
    produto: {
      brandID: '',
      code: '',
      name: "",
      externalName: "",
      description: "",
      price: '',
      imageID: "",
      productCategoryDetails: [],
    },

    imagePreview: null,
    imagePreviewDetails: {},

    brands: [],
    categorys: [{"detail": ""}],
    categorysDetail: [],
    filtredDetail: [],
    brandsNames: [],
  }),

  methods: {
    cleanForm() {
      this.produto = {
        brandID: '',
        code: '',
        name: "",
        externalName: "",
        description: "",
        price: '',
        imageID: "",
        productCategoryDetails: [],
      }
    },
  
    previewImage(file) {
      this.imagePreviewDetails.imageID = file.name;
      this.imagePreviewDetails.image = window.URL.createObjectURL(file);
      this.imagePreviewDetails.size = Math.floor(+file.size / 1024) + "KBs";
    },

    removerPreview() {
      this.imagePreview = null;
    },

    teste(category) {
      this.filtredDetail = this.categorysDetail.filter(cat => cat.categoryID === category.id )
    },

    async getBrands() {
      await axios
        .get(`http://localhost:5000/api/brand`)
        .then((response) => (this.brands = response.data));
      this.brands.map(
        (brand) => (this.brandsNames = [...this.brandsNames, brand.name])
      );
    },

    async getCategorys() {
      await axios.get(`http://localhost:5000/api/category`).then((response) => this.categorys = response.data)

      this.categorys.forEach(async (cat, index) => {
        await axios.get(`http://localhost:5000/api/CategoryDetail/?categoryID=${cat.id}`).then(response => this.categorys[index]["detail"] = [ ...response.data]  )
        this.$forceUpdate();
        console.log(this.categorys[index]["detail"])
      })
    }
  },

  watch: {
    "produto.brand"() {
      this.produto.brandID = this.brands.filter(
        (brand) => brand.name === this.produto.brand
      )[0]?.id;
    },
  },

  created() {
    this.getCategorys();
    this.getBrands();
  },
};
</script>
