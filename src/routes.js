import Foo from './pages/Foo.vue';
import Bar from './pages/Bar.vue';
import Home from './pages/Home.vue';
import PageNotFound from './pages/PageNotFound.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar },
  {path: '/:pathMatch(.*)*', component: PageNotFound}
];

export default routes;
