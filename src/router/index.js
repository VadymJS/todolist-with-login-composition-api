import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/login.vue';
import TodoList from '../pages/todoList.vue';

const routes = [
  {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/todo-list/:id',
      name: 'TodoList',
      component: TodoList
    },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
