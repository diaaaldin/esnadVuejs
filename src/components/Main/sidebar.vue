<script>
import { mapGetters } from "vuex";
import { UserTypeEnum } from '@/config/config.js'

export default {
	data() {
		return {
		}
	},
	mounted() {

	},
	components: {

	},

	emits: {

	},

	created() {

		// Call the function from the store directly when the component is created
		//this.ActionGetBrands();
		console.log("this.getUserInfo?.userType", this.getUserInfo.userType);
		console.log("UserTypeEnum.Admin", UserTypeEnum.Admin);

	},

	computed: {
		...mapGetters("Users", ["getUserInfo"]),

		isAdmin() {
			return this.getUserInfo?.userType === UserTypeEnum.Admin;

		},

		isTeamManager() {
			return this.getUserInfo?.userType === UserTypeEnum.TeamManager;
		},

		isTeamMemper() {
			return this.getUserInfo?.userType === UserTypeEnum.TeamMemper;
		},

		// Show users section for Admin and TeamManager (but hide specific items for TeamManager)
		showUsersSection() {
			return this.isAdmin || this.isTeamManager;
		},

		// Show financial section for Admin and TeamManager
		showFinancialSection() {
			return this.isAdmin || this.isTeamManager;
		},

		// Show code section for Admin and TeamManager
		showCodeSection() {
			return this.isAdmin || this.isTeamManager;
		},
	},
	methods: {

	}
};
</script>
<template>
	<!-- Sidebar -->
	<div class="sidebar" id="sidebar">
		<div class="sidebar-inner slimscroll">
			<div id="sidebar-menu" class="sidebar-menu">

				<ul>
					<li class="menu-title">
						<span>{{ $t('sidebar_main') }}</span>
					</li>

					<li>
						<router-link to="/profile">
							<i data-feather="user"></i>
							<span>{{ $t('sidebar_profile') }}</span>
						</router-link>
					</li>

					<li v-if="showUsersSection">
						<a href="#" class="subdrop"><i data-feather="users"></i> <span> {{ $t('sidebar_users_siction')
						}} </span> <i data-feather="chevron-down" class="menu-arrow"></i></a>
						<ul style="display: none;">
							<li v-if="isAdmin"><router-link to="/admins"><span>{{ $t('sidebar_admins')
										}}</span></router-link></li>
							<li v-if="isAdmin"><router-link to="/teams"><span>{{ $t('sidebar_teams')
										}}</span></router-link></li>
							<li v-if="isAdmin"><router-link to="/team_leaders"><span>{{ $t('sidebar_teamLeaders')
										}}</span></router-link></li>
							<li v-if="!isAdmin"><router-link to="/team_mempers"><span>{{ $t('sidebar_teamMembers')
										}}</span></router-link></li>
						</ul>
					</li>
					<li v-if="showFinancialSection">
						<a href="#" class="subdrop"><i data-feather="dollar-sign"></i> <span> {{
							$t('sidebar_financial_siction') }} </span> <i data-feather="chevron-down"
								class="menu-arrow"></i></a>
						<ul style="display: none;">
							<li><router-link to="/incoms"><span>{{ $t('sidebar_incoms') }}</span></router-link></li>
							<li><router-link to="/outcoms"><span>{{ $t('sidebar_outcoms') }}</span></router-link></li>
							<li><router-link to="/wallets"><span>{{ $t('sidebar_wallets') }}</span></router-link></li>
							<li><router-link to="/financial_summary"><span>{{ $t('sidebar_financial_summary')
										}}</span></router-link></li>
						</ul>
					</li>

					<li>
						<router-link to="/projects_management"><i data-feather="briefcase"></i><span>{{
							$t('sidebar_projects_management') }}</span></router-link>
					</li>
					<li>
						<router-link to="/people_management"><i data-feather="user-check"></i><span>{{
							$t('sidebar_people_management') }}</span></router-link>
					</li>
					<li>
						<router-link to="/reports"> <i data-feather="file-text"></i> <span>{{ $t('sidebar_reports')
						}}</span>
						</router-link>
					</li>

					<!-- <li> 
								<router-link to="/MassageAndNotefication"><i data-feather="message-circle"></i><span>{{ $t('sidebar_notifications_messages') }}</span></router-link>
							</li>
							<li> 
								<router-link to="/payment_movements"><i data-feather="dollar-sign"></i><span>{{ $t('sidebar_payment_movement') }}</span></router-link>
							</li> -->

					<li v-if="showCodeSection">
						<a href="#" class="subdrop"><i data-feather="settings"></i> <span> {{ $t('sidebar_code_siction')
						}} </span> <i data-feather="chevron-down" class="menu-arrow"></i></a>
						<ul style="display: none;">
							<li><router-link to="/funders"><span>{{ $t('sidebar_funders') }}</span></router-link></li>
							<li><router-link to="/currencies"><span>{{ $t('sidebar_currencies') }}</span></router-link>
							</li>
							<li><router-link to="/destinations"><span>{{ $t('sidebar_destinations')
										}}</span></router-link></li>
							<li><router-link to="/fundWays"><span>{{ $t('sidebar_fundWays') }}</span></router-link></li>
							<li><router-link to="/items"><span>{{ $t('sidebar_items') }}</span></router-link></li>
							<li><router-link to="/photographers"><span>{{ $t('sidebar_photographers')
										}}</span></router-link></li>
							<li><router-link to="/projects"><span>{{ $t('sidebar_projects') }}</span></router-link></li>
						</ul>
					</li>

				</ul>
			</div>
		</div>
	</div>
	<!-- /Sidebar -->
</template>
<style scoped></style>