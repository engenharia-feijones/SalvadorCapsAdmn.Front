<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="categoryDetails"
      no-data-text="Nenhum Detalhe do Produto Encontrado."
      :footer-props="{ 'items-per-page-text': 'Linhas Por Página' }"
      mobile-breakpoint="0"
    >
      <template v-slot:[`item.titleIcon`]="{ item }">
        <v-img
          :src="item.titleIcon"
          height="7rem"
          width="7rem"
          alt="Imagem não encontrada"
          style="display: inline-block"
        ></v-img>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-row justify="center" class="py-1 mt-1">
          <v-btn small text @click="openEditModal(item)"
            ><v-icon>mdi-pencil</v-icon> Editar</v-btn
          >
        </v-row>
        <v-row justify="center" class="py-1 mb-1">
          <v-btn small text @click="openDeleteConfirmModal(item)"
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
      { text: "Detalhe", align: "center", value: "name" },
      { text: "Icone", align: "center", value: "titleIcon" },
      { text: "Ações", align: "center", value: "actions" },
    ],
  }),

  props: {
    categoryDetails: {
      Type: Array,
      default: [],
      required: true,
    },
  },

  methods: {
    openEditModal({ id }) {
      this.$emit("open-edit-modal", {
        id,
      });
    },

     openDeleteConfirmModal({ id }) {
      this.$emit("open-delete-confirm-modal", {
          id
      })
  }
  },
 
};
</script>