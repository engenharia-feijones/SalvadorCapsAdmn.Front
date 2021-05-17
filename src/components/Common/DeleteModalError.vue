<template>
  <v-card>
    <v-card-title>Erro ao deletar {{ categoria }}</v-card-title>
    <v-card-text
      >{{ mensagem }}</v-card-text
    >
    <v-card-actions>
      <v-btn text @click="closeModal()"
        ><v-icon>mdi-check</v-icon> Ok</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
    name: "DeleteModalError",
    props: {
        categoria: {
            type: String,
            default: "o item"
        },
        mensagem: {
            type: String,
            default: "O item já está sendo usado no banco de dados."
        }
    },

    methods: {
        closeModal() {
            this.$emit("close-modal")
        }
    }
}
</script>