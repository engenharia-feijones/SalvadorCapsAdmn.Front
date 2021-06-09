<template>
    <div>
        <h4>Valor: R$ {{ product.price }}</h4>
          <h4 class="mt-2">Detalhes:</h4>
          <p>
            <span v-for="(detail, index) in details" :key="index">{{
              detail.name
            }}</span>
          </p>
          <h4 >Descrição do Produto:</h4>
          <p>{{ product.description }}</p>
    </div>
</template>
<script>
export default {
    name: "ProductInfo",
    props: {
        product: {
            Type: Object,
            required: true, 
        },

        details: {
            Type: Array,
            required: true,
        }
    }
}
</script>