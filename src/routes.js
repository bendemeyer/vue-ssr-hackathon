import PageNotFound from './pages/PageNotFound.vue'
const Foo = () => import(/* webpackChunkName: "foo-component" */ './pages/Foo.vue');
const Bar = () => import(/* webpackChunkName: "bar-component" */ './pages/Bar.vue');
const Home = () => import(/* webpackChunkName: "home-component" */ './pages/Home.vue');


const routes = [
  { path: '/', component: Home },
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar },
  {path: '/:pathMatch(.*)*', component: PageNotFound}
];

export default routes;
