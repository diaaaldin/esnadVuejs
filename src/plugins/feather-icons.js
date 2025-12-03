import feather from 'feather-icons';

/**
 * Global Feather Icons Plugin for Vue 3
 * Automatically replaces all feather icons in all components
 */
export default {
  install(app) {
    // Debounce timer to avoid excessive calls
    let replaceTimer = null;
    
    // Helper function to replace icons with proper timing
    const replaceIcons = () => {
      // Clear any pending timer
      if (replaceTimer) {
        clearTimeout(replaceTimer);
      }
      
      // Use setTimeout to ensure DOM is fully updated, especially for async data
      replaceTimer = setTimeout(() => {
        // Replace all feather icons in the document
        // Default size is 20px, stroke-width 1.5
        feather.replace({ 
          'stroke-width': 1.5,
          'width': 20,
          'height': 20
        });
      }, 100);
    };

    // Global mixin to automatically replace icons in all components
    app.mixin({
      mounted() {
        // Replace icons after component is mounted
        this.$nextTick(() => {
          replaceIcons();
        });
        
        // Also replace after delays to handle async data loading
        setTimeout(() => {
          replaceIcons();
        }, 200);
        
        setTimeout(() => {
          replaceIcons();
        }, 500);
      },
      updated() {
        // Always replace icons on update to handle async data loading
        // This ensures icons are replaced when component data changes
        this.$nextTick(() => {
          replaceIcons();
        });
        
        // Also replace after a delay for async updates
        setTimeout(() => {
          replaceIcons();
        }, 200);
      }
    });

    // Method to manually replace icons (can be called from anywhere)
    app.config.globalProperties.$replaceFeatherIcons = () => {
      replaceIcons();
    };
  }
};

