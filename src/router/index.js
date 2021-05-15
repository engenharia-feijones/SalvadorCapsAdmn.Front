import Vue from 'vue'
import VueRouter from 'vue-router'

import Marca from '@/views/Marca/Marca'
import Categoria from '@/views/Categoria/CategoriaView'
import Produtos from '@/views/Produtos/ProdutosView'
Vue.use(VueRouter)

const routes = [
    {
        path: '',
        name: 'Marca',
        component: Marca
    },
    {
        path: '/categoria',
        name: 'Categoria',
        component: Categoria
    },
    {
        path: '/produtos',
        name: "Produto",
        component: Produtos
    }
]

const router = new VueRouter({
    routes
})

export default router