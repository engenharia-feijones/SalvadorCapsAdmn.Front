import Vue from 'vue'
import VueRouter from 'vue-router'

import Marca from '@/components/Marca/Marca'
import Categoria from '@/components/Categoria/Categoria'
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
    }
]

const router = new VueRouter({
    routes
})

export default router