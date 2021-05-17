<template>
  <div>
    <v-dialog persistent v-model="loadingModal" max-width="400px">
      <v-card>
        <v-card-title>
          <v-col cols="12">
            <h3 class="text-center">{{ title }}</h3>
          </v-col>
          <v-progress-linear indeterminate height="3"></v-progress-linear>
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: "Loading",
  data: () => ({
    loadingModal: true,
  }),

  props: {
      title: {
          Type: String,
          default: "Buscando Dados"
      }
  }
};
</script>
