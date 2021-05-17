<template>
  <v-form ref="form" lazy-validation>
    <v-card>
      <v-card-title>
        <v-row
          justify="space-around"
          justify-md="space-between"
          align="baseline"
        >
          <h3 class="ml-3">Produto</h3>
          <v-btn fab icon @click="closeModal"><v-icon>mdi-close</v-icon></v-btn>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-col cols="12">
          <v-text-field
            label="Código do Produto"
            v-model="produto.code"
            :rules="codeRules"
            v-mask="['#####']"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            label="Nome"
            v-model="produto.name"
            :rules="nameRules"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            label="Nome Externo"
            v-model="produto.externalName"
            :rules="externalNameRules"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-autocomplete
            :items="brandsNames"
            v-model="produto.brand"
            label="Marcas"
            clearable
            :rules="brandRules"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12">
          <v-text-field
            label="Preço"
            v-model="produto.price"
            v-mask="['##.##', '###.##', '####.##']"
            prefix="R$ "
            :rules="priceRules"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-textarea
            label="Descrição"
            no-resize
            outlined
            v-model="produto.description"
            :rules="descriptionRules"
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
        <v-col cols="12">
          <v-btn block style="pointer-events: none">Categoria</v-btn>
        </v-col>

        <v-col cols="12">
          <v-card-text>
            <label>Detalhes Selecionados:</label>
          </v-card-text>
          <v-chip-group column v-model="removeChip"   >
            <v-chip  v-for="(chip, index) in chipDetail" :key="index"
            @dblclick="removeDetailChip(index)"
            >{{ chip.detail.name }}</v-chip>
          </v-chip-group>
        </v-col>

        <v-col cols="12">
          <v-expansion-panels flat>
            <v-expansion-panel
              v-for="(category, index) in categorys"
              :key="index"
            >
              <v-expansion-panel-header>{{
                category.name
              }}</v-expansion-panel-header>
              <div v-if="category.detail">
                <v-expansion-panel-content
                  v-for="(detail, index) in category.detail"
                  :key="index"
                  ><v-checkbox
                    v-model="selectedDetail"
                    :label="detail.name"
                    :value="{'detail': { 'id': detail.id,  'name': detail.name } }"
                  ></v-checkbox
                ></v-expansion-panel-content>
              </div>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>

        <v-card-actions class="mt-5">
          <v-row justify="end">
            <v-btn x-small text @click="closeModal()"
              ><v-icon>mdi-close</v-icon>Cancelar</v-btn
            >
            <v-btn x-small text @click="validateForm()" v-if="editProduct"
              ><v-icon>mdi-check</v-icon>Editar</v-btn
            >
            <v-btn x-small text @click="validateForm()" v-else
              ><v-icon>mdi-check</v-icon>Salvar</v-btn
            >
          </v-row>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script>
import axios from "axios";

export default {
  name: "ProdutosFormulario",
  data: () => ({
    produto: {
      brand: "",
      brandID: "",
      code: "",
      name: "",
      externalName: "",
      description: "",
      price: "",
      imageID: "",
      productCategoryDetails: [],
    },

    codeRules: [(code) => !!code || "Insira um código para o produto"],

    nameRules: [(name) => !!name || "Insira o nome do produto."],

    externalNameRules: [
      (nameExternal) => !!nameExternal || "Insira o nome externo do produto.",
    ],

    brandRules: [(brand) => !!brand || "Selecione a Marca do produto"],

    priceRules: [(price) => !!price || "Insira o preço do produto"],

    descriptionRules: [(desc) => !!desc || "Insira a descrição do produto"],

    removeChip: [], 
    imagePreview: null,
    imagePreviewDetails: {},

    categorys: [{ detail: "" }],
    categorysDetail: [],
    selectedDetail: [],
    chipDetail: [],
    filtredDetail: [],
    brands: [],
    brandsNames: [],
  }),

  props: {
    editProduct: {
      Type: Object,
    },
  },

  methods: {
    cleanForm() {
      this.produto = {
        brandID: "",
        code: "",
        name: "",
        externalName: "",
        description: "",
        price: "",
        imageID: "",
        productCategoryDetails: [],
      };
    },

    removeDetailChip(chipIndex) {
      this.selectedDetail = [ ...this.selectedDetail.filter((detail, index) => index != chipIndex ) ]
      alert()
    },

    insertDetailIntoProduct() {
      this.selectedDetail.map((detail) => {
        this.produto.productCategoryDetails = [...this.produto.productCategoryDetails, { "categoryDetailID":  detail.detail.id } ]
      })
    },

    closeModal() {
      this.$emit("close-modal");
      this.cleanForm();
    },

    previewImage(file) {
      this.imagePreviewDetails.imageID = file.name;
      this.imagePreviewDetails.image = window.URL.createObjectURL(file);
      this.imagePreviewDetails.size = Math.floor(+file.size / 1024) + "KBs";
    },

    removerPreview() {
      this.imagePreview = null;
    },

    async validateForm() {
      // this.filtredDetail = this.categorysDetail.filter(
      //   (cat) => cat.categoryID === category.id
      // );
      
     
        this.insertDetailIntoProduct()
      
      // if (this.$refs.form.validate()) {
      //   if (this.editProduct) {
      //     await this.putProduct();
      //   } else {
      //     await this.postProduct();
      //   }

      //   this.closeModal();
      // }
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
      await axios
        .get(`http://localhost:5000/api/category`)
        .then((response) => (this.categorys = response.data));

      this.categorys.forEach(async (cat, index) => {
        await axios
          .get(`http://localhost:5000/api/CategoryDetail/?categoryID=${cat.id}`)
          .then(
            (response) => (this.categorys[index]["detail"] = [...response.data])
          );
        this.$forceUpdate();
      });
    },

    async postProduct() {
      await axios.post(`http://localhost:5000/api/Product`, {
        brandID: +this.produto.brandID,
        code: +this.produto.code,
        name: this.produto.name,
        externalName: this.produto.externalName,
        description: this.produto.description,
        price: +this.produto.price,
        imageID: this.imagePreviewDetails.imageID,
        productCategoryDetails: this.produto.productCategoryDetails
      });
    },

    async putProduct() {
      await axios.put(`http://localhost:5000/api/Product/${this.produto.id}`, {
        brandID: +this.produto.brandID,
        code: +this.produto.code,
        name: this.produto.name,
        externalName: this.produto.externalName,
        description: this.produto.description,
        price: +this.produto.price,
        imageID: this.imagePreviewDetails.imageID,
        productCategoryDetails: this.produto.productCategoryDetails
      });
    },
  },

  watch: {
    "produto.brand"() {
      this.produto.brandID = this.brands.filter(
        (brand) => brand.name === this.produto.brand
      )[0]?.id;
    },
     selectedDetail() {
        this.chipDetail = [ ...this.selectedDetail ]
      }
  },

  async mounted() {
    await this.getCategorys();
    await this.getBrands();
    this.produto = this.editProduct ?? {
      brand: "",
      brandID: "",
      code: "",
      name: "",
      externalName: "",
      description: "",
      price: "",
      imageID: "",
      productCategoryDetails: [],
    };

    this.produto.brand = this.brands.filter(
      (brand) => brand.id === this.produto.brandID
    )[0]?.name;
  },
};
</script>
