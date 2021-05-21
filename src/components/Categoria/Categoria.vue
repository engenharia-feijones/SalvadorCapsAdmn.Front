<template>
  <v-container fluid>
    <v-card width="100%" max-width="1400px" class="mx-auto">
      <v-card-title class="mb-3">
        <v-row justify="space-around" justify-md="start" align="baseline">
          <h2 class="ma-3">Categorias</h2>
          <v-btn fab small @click="dialog = true"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-col cols="12" md="6">
          <v-row justify="start" justify-md="space-around" align="center">
            <v-text-field
              :items="filterData"
              v-model="filter"
              clearable
              prepend-inner-icon="mdi-magnify"
              placeholder="Pesquisar Categorias..."
            ></v-text-field>
          </v-row>
        </v-col>
      </v-card-text>

      <v-data-table
        :headers="headers"
        :items="categorias"
        :search="filter"
        hide-default-footer
        no-data-text="Nenhuma Categoria Encontrada."
        mobile-breakpoint="0"
      >
        <template v-slot:[`item.desktopSpotlightImage`]="{ item }">
          <v-img
            :src="item.desktopSpotlightImage"
            height="7rem"
            width="7rem"
            alt="Imagem não encontrada"
            style="display: inline-block"
          ></v-img>
        </template>

        <template v-slot:[`item.mobileSpotlightImage`]="{ item }">
          <v-img
            :src="item.mobileSpotlightImage"
            height="7rem"
            width="7rem"
            alt="Imagem não encontrada"
            style="display: inline-block"
          ></v-img>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-row justify="center" class="py-1 mt-1">
            <v-btn small text @click="putCategoria(item)"
              ><v-icon>mdi-pencil</v-icon> Editar</v-btn
            >
          </v-row>
          <v-row justify="center" class="py-1">
            <v-btn small text :to="{ path: `/categoriaDetalhes/${item.id}` }"
              ><v-icon>mdi-arrow-down</v-icon> Detalhes</v-btn
            >
          </v-row>
          <v-row justify="center" class="py-1 mb-1">
            <v-btn small text @click="confirmarDeletarCategoria(item)"
              ><v-icon>mdi-delete</v-icon> Deletar</v-btn
            >
          </v-row>
        </template>
      </v-data-table>
    </v-card>
    
    <!-- START POST CATEGORY -->
    <v-dialog v-model="dialog" max-width="800px">
      <Formulario
        @fechar-formulario="dialog = false"
        @cadastro-feito="getCategorias()"
        v-if="dialog"
      />
    </v-dialog>
    <!-- END POST CATEGORY -->

    <!-- START PUT CATEGORY -->
    <v-dialog v-model="editarModal" max-width="800px">
      <Formulario
        :editarCategoria="editarCategoriaTemp"
        @fechar-formulario="editarModal = false;"
        @update-feito="getCategorias(); gambiarraEmergencial()"
        v-if="editarModal"
      />
    </v-dialog>
    <!-- END PUT CATEGORY -->

    <v-dialog v-model="dialogDeletarCategoria" max-width="800px">
      <DeleteModal
        categoria="Detalhe"
        @close-modal="dialogDeletarCategoria = false"
        @action="deletarCategoria()"
      />
    </v-dialog>

    <v-dialog v-model="dialogDeleteError" max-width="800px">
      <DeleteModalError
        categoria="a Categoria"
        @close-modal="dialogDeleteError = false"
      />
    </v-dialog>

    <Loading v-if="loading" />
  </v-container>
</template>

<script>
import axios from "axios";
import Formulario from "./Formulario";
import Loading from "@/components/Common/Loading";
import DeleteModal from "@/components/Common/DeleteModal";
import DeleteModalError from "@/components/Common/DeleteModalError";

export default {
  name: "Categoria",

  data: () => ({
    loading: false,
    dialog: false,
    dialogDeletarCategoria: false,
    dialogDeleteError: false,
    desativarBtn: true,
    editarModal: false,
    filter: null,
    filterActive: false,

    headers: [
      { text: "Categoria", align: "center", value: "name" },
      {
        text: "Imagem Desktop",
        align: "center",
        value: "desktopSpotlightImage",
      },
      { text: "Imagem Mobile", align: "center", value: "mobileSpotlightImage" },
      { text: "Ações", align: "center", value: "actions" },
    ],

    categorias: [{ name: "", desktopSpotlightImage: "", mobileSpotlightImage: "", actions: ""}],
    filterData: [],
    filterCategorias: [],
    deletarCategoriaTemp: {},
    editarCategoriaTemp: {},
    categoryDetail: {},
    categoryTemp: {},
  }),

  methods: {
    confirmarDeletarCategoria(item) {
      this.dialogDeletarCategoria = true;
      this.deletarCategoriaTemp = item;
    },

    filterCategory() {
      this.filterActive = this.filter ? true : false;
      this.filterCategorias = this.categorias.filter(
        (category) => category.name === this.filter
      );
    },

    async deletarCategoria() {
      await axios
        .delete(
          `https://salvadorcapsapi.azurewebsites.net/api/Category/${this.deletarCategoriaTemp.id}`
        )
        .then(() => (this.dialogDeletarCategoria = false))
        .catch(() => {
          this.dialogDeletarCategoria = false;
          this.dialogDeleteError = true;
        });

      await this.getCategorias();
    },

    async getCategorias() {
      this.loading = true;
      await axios.get(`https://salvadorcapsapi.azurewebsites.net/api/Category`).then((response) => {
        this.categorias = response.data;
        this.loading = false;
      });
      this.categorias.map((categoria) => {
        this.filterData = [...this.filterData, categoria.name];
      });

      console.log(".")
    },

    async closeModal() {
      await this.getCategorias();
    },

    async putCategoria(infos) {
      this.editarModal = !this.editarModal;
      this.editarCategoriaTemp = infos;
    },

    gambiarraEmergencial() {
      document.location.reload(true)
    }
  },

  async created() {
    await this.getCategorias();
  },

  components: {
    Formulario,
    Loading,
    DeleteModal,
    DeleteModalError,
  },
};
</script>