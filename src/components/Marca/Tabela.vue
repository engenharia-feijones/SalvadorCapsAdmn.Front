<template>
  <div>
    <v-card-text>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          placeholder="Pesquisar Marcas..."
          clearable
          prepend-inner-icon="mdi-magnify"
          no-data-text="teste"
        ></v-text-field>
      </v-col>
    </v-card-text>
    <v-data-table
      :headers="cabecalho"
      :items="brands"
      :search="search"
      sort-by="nome"
      mobile-breakpoint="0"
      hide-default-footer
      no-data-text="Nenhuma Marca Encontrada."
    >
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

      <template v-slot:[`item.promo`]="{ item }">
        <v-checkbox v-model="item.promo" disabled value></v-checkbox>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-row justify="center" class="py-1 mt-1">
          <v-btn small text @click="openEditBrandModal(item)"
            ><v-icon>mdi-pencil</v-icon> Editar</v-btn
          >
        </v-row>
        <v-row justify="center" class="py-1 mb-1">
          <v-btn small text @click="openDeleteModal(item)"
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
    search: "",
    cabecalho: [
      { text: "Nome", align: "start", value: "name" },
      {
        text: "Imagem Desktop",
        align: "Start",
        value: "desktopSpotlightImage",
      },
      { text: "Imagem Mobile", align: "Start", value: "mobileSpotlightImage" },
      {
        text: "Promocional",
        align: "Start",
        value: "promo",
      },
      { text: "Ações", align: "center", value: "actions" },
    ],
  }),

  props: {
    brands: {
      Type: Array,
      default: [],
      required: true,
    },
  },

  methods: {
      openEditBrandModal({ id }) {
          this.$emit("open-edit-brand-modal", {
              id
          })
      },

      openDeleteModal({ id }) {
          this.$emit("open-confirm-delete-modal", {
              id
          })
      }
  }
};
</script>