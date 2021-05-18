<template>
  <v-card class="mx-auto" max-width="90%">
    <v-card-title class="mb-3">
      <v-row justify="start" justify-md="start" align="baseline">
        <h4 class="ma-3">Detalhes da Categoria: {{ category }}</h4>
        <v-btn fab small @click="newModal = !newModal" v-if="category"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
      </v-row>
    </v-card-title>
    <!-- TODO: TRANSFORMAR EM COMPONENTS -->
    <div v-if="isMobile">
      <v-list>
        <v-list-group v-for="(detail, index) in details" :key="index">
          <template v-slot:activator>
            <v-list-item-content class="my-1">
              <v-list-item-title>{{ detail.name }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-card raised class="mt-2 ml-1">
            <v-list-item>
              <v-list-item-content>
                <v-col cols="12">
                  <p>Icone: {{ detail.titleIcon }}</p>
                </v-col>
                <v-col cols="12">
                  <v-row justify="space-around" justify-md="center">
                    <v-btn x-small text @click="putCategoryDetail(detail)"
                      ><v-icon>mdi-pencil</v-icon>Editar</v-btn
                    >
                    <v-btn
                      x-small
                      text
                      @click="confirmarDeleteCategoryDetail(detail)"
                      ><v-icon>mdi-delete</v-icon>Deletar</v-btn
                    >
                  </v-row>
                </v-col>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-list-group>
      </v-list>
    </div>
    <!-- TODO: TRANSFORMAR EM COMPONENTS -->
    <div v-else>
      <v-data-table
        :headers="headers"
        :items="details"
        hide-default-footer
        no-data-text="Nenhum Detalhe do Produto Encontrado."
      >
        <template v-slot:[`item.titleIcon`]="{ item }">
          <v-img
            :src="item.titleIcon"
            height="7rem"
            width="7rem"
            alt="Imagem não encontrada"
          ></v-img>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-row justify="center" class="py-1 mt-1">
            <v-btn text @click="putCategoryDetail(item)"
              ><v-icon>mdi-pencil</v-icon> Editar</v-btn
            >
          </v-row>
          <v-row justify="center" class="py-1 mb-1">
            <v-btn text @click="confirmarDeleteCategoryDetail(item)"
              ><v-icon>mdi-delete</v-icon> Deletar</v-btn
            >
          </v-row>
        </template>
      </v-data-table>
    </div>
    <Loading v-if="loading" />

    <v-dialog v-model="dialogDeletarDetailCategory" max-width="400px">
      <DeleteModal
        categoria="Detalhe"
        @close-modal="
          dialogDeletarDetailCategory = !dialogDeletarDetailCategory
        "
        @action="deleteCategoryDetail()"
      />
    </v-dialog>

    <v-dialog v-model="dialogDeleteError">
      <DeleteModalError
        @close-modal="dialogDeleteError = !dialogDeleteError"
        categoria="o Detalhe"
      />
    </v-dialog>

    <!-- START POST DETAIL -->
    <v-dialog v-model="newModal" v-if="newModal" max-width="400px">
      <FormularioDetail
        :categoryID="+$route.params.id"
        @fechar-formulario="fecharModal()"
      />
    </v-dialog>
    <!-- END POST DETAIL -->

    <!-- START PUT DETAIL -->
    <v-dialog
      v-model="editarCategoryDetailModal"
      v-if="editarCategoryDetailModal"
      max-width="400px"
    >
      <FormularioDetail
        :categoryDetail="categoryDetailTemp"
        :categoryID="categoryDetailTemp.categoryID"
        @fechar-formulario="fecharModalEdit()"
      />
    </v-dialog>
    <!-- END PUT DETAIL -->
  </v-card>
</template>

<script>
import axios from "axios";
import FormularioDetail from "./FormularioDetail";
import Loading from "@/components/Common/Loading";
import DeleteModal from "@/components/Common/DeleteModal";
import DeleteModalError from "@/components/Common/DeleteModalError";

export default {
  name: "CategoriaDetail",
  data: () => ({
    details: [],
    categorys: [],
    headers: [
      { text: "Detalhe", align: "center", value: "name" },
      { text: "Icone", align: "center", value: "" },
      { text: "Ações", align: "center", value: "actions" },
    ],

    detailTemp: {},
    categoryDetailTemp: null,

    loading: true,
    newModal: false,
    dialogDeletarDetailCategory: false,
    dialogDeleteError: false,
    editarCategoryDetailModal: false,
    deleteModalError: false,
  }),

  methods: {
    async fecharModal() {
      this.newModal = false;
      this.getCategoryDetail();
    },

    fecharModalEdit() {
      this.editarCategoryDetailModal = false;
      this.getCategoryDetail();
    },

    async getCategoryDetail() {
      this.loading = true;
      await axios
        .get(
          `http://localhost:5000/api/CategoryDetail/?categoryID=${this.$route.params.id}`
        )
        .then((response) => {
          this.details = response.data;
          this.loading = false;
        });
    },

    async getCategorys() {
      await axios
        .get(`http://localhost:5000/api/category`)
        .then((response) => (this.categorys = response.data));
    },

    async confirmarDeleteCategoryDetail(categoryDetail) {
      this.dialogDeletarDetailCategory = !this.dialogDeletarDetailCategory;
      this.detailTemp = categoryDetail;
    },

    async deleteCategoryDetail() {
      await axios
        .delete(
          `http://localhost:5000/api/CategoryDetail/${this.detailTemp.id}`
        )
        .then(() => {
          this.dialogDeletarDetailCategory = false;
          this.getCategoryDetail();
        })
        .catch(() => {
          this.dialogDeletarDetailCategory = false;
          this.dialogDeleteError = true;
        });
    },

    async putCategoryDetail(categoryDetail) {
      this.editarCategoryDetailModal = !this.editarCategoryDetailModal;
      this.categoryDetailTemp = categoryDetail;
    },
  },

  computed: {
    category() {
      return this.categorys.filter(
        (category) => category.id === +this.$route.params.id
      )[0]?.name;
    },

    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true;
        default:
          return false;
      }
    },
  },

  async created() {
    await this.getCategoryDetail();
    await this.getCategorys();
  },

  components: {
    FormularioDetail,
    Loading,
    DeleteModal,
    DeleteModalError,
  },
};
</script>