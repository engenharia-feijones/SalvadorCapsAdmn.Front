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
      <v-card-text>
        <v-col cols="12" md="4">
          <v-row justify="start" justify-md="space-around" align="center">
            <v-autocomplete
              :items="filterData"
              v-model="filter"
              clearable
            ></v-autocomplete>
            <v-btn class="mx-3" @click="filterCategory">Buscar</v-btn>
          </v-row>
        </v-col>
      </v-card-text>
      <v-list>
        <v-list-group
          v-for="(categoria, index) in filterActive
            ? filterCategorias
            : categorias"
          :key="index"
        >
          <template v-slot:activator>
            <v-list-item-content class="my-1">
              <v-list-item-title>{{ categoria.name }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-card raised class="mt-2 ml-3">
            <v-list-item>
              <v-list-item-content>
                <v-col cols="12">
                  <v-col cols="12" md="6"
                    >Imagem Desktop: {{ categoria.desktopSpotlightImage }}
                  </v-col>
                  <v-col cols="12" md="6"
                    >Imagem Mobile: {{ categoria.mobileSpotlightImage }}</v-col
                  >
                </v-col>
                <v-col cols="12">
                  <v-row justify="start" justify-md="center">
                    <v-btn
                      x-small
                      text
                      class="mr-2"
                      @click="putCategoria(categoria)"
                    >
                      <v-icon>mdi-pencil</v-icon> Editar
                    </v-btn>
                    <v-btn
                      x-small
                      text
                      class="mr-2"
                      :to="{ path: `/categoriaDetalhes/${categoria.id}` }"
                      ><v-icon>mdi-arrow-down-bold-circle</v-icon> Detalhes
                    </v-btn>
                    <v-btn
                      x-small
                      text
                      @click="confirmarDeletarCategoria(categoria)"
                      ><v-icon>mdi-delete</v-icon> Deletar</v-btn
                    >
                  </v-row>
                </v-col>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-list-group>
      </v-list>
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
        @fechar-formulario="
          editarModal = false;
          getCategorias();
        "
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

    <v-dialog v-model="dialogDeleteError">
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

    categorias: [{ nome: "teste", desktop: "a", mobile: "b" }],
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
          `http://localhost:5000/api/Category/${this.deletarCategoriaTemp.id}`
        )
        .then(() => (this.dialogDeletarCategoria = false))
        .catch(() => {
          this.dialogDeletarCategoria = false;
          this.dialogDeleteError = true;
        });

      this.getCategorias();
    },

    async getCategorias() {
      this.loading = true;
      await axios.get(`http://localhost:5000/api/Category`).then((response) => {
        this.categorias = response.data;
        this.loading = false;
      });
      this.categorias.map((categoria) => {
        this.filterData = [...this.filterData, categoria.name];
      });
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

  watch: {},

  created() {
    this.getCategorias();
  },

  components: {
    Formulario,
    Loading,
    DeleteModal,
    DeleteModalError,
  },
};
</script>


<style scoped>
</style>