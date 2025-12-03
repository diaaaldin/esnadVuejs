<script>
import Cropper from 'cropperjs';
import { mapGetters, mapActions } from "vuex";
import Swal from 'sweetalert2';

export default {

  data() {
    return {
      selectedFile: null,
      imageSrc: null,
      imageres: null,
      cropper: null,
      imageCropper: null,
      ImageCropperBase64: '',

    };
  },

  components: {
    // FilePond,
  },
  emits: ['IsShow', 'b64image', 'copperImage'],

  methods: {
    onImageLoad() {
      // recreate cropper when the actual image has loaded so canvas uses real dimensions
      if (this.cropper) {
        try { this.cropper.destroy(); } catch (e) { }
        this.cropper = null;
      }
      this.cropper = new Cropper(this.$refs.img, {
        aspectRatio: 3,
        viewMode: 1,           // fit image inside container
        dragMode: 'move',
        background: false,
        responsive: true,
        autoCropArea: 1,       // crop box covers full image initially
        restore: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        minCropBoxWidth: 20,
        minCropBoxHeight: 20,
      });
    },

    closeModal(image) {
      //console.log(image);
      this.$emit('b64image', image);
      this.$emit('IsShow', false);
      this.$emit('copperImage', this.imageCropper);
    },


    fileChanged(e) {
      console.log("image befor cropper : ", e);
      const files = e.target.files || e.dataTransfer.files;
      if (files.length) {
        this.selectedFile = files[0];
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          this.imageSrc = event.target.result;
        };
        fileReader.readAsDataURL(this.selectedFile);
      }
    },

    fileCleared() {
      this.selectedFile = null;
      this.imageSrc = null;
    },

    handleImageCropped() {
      var self = this;
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        // Create a new File object from the blob
        const file = new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' });
        this.imageCropper = file;
        self.passImgAsBase64(file);
      }, 'image/jpeg');
      this.selectedFile = null;
    },

    passImgAsBase64(file) {
      var self = this;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        this.ImageCropperBase64 = reader.result;
        self.closeModal(this.ImageCropperBase64);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    },
  },

  mounted() {
  },

  beforeDestroy() {
  if (this.cropper) try { this.cropper.destroy(); } catch(e) {}
  },

  watch: {
    imageSrc() {
      if (this.imageSrc) {
        this.cropper.replace(this.imageSrc);
      }
    },
  },
    watch: {
    imageSrc() {

     // when imageSrc changes the <img> will load and onImageLoad will recreate the cropper
     // no direct replace here
    },
  },


};
</script>

<template>
  <!-- <FilePond ref="pond" 
			label-idle="Drop file here..."
		  accepted-file-types="image/jpeg, image/png"
			:imageEditor="myEditor" 
/> -->
  <div class="header">
    <label for="fileInput-c" class="custom-file-upload-c">
      <!-- SVG Icon -->
      <svg viewBox="0 0 24 24" width="20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path opacity="0.4"
            d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z"
            fill="#24d627"></path>
          <path
            d="M16 11.25H12.75V8C12.75 7.59 12.41 7.25 12 7.25C11.59 7.25 11.25 7.59 11.25 8V11.25H8C7.59 11.25 7.25 11.59 7.25 12C7.25 12.41 7.59 12.75 8 12.75H11.25V16C11.25 16.41 11.59 16.75 12 16.75C12.41 16.75 12.75 16.41 12.75 16V12.75H16C16.41 12.75 16.75 12.41 16.75 12C16.75 11.59 16.41 11.25 16 11.25Z"
            fill="#24d627"></path>
        </g>
      </svg>
      تحميل الصور
    </label>

    <input type="file" v-on:change="fileChanged" id="fileInput-c" ref="imageInput" accept="image/*">

  </div>

  <div id="container">
    <div class="uploudedImageContaner">
      <h2>{{ $t('cropper_title') }}</h2>
       <img loading="lazy" id="uploadedImage" ref="img" :src="imageSrc" @load="onImageLoad" alt="Uploaded Image">

    </div>
  </div>

  <div id="imageControls">
    <button id="cropButton" v-on:click="handleImageCropped()">{{ $t('general_submit_button') }}</button>
  </div>

</template>
<style scoped>
/* General Styles */
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  color: #333;
  margin: 0;
  padding: 0;
}

/* Header */

/* Header */
.header {
  text-align: center;
  padding: 20px;
  background-color: #EEE !important;
  color: white;
  border-radius: 8px;
  margin-bottom: 20px;
  position: relative;
}

.header h1 {
  margin: 0;
  font-size: 1.8em;
}

.header input[type="file"] {
  display: inline-block;
  margin: 15px 0;
  padding: 10px;
  font-size: 1em;
  border-radius: 5px;
  border: 1px solid #ddd;
}

/* Container */
#container {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding: 20px;
  max-width: 600px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.uploudedImageContaner {
  text-align: center;
}

.uploudedImageContaner h2 {
  font-size: 1.5em;
  color: #555;
  margin-bottom: 15px;
}

#uploadedImage {
  width: 100%;
  height: auto;
  /* optional: limit height but allow full width */
  max-height: 600px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Image Controls */
#imageControls {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  margin: 20px auto 0;
  max-width: 600px;
}

#cropButton,
#cancelButton {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  flex: 1;
  margin: 0 5px;
}

#cropButton {
  color: white;
  border-radius: 30px;
  padding: 8px 30px;
  background-color: var(--main-color);
}

#cropButton:hover {
  background-color: #388E3C;
}

#cancelButton {
  background-color: #F44336;
  color: white;
}

#cancelButton:hover {
  background-color: #D32F2F;
}


.custom-file-upload-c {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: #26d829;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  border: 1px solid #EEE;
  transition: var(--main-transition);
}

#fileInput-c {
  display: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  #container {
    padding: 15px;
  }

  .header input[type="file"] {
    width: 100%;
    margin: 10px 0;
  }

  #imageControls {
    flex-direction: column;
  }

  #cropButton,
  #cancelButton {
    margin: 5px 0;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.5em;
  }

  .uploudedImageContaner h2 {
    font-size: 1.2em;
  }

  #cropButton,
  #cancelButton {
    font-size: 0.9em;
    padding: 10px;
  }
}
</style>