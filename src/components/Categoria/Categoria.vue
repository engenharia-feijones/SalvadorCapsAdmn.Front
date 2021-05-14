<template>
  <v-container>
    <v-data-table
      :headers="cabecalho"
      :items="categorias"
      sort-by="nome"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Categorias</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="800px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="white" darkr v-bind="attrs" v-on="on"> NEW </v-btn>
            </template>
           <Formulario @fechar-formulario="dialog = false" 
            @cadastro-feito="getCategorias()" v-if="dialog"
           />
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:[`item.acoes`]="{ item }">
        <v-icon small class="mr-2" @click="putCategoria(item)"> mdi-pencil </v-icon>
        <v-icon small class="mr-2" @click="loadCategoriaDetail(item)"> mdi-arrow-down-bold-circle </v-icon>
        <v-icon small @click="confirmarDeletarCategoria(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="editarModal" max-width="800px">
      <Formulario :editarCategoria="editarCategoriaTemp"
        @fechar-formulario="editarModal = false"
        v-if="editarModal"
       />
    </v-dialog>

    <!-- START DIALOG DELETE -->
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
    <!-- END DIALOG DELETE -->
    <CategoriaDetail :categoryDetails="categoryDetail" :category="categoryTemp" 
      @atualizar-category-detail="loadCategoriaDetail($event)"  @deletar-category-detail="loadCategoriaDetail($event)" />
  </v-container>
</template>
<script>
import axios from 'axios'
import Formulario from './Formulario'
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
      { text: "Imagem Desktop", align: "Start", value: "desktopSpotlightImage" },
      { text: "Imagem Mobile", align: "Start", value: "mobileSpotlightImage" },
      { text: "", align: "Start", value: "acoes" },
    ],
    categorias: [{ nome: "teste", desktop: "a", mobile: "b" }],
    deletarCategoriaTemp: {},
    editarCategoriaTemp: {},
    categoryDetail: {},
    categoryTemp: {}
  }),

  methods: {
    confirmarDeletarCategoria(item) {
      this.dialogDeletarCategoria = !this.dialogDeletarCategoria;
      this.deletarCategoriaTemp = item;
    },

    async deletarCategoria() {
      await axios.delete(`http://localhost:5000/api/Category/${this.deletarCategoriaTemp.id}`)
      this.deletarCategoriaTemp = null;
      this.dialogDeletarCategoria = !this.dialogDeletarCategoria;
      this.getCategorias()
    },
    
    async getCategorias() {
        await axios.get(`http://localhost:5000/api/Category`).then(response => this.categorias = response.data)
        console.log(this.categorias)
    },

    async putCategoria(infos) {
      this.editarModal = !this.editarModal
      this.editarCategoriaTemp = infos
    },

    async loadCategoriaDetail(categoria) {
      await axios.get(`http://localhost:5000/api/CategoryDetail/?categoryID=${categoria.id}`)
      .then(response => this.categoryDetail = response.data)
      .catch(response => console.log(response))
      this.categoryTemp = categoria
    },

    teste(e) {
      console.log(e.category.id)
    }

  },

  created() {
      this.getCategorias()
  },

  components: {
      Formulario,
      CategoriaDetail
  }
};
</script>


<style scoped>
</style>