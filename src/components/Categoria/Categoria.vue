<template>
  <v-container>
    <v-card max-width="1400px" class="mx-auto">
      <v-card-title class="mb-3">
        <v-row justify="space-around" justify-md="start" align="baseline">
          <h2 class="ma-3">Categorias</h2>
          <v-btn fab small @click="dialog = true"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-row>
      </v-card-title>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(categoria, index) in categorias"
          :key="index"
        >
          <v-expansion-panel-header>{{
            categoria.name
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-col cols="12">
              <v-col cols="6"
                >Imagem Desktop: {{ categoria.desktopSpotlightImage }}
              </v-col>
              <v-col cols="6"
                >Imagem Mobile: {{ categoria.mobileSpotlightImage }}</v-col
              >
            </v-col>
            <v-row justify="start" justify-md="center">
              <v-btn x-small text class="mr-2" @click="putCategoria(categoria)">
                <v-icon>mdi-pencil</v-icon> Editar
              </v-btn>
              <v-btn
                x-small
                text
                class="mr-2"
                @click="loadCategoriaDetail(categoria)"
                ><v-icon>mdi-arrow-down-bold-circle</v-icon> Detalhes
              </v-btn>
              <v-btn x-small text @click="confirmarDeletarCategoria(categoria)"
                ><v-icon>mdi-delete</v-icon> Deletar</v-btn
              >
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
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
        @fechar-formulario="editarModal = false"
        v-if="editarModal"
      />
    </v-dialog>
    <!-- END PUT CATEGORY -->
    <!-- START DELETE DIALOG -->
    <v-dialog v-model="dialogDeletarCategoria" max-width="800px">
      <v-card height="150px">
        <v-card-title>Deletar Categoria</v-card-title>
        <v-card-text
          >Não sera possivel recuperar os dados ja cadastrados apos deletar essa
          categoria</v-card-text
        >
        <v-card-actions>
          <v-row justify="end" justify-md="start">
            <v-btn
              text
              color="blue"
              @click="dialogDeletarCategoria = !dialogDeletarCategoria"
              >Cancelar</v-btn
            >
            <v-btn text color="red" @click="deletarCategoria()">Deletar</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END DELETE DIALOG -->

    <CategoriaDetail
      :categoryDetails="categoryDetail"
      :category="categoryTemp"
      @atualizar-category-detail="loadCategoriaDetail($event)"
      @deletar-category-detail="loadCategoriaDetail($event)"
    />
  </v-container>
</template>
<script>
import axios from "axios";
import Formulario from "./Formulario";
import CategoriaDetail from './CategoriaDetail/CategoriaDetail'

export default {
  name: "Categoria",

  data: () => ({
    dialog: false,
    dialogDeletarCategoria: false,
    desativarBtn: true,
    editarModal: false,

    cabecalho: [
      { text: "Categoria", align: "start", value: "name" },
      {
        text: "Imagem Desktop",
        align: "Start",
        value: "desktopSpotlightImage",
      },
      { text: "Imagem Mobile", align: "Start", value: "mobileSpotlightImage" },
      { text: "", align: "Start", value: "acoes" },
    ],
    categorias: [{ nome: "teste", desktop: "a", mobile: "b" }],
    deletarCategoriaTemp: {},
    editarCategoriaTemp: {},
    categoryDetail: {},
    categoryTemp: {},
  }),

  methods: {
    confirmarDeletarCategoria(item) {
      this.dialogDeletarCategoria = !this.dialogDeletarCategoria;
      this.deletarCategoriaTemp = item;
      console.log(this.deletarCategoriaTemp.id);
    },

    async deletarCategoria() {
      await axios.delete(
        `http://localhost:5000/api/Category/${this.deletarCategoriaTemp.id}`
      );
      this.deletarCategoriaTemp = null;
      this.dialogDeletarCategoria = !this.dialogDeletarCategoria;
      this.getCategorias();
    },

    async getCategorias() {
      await axios
        .get(`http://localhost:5000/api/Category`)
        .then((response) => (this.categorias = response.data));
      console.log(this.categorias);
    },

    async putCategoria(infos) {
      this.editarModal = !this.editarModal;
      this.editarCategoriaTemp = infos;
    },

    async loadCategoriaDetail(categoria) {
      await axios
        .get(
          `http://localhost:5000/api/CategoryDetail/?categoryID=${categoria.id}`
        )
        .then((response) => (this.categoryDetail = response.data))
        .catch((response) => console.log(response));
      this.categoryTemp = categoria;
    },
  },

  created() {
    this.getCategorias();
  },

  components: {
    Formulario,
    CategoriaDetail
  },
};
</script>


<style scoped>
</style>