//import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from '../store/index';
import moshaToast from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';
import 'cropperjs/dist/cropper.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import i18n from './i18n';
import FeatherIconsPlugin from './plugins/feather-icons';
// import VuePhotoSphereViewer from 'vue-photo-sphere-viewer';

// import 'vue-photo-sphere-viewer/dist/photo-sphere-viewer.css';

const app = createApp(App);

axios.defaults.withCredentials = true;
  // app.component('VuePhotoSphereViewer', VuePhotoSphereViewer);

app.use(router);
app.use(VueAxios, axios);
app.use(store);
app.use(moshaToast);
app.use(ElementPlus);
app.use(i18n);
// Install Feather Icons plugin - handles all icon replacements globally
app.use(FeatherIconsPlugin);

app.mount('#app');

// Replace icons after router is ready and on route changes
router.isReady().then(() => {
  app.config.globalProperties.$replaceFeatherIcons();
  // Also replace after a delay to handle async components
  setTimeout(() => {
    app.config.globalProperties.$replaceFeatherIcons();
  }, 300);
});

router.afterEach(() => {
  // Use setTimeout to ensure DOM is fully updated after route change
  setTimeout(() => {
    app.config.globalProperties.$replaceFeatherIcons();
  }, 100);
  // Also replace after a longer delay for async data
  setTimeout(() => {
    app.config.globalProperties.$replaceFeatherIcons();
  }, 500);
});