
<script>
import { Viewer } from '@photo-sphere-viewer/core';

export default {
  props: {
    panorama: {
      type: String,
      required: true,
    },
  },
  mounted() {
    // Initialize the Photo Sphere Viewer
    // this.viewer = new Viewer({
    //   container: this.$el,
    //   panorama: this.panorama,
    // });
   const baseUrl = 'https://photo-sphere-viewer-data.netlify.app/assets/';

// Initialize the viewer
this.viewer = new Viewer({
  container: this.$el,
  panorama: this.panorama,
  caption: 'Parc national du Mercantour <b>&copy; Damien Sorel</b>',
  loadingImg: baseUrl + 'loader.gif',
  touchmoveTwoFingers: true,
  mousewheelCtrlKey: true,
});

  },
  beforeDestroy() {
    // Destroy the viewer to clean up resources
    if (this.viewer) {
      this.viewer.destroy();
    }
  },
};
</script>

<template>
  <div id="viewer" :style="{ width: '100%', height: '500px' }"></div>
</template>

<style>
/* Optional: Add custom styles for your viewer component */
</style>
