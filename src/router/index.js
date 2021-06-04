import Vue from 'vue'
import VueRouter from 'vue-router'
import Marca from '@/views/Marca/Marca'
import Categoria from '@/views/Categoria/Categoria'
import CategoriaDetail from '@/views/CategoriaDetail/CategoriaDetail'
import Produtos from '@/views/Produtos/Produtos'
import Login from '@/views/Login/LoginView'

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        name: "Login",
        component: Login,
    },
    {
        path: '/marca',
        name: 'Marca',
        component: Marca
    },
    {
        path: '/categoria',
        name: 'Categoria',
        component: Categoria
    },
    {
        path: '/categoriaDetalhes/:id',
        name: 'CategoriaDetalhe',
        component: CategoriaDetail
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

router.beforeEach((to, from, next) => {
    // ...
    let autenticado = localStorage.getItem('autenticado') ? true : false
    if (to.name !== 'Login') {
      if (!autenticado) {
        next({name: 'Login'})
      }
    } else {
      if (autenticado) {
        // localStorage.removeItem('autenticado')
        next({name: 'Marca'})
      }
    }
    next()

  })

export default router