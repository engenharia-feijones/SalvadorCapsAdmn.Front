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

      <v-data-table :headers="cabecalho" :items="brands" sort-by="nome">
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

      <v-dialog v-model="newModal" max-width="800px">
        <FormularioMarca />
      </v-dialog>

      <v-dialog v-model="deleteModalShow">
        <DeleteModal
          @action="deleteBrand()"
          @close-modal="deleteModalShow = false"
        />
      </v-dialog>
    </v-card>
  </v-container>
</template>
<script>
import axios from "axios";
import DeleteModal from "@/components/Common/DeleteModal";
import FormularioMarca from './FormularioMarca'

export default {
  name: "Marca",

  data: () => ({
    newModal: false,
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
    deleteModalShow: false,
  }),
  created() {
    this.getBrand();
  },
  methods: {
    previwerImageMob(file) {
      const reader = new FileReader();
      this.editedItem.imagemMobile.nome = file.name;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.editedItem.imagemMobile.url = reader.result
          ?.toString()
          .replace("data:", "")
          .replace(/^.+,/, "");
        this.editedItem.imagemMobile.previwer = `data:image/jpeg;charset=utf-8;base64,${this.editedItem.imagemMobile.url}`;
      };
    },
    gambiarra() {
      document.location.reload(true);
    },
    previwerimage(file) {
      const reader = new FileReader();
      this.editedItem.imagemDesktop.nome = file.name;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.editedItem.imagemDesktop.url = reader.result
          ?.toString()
          .replace("data:", "")
          .replace(/^.+,/, "");
        this.editedItem.imagemDesktop.previwer = `data:image/jpeg;charset=utf-8;base64,${this.editedItem.imagemDesktop.url}`;
      };
    },
    async getLastBrandID() {
      await axios.get(`http://localhost:5000/api/Brand`).then((response) => {
        this.brandID = response.data[response.data.length - 1].id;
      });
    },

    async getOneBrandToEdit(brand) {
      await axios
        .get(`http://localhost:5000/api/Brand/${brand.id}`)
        .then((response) => {
          this.editedItem.nome = response.data.name;
          console.log(response.data);
          this.newModal = true;
        });
    },

    async getBrand() {
      await axios.get(`http://localhost:5000/api/Brand`).then((response) => {
        this.brands = response.data;
      });
    },

    async postBrand() {
      console.log(this.editedItem.imagemMobile.url);
      await axios
        .post(`http://localhost:5000/api/Brand`, {
          name: this.editedItem.nome,
        })
        .then(async () => {
          await this.getLastBrandID();
          if (this.editedItem.imagemMobile.url) {
            await axios.post(`http://localhost:5000/api/BrandImage`, {
              brandID: this.brandID,
              blobFile: {
                name: this.editedItem.imagemMobile.nome,
                data: this.editedItem.imagemMobile.url,
              },
              destination: 2,
            });
          }
          if (this.editedItem.imagemDesktop.url) {
            await axios.post(`http://localhost:5000/api/BrandImage`, {
              brandID: this.brandID,
              blobFile: {
                name: this.editedItem.imagemDesktop.nome,
                data: this.editedItem.imagemDesktop.url,
              },
              destination: 1,
            });
          }
        });

      document.location.reload(true);
    },

    confirmDeleteModal(item) {
      this.deleteModalShow = true;
      this.deleteTemp = item;
    },

    async deleteBrand() {
      await axios
        .delete(`http://localhost:5000/api/Brand/${this.deleteTemp.id}`)
        .then(() => (this.deleteModal = false));
      document.location.reload(true);
    },
  },

  components: {
    DeleteModal,
    FormularioMarca,
  },
};
</script>
<style>
</style>