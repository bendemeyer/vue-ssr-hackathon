import Foo from './pages/Foo.vue';
import Bar from './pages/Bar.vue';
import Home from './pages/Home.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar },
];

export default routes;
