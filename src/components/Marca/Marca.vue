<template>
  <v-container fluid>
    <v-card class="mx-auto" width="100%" max-width="1400px">
      <v-card-title class="mb-3">
        <v-row justify="start" justify-md="start" align="baseline">
          <h4 class="ma-3">Marcas</h4>
          <v-btn fab small @click="newModal = !newModal" 
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-row>
      </v-card-title>

      <v-data-table :headers="cabecalho" :items="brands" sort-by="nome" mobile-breakpoint="0" hide-default-footer>
        <template v-slot:[`item.desktopSpotlightImage`]="{ item }">
          <v-img
            :src="item.desktopSpotlightImage"
            height="7rem"
            width="7rem"
            alt="Imagem não encontrada"
            style="display: inline-block"
          >
          </v-img>
        </template>
        <template v-slot:[`item.mobileSpotlightImage`]="{ item }">
          <v-img
            :src="item.mobileSpotlightImage"
            height="7rem"
            width="7rem"
            alt="Imagem não encontrada"
            style="display: inline-block"
          >
          </v-img>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-row justify="center" class="py-1 mt-1">
            <v-btn small text @click="getOneBrandToEdit(item)"
              ><v-icon>mdi-pencil</v-icon> Editar</v-btn
            >
          </v-row>
          <v-row justify="center" class="py-1 mb-1">
            <v-btn small text @click="confirmDeleteModal(item)"
              ><v-icon>mdi-delete</v-icon> Deletar</v-btn
            >
          </v-row>
        </template>
      </v-data-table>

      <v-dialog v-model="newModal" v-if="newModal" max-width="800px">
        <FormularioMarca 
          @close-modal="closeModal()"
        />
      </v-dialog>

      <v-dialog v-model="editModal" v-if="editModal" max-width="800px">
        <FormularioMarca @close-modal="closeEditModal()"
          :editBrand="brandTemp"
         />
      </v-dialog>

      <v-dialog v-model="deleteModalShow">
        <DeleteModal
          @action="deleteBrand()"
          @close-modal="deleteModalShow = false"
        />
      </v-dialog>

      <v-dialog v-model="deleteModalErrorShow">
        <DeleteModalError @close-modal="deleteModalErrorShow = false" />
      </v-dialog>
    </v-card>
  </v-container>
</template>
<script>
import axios from "axios";
import DeleteModal from "@/components/Common/DeleteModal";
import DeleteModalError from "@/components/Common/DeleteModalError";
import FormularioMarca from './FormularioMarca'

export default {
  name: "Marca",

  data: () => ({
    newModal: false,
    editModal: false,
    deleteModalShow: false,
    deleteModalErrorShow: false,
    brandID: "",
    img64Mob: "",
    img64Desk: "",
    cabecalho: [
      { text: "Nome", align: "start", value: "name" },
      {
        text: "Imagem Desktop",
        align: "Start",
        value: "desktopSpotlightImage",
      },
      { text: "Imagem Mobile", align: "Start", value: "mobileSpotlightImage" },
      { text: "Ações", align: "center", value: "actions" },
    ],
    brands: [
      {
        name: "",
        desktopSpotlight: false,
        desktopSpotlightImageID: " ",
        desktopSpotlightImage: " ",
        mobileSpotlight: false,
        mobileSpotlightImageID: " ",
        mobileSpotlightImage: " ",
      },
    ],

    brand: {
      name: "",
    },

    editedItem: {
      nome: "",
      imagemDesktop: {
        nome: "",
        url: "",
        previwer: "",
      },
      imagemMobile: {
        nome: "",
        url: "",
        previwer: "",
      },
    },

    brandToEdit: {},

    deleteTemp: {},
    
  }),
  created() {
    this.getBrand();
  },
  methods: {

    gambiarra() {
      document.location.reload(true)
    },

    closeModal() {
      this.newModal = false
      this.gambiarra()
    },

    closeEditModal() {
      this.editModal = false,
      this.gambiarra()
    },

    async getLastBrandID() {
      await axios.get(`http://localhost:5000/api/Brand`).then((response) => {
        this.brandID = response.data[response.data.length - 1].id;
      });
    },

    async getOneBrandToEdit(brand) {
     this.brandTemp = brand
     this.editModal = true
    },

    async getBrand() {
      await axios.get(`http://localhost:5000/api/Brand`).then((response) => {
        this.brands = response.data;
      });
    },

    confirmDeleteModal(item) {
      this.deleteModalShow = true;
      this.deleteTemp = item;
    },

    async deleteBrand() {
      await axios
        .delete(`http://localhost:5000/api/Brand/${this.deleteTemp.id}`)
        .then(() => {
          this.deleteModal = false
          document.location.reload(true);
        }).catch(() => {
          this.deleteModalShow = false
          this.deleteModalErrorShow = true
        })
      
    },
  },

  components: {
    DeleteModal,
    DeleteModalError,
    FormularioMarca,
  },
};
</script>
<style>
</style>