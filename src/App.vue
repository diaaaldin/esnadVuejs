<script >
import {reactive , provide} from 'vue'
export default{
components:{
},
computed:{

},
mounted() {
        this.toggleDirectionAndCss();
    },
    methods: {
        toggleDirectionAndCss() {
            // Check the selected language in local storage or default to 'en'
            const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

            // // Set the correct CSS file and document direction based on the selected language
            // if (selectedLanguage === 'ar') {
            //     import('./assets/css/rtlStyle.css');
            // } else {
            //     //import('./assets/css/ltrStyle.css');
            // }
        }
    }
};
</script>

<template>
<router-view/> 
  
</template>

<style scoped>

</style>
