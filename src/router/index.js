import Vue from 'vue'
import VueRouter from 'vue-router'
import Marca from '@/views/Marca/Marca'
import Categoria from '@/views/Categoria/CategoriaView'
import CategoriaDetail from '@/views/Categoria/CategoriaDetailView'
import Produtos from '@/views/Produtos/ProdutosView'
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

    console.log(autenticado)
  })

export default router