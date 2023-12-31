import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import TestGpt from "../views/TestGpt.vue";
import NewTest from "../views/NewTest.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "testGpt",
    component: TestGpt,
  },
  {
    path: "/test2",
    name: "newTest",
    component: NewTest,
  },
  {
    path: "/test",
    name: "homeView",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
