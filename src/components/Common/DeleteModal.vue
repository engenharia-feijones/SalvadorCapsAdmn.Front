<template>
  <v-card>
    <v-card-title>Deletar {{ categoria }}</v-card-title>
    <v-card-text
      >Não sera possivel recuperar os dados ja cadastrados apos deletar esse
      item.
       <v-card-actions class="mt-3">
        <v-row justify="end" justify-md="start">
          <v-btn text color="blue" @click="closeModal()">Cancelar</v-btn>
          <v-btn text color="red" @click="confirm()">Deletar</v-btn>
        </v-row>
      </v-card-actions>
      </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "DeleteModal",
  props: {
    categoria: {
      type: String,
      default: "",
    },
  },

  methods: {
    closeModal() {
      this.$emit("close-modal");
    },

    confirm() {
      this.$emit("action");
    },
  },
};
</script>