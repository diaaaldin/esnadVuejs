<script>
//import { mapState, mapGetters, mapActions } from "vuex";

export default {
    data() {
		return {	
            		
		}
	},
	mounted() {
	
    },
    components:{

    }, 

	emits:{
       
    },

	created() {
        // Call the function from the store directly when the component is created
     
    },
	
    computed:{
		//...mapGetters(),
		//...mapGetters(),

    },
    methods:{
		//...mapActions(),

    }
};
</script>
<template>
         <!-- Page Header -->
         <div class="page-header">
                    <div class="row">
                        <div class="col-sm-12">
                            <h3 class="page-title">{{ $t('home_header_title_1') }}</h3>
                            <ul class="breadcrumb">
                                <li class="breadcrumb-item active">{{ $t('home_header_title_2') }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- /Page Header -->
</template>
<style scoped>
</style> 