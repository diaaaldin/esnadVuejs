<template>
  <textarea id="content" rows="100"></textarea>
</template>

<script>
export default {
  name: "CKEditorComponent",

  props: {
    modelValue: {
      type: String,
      required: false,
      default: "", // Initial value from the parent
    },
  },
  emits: ["update:modelValue"], // Emit changes to parent
  mounted() {
    this.initializeCKEditor();
  },
  beforeUnmount() {
    this.destroyCKEditor();
  },
  watch: {
    // Watch for changes in modelValue and update the editor's content
    modelValue(newValue) {
      if (this.editor && newValue !== this.editor.getData()) {
        this.editor.setData(newValue);
      }
    },
  },
  methods: {
    initializeCKEditor() {
      this.$nextTick(() => {
        const contentElement = document.querySelector("#content");
        if (contentElement) {
          window.ClassicEditor.create(contentElement)
            .then((editor) => {
              // Store editor as a non-reactive property
              Object.defineProperty(this, "editor", {
                value: editor,
                writable: true,
                configurable: true,
                enumerable: false,
              });

              // Set initial content from the parent
              this.editor.setData(this.modelValue);

              // Emit changes to the parent component
              this.editor.model.document.on("change:data", () => {
                const updatedContent = this.editor.getData();
                this.$emit("update:modelValue", updatedContent);
              });
              console.log("CKEditor initialized");
            })
            .catch((error) => {
              console.error("CKEditor initialization error:", error);
            });
        } else {
          console.error("Element #content not found");
        }
      });
    },
    destroyCKEditor() {
      if (this.editor) {
        this.editor.destroy()
          .then(() => {
            this.editor = null;
            console.log("CKEditor instance destroyed");
          })
          .catch((error) => {
            console.error("Error destroying CKEditor instance:", error);
          });
      }
    },
  },
};
</script>

<style scoped>
textarea {
  min-height: 200px;
  width: 100%;
}
</style>
