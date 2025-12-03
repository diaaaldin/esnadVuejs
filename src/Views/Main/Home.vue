<script>
//import { RouterView } from 'vue-router';
import { mapState, mapGetters, mapActions } from "vuex";
import HomeHeader from '@/components/Home/homeHeader.vue';
import HomeCard from '@/components/Home/homeCard.vue';

export default {
    data() {
		return {
			
		}
	},
    components:{
        HomeHeader,
        HomeCard,
    },
	created() {
        console.log( "getUserInfo", this.getUserInfo);	
    },
    computed:{
		...mapGetters("Users", ["getUserInfo"]),
    },
	
    methods:{		
	
    }
};
</script>

<template>
        <HomeHeader></HomeHeader>
        <HomeCard></HomeCard>
</template>

<style scoped>

 </style>