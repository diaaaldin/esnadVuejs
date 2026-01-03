<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { UserTypeEnum } from '@/config/config.js'

export default {
    data() {
		return {	
            selectedTeamId: 0,
            StatisticsData : {
                totalProject: 0,
                totalFunder: 0,
                totalPeopleThisMonth: 0,
                totalSpend: [],
                totalBalance: [],
            }
		}
	},
	async mounted() {
        // Load teams if admin
        if (this.isAdmin) {
           await this.loadTeams();
        }
        // Load statistics on mount
        this.statisticsFunc();
    },
    components:{

    }, 

	emits:{
       
    },

	created() {
        // Component created
    },
	
    computed:{
		...mapGetters("Users", ["getUserInfo", "getTeamsData"]),

		isAdmin() {
			return this.getUserInfo?.userType === UserTypeEnum.Admin;
		},

		isTeamManager() {
			return this.getUserInfo?.userType === UserTypeEnum.TeamManager;
		},

		isTeamMemper() {
			return this.getUserInfo?.userType === UserTypeEnum.TeamMemper;
		},

		userTeamId() {
			return this.getUserInfo?.teamId || 0;
		},

		currentTeamId() {
			// For admin: use selectedTeamId, for non-admin: use userTeamId
			return this.isAdmin ? this.selectedTeamId : this.userTeamId;
		},

		showSpendAndBalanceCards() {
			// Show for Admin and TeamManager, hide for TeamMemper
			return this.isAdmin || this.isTeamManager;
		},
    },
    methods:{
	
		...mapActions("Statistics", ["HomeStatisticsInfo"]),
		...mapActions("Users", ["GetTeams"]),

		loadTeams() {
			this.GetTeams({ name: "" }).catch(error => {
				console.error("Error loading teams:", error);
			});
		},

		onTeamChange() {
			// Reload statistics when team changes
			this.statisticsFunc();
		},

        statisticsFunc(){
            // Use currentTeamId (selectedTeamId for admin, userTeamId for non-admin)
            const teamId = this.currentTeamId || 0;
            
            this.HomeStatisticsInfo(teamId).then(Response => {
				this.StatisticsData.totalProject = Response.totalProject || 0;
				this.StatisticsData.totalFunder = Response.totalFunder || 0;
				this.StatisticsData.totalPeopleThisMonth = Response.totalPeopleThisMonth || 0;
				this.StatisticsData.totalSpend = Response.totalSpend || [];
				this.StatisticsData.totalBalance = Response.totalBalance || [];
			}).catch(error => {
				console.error("Error loading statistics:", error);
			});
        },
        formatCurrency(value) {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: "ILS",
				// Allows up to 1 decimal digit
				maximumFractionDigits: 0
			}).format(value);
		},

    }
};
</script>
<template>
     <div class="row">
                    <!-- Team Select (Admin Only) -->
                    <div class="col-12 mb-3" v-if="isAdmin">
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-4">
                                        <label>الفريق</label>
                                        <select v-model="selectedTeamId" class="form-control" @change="onTeamChange()">
                                            <option value="0">-- إختر فريق --</option>
                                            <option v-for="team in getTeamsData" :key="team.id" :value="team.id">{{ team.name }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Total Project Card -->
                    <div class="col-xl-4 col-sm-6 col-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="dash-widget-header">
                                    <span class="dash-widget-icon text-primary border-primary">
                                        <img src="/images/icons-projects.png" alt="Projects" width="40" height="40">
                                    </span>
                                    <div class="dash-count">
                                        <h3>{{ StatisticsData.totalProject }}</h3>
                                    </div>
                                </div>
                                <div class="dash-widget-info">
                                    <h6 class="text-muted">{{ $t('home_card_1') }}</h6>
                                    <div class="progress progress-sm">
                                        <div class="progress-bar bg-primary w-50"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  
                    <!-- Total Funder Card -->
                    <div class="col-xl-4 col-sm-6 col-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="dash-widget-header">
                                    <span class="dash-widget-icon text-success">
                                        <img src="/images/icons-partner.png" alt="Projects" width="40" height="40">

                                    </span>
                                    <div class="dash-count">
                                        <h3>{{ StatisticsData.totalFunder }}</h3>
                                    </div>
                                </div>
                                <div class="dash-widget-info">
                                    <h6 class="text-muted">{{ $t('home_card_2') }}</h6>
                                    <div class="progress progress-sm">
                                        <div class="progress-bar bg-success w-50"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Total People This Month Card -->
                    <div class="col-xl-4 col-sm-6 col-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="dash-widget-header">
                                    <span class="dash-widget-icon text-info border-info">
                                        <img src="/images/icons-people.png" alt="Projects" width="40" height="40">
                                    </span>
                                    <div class="dash-count">
                                        <h3>{{ StatisticsData.totalPeopleThisMonth }}</h3>
                                    </div>
                                </div>
                                <div class="dash-widget-info">
                                    <h6 class="text-muted">{{ $t('home_card_3') }}</h6>
                                    <div class="progress progress-sm">
                                        <div class="progress-bar bg-info w-50"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Total Spend Card (with list inside) -->
                    <div class="col-xl-6 col-sm-12 col-12" v-if="showSpendAndBalanceCards && StatisticsData.totalSpend && StatisticsData.totalSpend.length > 0">
                        <div class="card">
                            <div class="card-body">
                                <div class="dash-widget-header mb-3">
                                    <span class="dash-widget-icon text-danger border-danger">
                                        <img src="/images/icons-dollar.png" alt="Projects" width="40" height="40">
                                    </span>
                                    <div class="dash-count">
                                        <h5 class="mb-0">إجمالي الإنفاق</h5>
                                    </div>
                                </div>
                                <div class="dash-widget-info">
                                    <div class="table-responsive">
                                        <table class="table table-sm table-hover">
                                            <thead>
                                                <tr>
                                                    <th>الاسم</th>
                                                    <th class="text-right">المبلغ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(spend, index) in StatisticsData.totalSpend" :key="'spend-' + index">
                                                    <td>{{ spend.name || 'غير محدد' }}</td>
                                                    <td class="text-right font-weight-bold">{{ formatCurrency(spend.amount) || 0 }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                    <!-- Total Balance Card (with list inside) -->
                    <div class="col-xl-6 col-sm-12 col-12" v-if="showSpendAndBalanceCards && StatisticsData.totalBalance && StatisticsData.totalBalance.length > 0">
                        <div class="card">
                            <div class="card-body">
                                <div class="dash-widget-header mb-3">
                                    <span class="dash-widget-icon text-warning border-warning">
                                        <img src="/images/icons-fund.png" alt="Projects" width="40" height="40">
                                    </span>
                                    <div class="dash-count">
                                        <h5 class="mb-0">إجمالي الرصيد</h5>
                                    </div>
                                </div>
                                <div class="dash-widget-info">
                                    <div class="table-responsive">
                                        <table class="table table-sm table-hover">
                                            <thead>
                                                <tr>
                                                    <th>الاسم</th>
                                                    <th class="text-right">الرصيد</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(balance, index) in StatisticsData.totalBalance" :key="'balance-' + index">
                                                    <td>{{ balance.name || 'غير محدد' }}</td>
                                                    <td class="text-right font-weight-bold">{{ formatCurrency(balance.amount) || 0 }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
</template>
<style scoped>


</style> 