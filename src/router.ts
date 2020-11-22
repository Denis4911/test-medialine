import Vue from "vue";
import VueRouter from "vue-router";
import store from "./store";

Vue.use(VueRouter);
import PageLayout from "@/layouts/page-layout.vue";

const Homepage = () =>
  import(
    /* webpackChunkName: "homepage-view" */ "@/views/homepage/homepage.vue"
  );

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: PageLayout,
      children: [
        {
          path: "",
          name: "index",
          beforeEnter(to, from, next) {
            store.dispatch("getHomepageData").then((response: any) => {
              next();
            });
          },
          component: Homepage
        }
      ]
    }
  ]
});

export default router;
