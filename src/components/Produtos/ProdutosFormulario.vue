<template>
  <v-form ref="form" lazy-validation>
    <v-stepper v-model="stepper" vertical non-linear>
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

      <v-stepper-step editable step="1">
        Informações do Produto
      </v-stepper-step>

      <v-stepper-content editable step="1">
        <v-card>
          <!-- <v-text-field
            label="Código do Produto"
            v-model="produto.code"
            :rules="codeRules"
            v-mask="['#####']"
          ></v-text-field> -->
          <v-text-field
            label="Nome"
            v-model="produto.name"
            :rules="nameRules"
          ></v-text-field>
          <v-text-field
            label="Nome Externo"
            v-model="produto.externalName"
            :rules="externalNameRules"
          ></v-text-field>

          <v-autocomplete
            :items="brandsName"
            v-model="produto.brand"
            label="Marcas"
            clearable
            :rules="brandRules"
          ></v-autocomplete>

          <v-text-field
            label="Preço"
            v-model.number="produto.price"
            v-mask="['##.##', '###.##', '####.##']"
            prefix="R$ "
            :rules="priceRules"
          ></v-text-field>

          <v-textarea
            label="Descrição"
            no-resize
            outlined
            v-model="produto.description"
            :rules="descriptionRules"
          ></v-textarea>

          <v-btn color="primary" @click="nextStep()"> Proximo </v-btn>
        </v-card>
      </v-stepper-content>

      <v-stepper-step editable @click.once="editableStep()" step="2"
        >Categoria e Detalhes Do Produto</v-stepper-step
      >
      <v-stepper-content step="2">
        <v-card v-if="stepper == 2">
          <v-treeview
            selectable
            open-all
            open-on-click
            transition
            :hoverable="true"
            :items="categorysTree"
            v-model="productCategoryDetails"
          ></v-treeview>
          <v-btn text @click="stepper = 1"> Voltar </v-btn>
          <v-btn color="primary" @click="stepper = 3"> Proximo </v-btn>
        </v-card>
      </v-stepper-content>

      <v-stepper-step editable step="3">Images do Produto </v-stepper-step>
      <v-stepper-content step="3">
        <v-card>
          <div v-if="editProduct">
            <v-btn block style="pointer-events: none">Imagem Principal: </v-btn>
            <v-img :src="produto.image"></v-img>
          </div>
          <v-file-input
            v-model="imagePreview"
            @change="readBase64Image"
            prepend-icon="mdi-cellphone"
            placeholder="Imagem Principal"
            :clearable="false"
            required
          >
          </v-file-input>

          <v-row justify="center" align="center" v-show="imagePreview">
            <v-col cols="5">
              <v-img
                width="4rem"
                height="4rem"
                :src="base64Image.image"
              ></v-img>
            </v-col>

            <v-col cols="1">
              <v-btn
                color="red"
                dark
                height="2rem"
                width="2rem"
                small
                @click="removePreview()"
                >X</v-btn
              >
            </v-col>
          </v-row>

          <v-file-input
            class="mt-5"
            label="Imagens do Produto"
            v-model="imagesPreview"
            @change="readBase64ProductImages"
            :clearable="false"
            prepend-icon="mdi-plus"
          ></v-file-input>

          <div>
            <v-row
              v-for="(image, index) in base64ProductImages"
              :key="index"
              justify="center"
              align="center"
              align-md="center"
              class="my-3"
            >
              <v-col cols="3">
                <v-img
                  width="4rem"
                  height="4rem"
                  :src="image.blobFile.image"
                ></v-img>
              </v-col>
              <v-col cols="3">
                <p>{{ image.blobFile.name }}</p>
              </v-col>
              <v-col cols="1">
                <v-btn
                  color="red"
                  dark
                  height="2rem"
                  width="2rem"
                  small
                  @click="removePreviewImage(index)"
                  >X</v-btn
                >
              </v-col>
            </v-row>
          </div>

          <v-col cols="12" v-show="editProduct" class="my-3">
            <v-btn block style="pointer-events: none">Outras Imagens </v-btn>
            <v-img
              v-for="(image, index) in editProductImages"
              :key="index"
              :src="image.image"
              class="my-2"
            >
              <v-row align="end" justify="space-around">
                <v-btn
                  color="red"
                  dark
                  small
                  class="mt-2"
                  @click="deleteProductImage(index)"
                  ><v-icon>mdi-close</v-icon></v-btn
                >
              </v-row>
            </v-img>
          </v-col>

          <p v-show="incompleteMessages">Insira as informações do produto.</p>
          <v-btn text @click="stepper = 2"> Voltar </v-btn>
          <v-btn
            color="blue"
            text
            :disabled="disableBtn"
            @click="validateForm()"
            v-if="editProduct"
            ><v-icon>mdi-check</v-icon>Editar</v-btn
          >
          <v-btn
            color="blue"
            text
            :disabled="disableBtn"
            @click="validateForm()"
            v-else
            ><v-icon>mdi-check</v-icon>Salvar</v-btn
          >
        </v-card>
      </v-stepper-content>
    </v-stepper>
  </v-form>
</template>

<script>
export default {
  name: "ProdutosFormulario",
  data: () => ({
    produto: {
      brand: "",
      brandID: "",
      // code: "",
      name: "",
      externalName: "",
      description: "",
      price: "",
      imageID: "",
      details: [],
      productCategoryDetails: [],
      productImages: [],
    },

    imagePreview: null,
    base64Image: {
      name: null,
      data: null,
      image: null,
    },

    imagesPreview: null,
    base64ImageTemp: {
      name: null,
      data: null,
      image: null,
    },
    base64ProductImages: [],
    editProductImages: [],

    codeRules: [(code) => !!code || "Insira um código para o produto"],

    nameRules: [(name) => !!name || "Insira o nome do produto."],

    externalNameRules: [
      (nameExternal) => !!nameExternal || "Insira o nome externo do produto.",
    ],

    brandRules: [(brand) => !!brand || "Selecione a Marca do produto"],

    priceRules: [(price) => !!price || "Insira o preço do produto"],

    descriptionRules: [(desc) => !!desc || "Insira a descrição do produto"],

    stepper: 1,

    productCategoryDetails: [],
    chipDetail: [],
    categorysTree: [],

    flag: false,
    disableBtn: false,
    incompleteMessages: false,
  }),

  props: {
    editProduct: {
      Type: Object,
      default: undefined,
    },
    brands: {
      Type: Array,
      default: [],
      required: true,
    },

    categorys: {
      Type: Array,
      default: [],
      required: true,
    },
  },

  computed: {
    brandsName() {
      return this.brands.map(({ name }) => name);
    },

    showChips() {
      return this.chipDetail?.length;
    },
  },
  methods: {
    nextStep() {
      if (this.$refs.form.validate()) {
        this.stepper = 2;
        if (this.editProduct && !this.flag) {
          // this.editInsertDetailIntoChip();
          //  CHIPS NOT ARE REACTIVE GAMBIARRA TO HANDLE WITH THIS FOR NOW
          this.flag = true;
        }
      }
    },
    editableStep() {
      if (this.editProduct && !this.flag) {
        // this.editInsertDetailIntoChip();
        //  CHIPS NOT ARE REACTIVE GAMBIARRA TO HANDLE WITH THIS FOR NOW
        this.flag = true;
      }
    },
    deleteProductImage(index) {
      this.editProductImages.splice(index, 1);
    },
    closeModal() {
      this.$emit("close-modal");
    },

    readBase64Image(file) {
      if (!file) return;
      const reader = new FileReader();

      this.base64Image.name = file.name;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.base64Image.data = reader.result
          ?.toString()
          .replace("data:", "")
          .replace(/^.+,/, "");
        this.base64Image.image = reader.result;
      };
    },

    readBase64ProductImages(file) {
      if (file) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const name = file.name;

          const data = reader.result
            ?.toString()
            .replace("data:", "")
            .replace(/^.+,/, "");
          const image = reader.result;

          this.base64ProductImages.push({
            blobFile: {
              name,
              data,
              image,
            },
          });
        };
      }
    },

    removePreview() {
      this.imagePreview = null;
      this.base64Image = {
        name: null,
        data: null,
        image: null,
      };
    },

    removePreviewImage(index) {
      this.imagesPreview = null;
      this.base64ProductImages.splice(index, 1);
    },

    handleClicks() {
      if (this.disableBtn) return;

      this.disableBtn = true;
      setTimeout(() => (this.disableBtn = false), 600);
    },

    async validateForm() {
      this.handleClicks();
      if (this.$refs.form.validate()) {
        this.incompleteMessages = false;
        if (this.editProduct) {
          this.handleUpdateProduct();
        } else {
          this.handleCreateProduct();
        }
        this.closeModal();
      } else {
        this.incompleteMessages = true;
      }
    },

    handleCreateProduct() {
      this.handleProductCategoryDetails();
      this.$emit("create-product-data", {
        body: {
          ...this.produto,
          blobImage: this.base64Image,
          productImages: this.base64ProductImages,
          productCategoryDetails: this.productCategoryDetails,
        },
      });
    },

    handleUpdateProduct() {
      this.handleProductCategoryDetails();
      this.updateBrandId();
      this.$emit("update-product-data", {
        data: {
          ...this.produto,
          blobImage: this.base64Image,
          productCategoryDetails: this.productCategoryDetails,
          productImages: [
            ...this.base64ProductImages,
            ...this.editProductImages,
          ],
        },
      });
    },

    updateBrandId() {
      this.produto.brandID = this.brands.filter(
        ({ name }) => name === this.produto.brand
      )[0]?.id;
    },

    handleTreeView() {
      this.categorys.forEach(({ id, name, detail }) => {
        const tratedDetail = detail.map(({ id, name }) => ({ id, name }));

        this.categorysTree = [
          ...this.categorysTree,
          {
            id: `${name}.${id}`,
            name,
            children: [...tratedDetail],
          },
        ];
      });
    },

    handleProductCategoryDetails() {
      this.productCategoryDetails = this.productCategoryDetails.map((id) => ({ categoryDetailID: id }))
    },

    handleCategoryTreeViewUpdate() {
      const { productCategoryDetails } = this.editProduct 
      this.productCategoryDetails = productCategoryDetails.map(({  categoryDetailID }) => categoryDetailID )
    }
  },

  watch: {
    "produto.brand"() {
      this.produto.brandID = this.brands.filter(
        ({ name }) => name === this.produto.brand
      )[0]?.id;
    }
  },

  created() {
    this.produto = this.editProduct ?? this.produto;

    this.produto.brand = this.brands.filter(
      (brand) => brand.id === this.produto.brandID
    )[0]?.name;

    this.handleTreeView();
    if (this.editProduct) {
      this.handleCategoryTreeViewUpdate()
      this.editProductImages = this.editProduct.productImages;
    }
  },
};
</script>
