<template>
  <div>
    <v-card-text>
      <v-col cols="12" md="6">
        <v-row justify="start" justify-md="space-around" align="center">
          <v-text-field
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
      :items="categorys"
      :search="filter"
      hide-default-footer
      no-data-text="Nenhuma Categoria Encontrada."
      mobile-breakpoint="0"
    >
      <template #[`item.desktopSpotlightImage`]="{ item }">
        <v-img
          :src="item.desktopSpotlightImage + '#' + item.id"
          height="7rem"
          width="7rem"
          alt="Imagem não encontrada"
          style="display: inline-block"
        ></v-img>
      </template>

      <template v-slot:[`item.mobileSpotlightImage`]="{ item }">
        <v-img
          :src="item.mobileSpotlightImage + '#'"
          height="7rem"
          width="7rem"
          alt="Imagem não encontrada"
          style="display: inline-block"
        ></v-img>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-row justify="center" class="py-1 mt-1">
          <v-btn small text @click="openEditCategoryModal(item)"
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
  </div>
</template>

<script>
export default {
  data: () => ({
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

    filter: "",
  }),

  props: {
    categorys: {
      Type: Array,
      default: [],
      required: true
    }
  },

  methods: {
    openEditCategoryModal({ id }) {
      this.$emit("open-edit-category-modal", {
        id
      })
    },

    confirmarDeletarCategoria({ id }) {
      this.$emit("open-delete-confirm-modal", {
        id
      })
    }
  }
};
</script>