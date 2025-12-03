<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { ElLoading } from 'element-plus';
import { UserStatusEnum } from '@/config/config.js'

export default {
	data() {
		return {
			data: {
				id: 0,
				name: "",
				note: "",
			},

			dataSearch: {
				name: "",
			},

			dataNewPassword: {
				userId: 0,
				email: "",
				mobile: "",
				sendWay: 0,
				oldPassword: "",
				newPassword: "",
			},

			rolePermissionData: {
				userId: 0,
				permissionsId: null
			},

			checkModulePerAll: {}, // Tracks whether all permissions for a module are selected
			isIndeterminateStates: {}, // Tracks indeterminate state for each module
			checkedPermissions: [], // Tracks selected permissions across all modules

			updateCheckModulePerAll: {}, // Tracks whether all permissions for a module are selected
			updateIsIndeterminateStates: {},
			updateCheckedPermissions: [],
			emailError: '',
			//////////////////////////

			UserStatus: UserStatusEnum,
			stateCities: [],
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
		this.initFunc();
	},

	computed: {
		...mapGetters("Roles", ["getUserPermissionsData"]),
		...mapGetters("Users", ["getdata", "getTeamsData"]),

	},
	methods: {
		...mapActions("Roles", ["GetAdminPermissions", "UpdateUserPermission"]),
		...mapActions("Users", ["GetTeams", "CreateTeam", "UpdateTeam", "DeleteTeam"]),

		initFunc() {
			const loading = ElLoading.service({
				lock: true,
				background: 'rgba(0, 0, 0, 0.7)',
				text: "",
			});
			// this.GetAdminPermissions();
			// this.GetSendMessageWays();
			this.GetTeams(this.dataSearch).then(Response => {
				loading.close();
				 console.log("data : " , this.getTeamsData);
			}).catch(error => {
				if (error.response && error.response.status === 401) {
					this.$moshaToast(this.$t('general_user_not_allow_error_message'), {
						hideProgressBar: 'false',
						position: 'top-center',
						showIcon: 'true',
						swipeClose: 'true',
						type: 'warning',
						timeout: 3000,
					});
				} else {
					// Handle other errors with the provided message from the response
					this.$moshaToast(error.response?.data?.message || 'An error occurred', {
						hideProgressBar: 'false',
						position: 'top-center',
						showIcon: 'true',
						swipeClose: 'true',
						type: 'warning',  // Default type is 'warning'
						timeout: 3000,
					});
				}
				loading.close();
			});
		},
		GetData() {
			this.GetTeams(this.dataSearch).then(Response => {
			}).catch(error => {
				if (error.response && error.response.status === 401) {
					this.$moshaToast(this.$t('general_user_not_allow_error_message'), {
						hideProgressBar: 'false',
						position: 'top-center',
						showIcon: 'true',
						swipeClose: 'true',
						type: 'warning',
						timeout: 3000,
					});
				} else {
					// Handle other errors with the provided message from the response
					this.$moshaToast(error.response?.data?.message || 'An error occurred', {
						hideProgressBar: 'false',
						position: 'top-center',
						showIcon: 'true',
						swipeClose: 'true',
						type: 'warning',  // Default type is 'warning'
						timeout: 3000,
					});
				}
			});
		},
		SearchChange() {
			this.GetData();
		},


		createFunc() {
			if (this.checkAddValidation()) {
				const loading = ElLoading.service({
					lock: true,
					background: 'rgba(0, 0, 0, 0.7)',
					text: "",
				});
				console.log("this.data : ", this.data);
				this.CreateTeam(this.data).then(Response => {
					console.log(Response);
					this.$moshaToast('تم عملية الإضافة بنجاح', {
						hideProgressBar: 'false',
						showIcon: 'true',
						swipeClose: 'true',
						type: 'success',
						timeout: 3000,
					});
					loading.close();
					this.GetTeams(this.dataSearch);
					$('#add_modal').modal('hide');
					// $('.close').trigger( "click" );
				}).catch(error => {
					if (error.response && error.response.status === 401) {
						this.$moshaToast(this.$t('general_user_not_allow_error_message'), {
							hideProgressBar: 'false',
							position: 'top-center',
							showIcon: 'true',
							swipeClose: 'true',
							type: 'warning',
							timeout: 3000,
						});
					} else {
						// Handle other errors with the provided message from the response
						this.$moshaToast(error.response?.data?.message || 'An error occurred', {
							hideProgressBar: 'false',
							position: 'top-center',
							showIcon: 'true',
							swipeClose: 'true',
							type: 'warning',  // Default type is 'warning'
							timeout: 3000,
						});
					}
					loading.close();
				});

			}
		},
		checkAddValidation() {
			if (this.data.name == "") {
				this.$moshaToast('أدخل الإسم', {
					hideProgressBar: 'false',
					position: 'top-center',
					showIcon: 'true',
					swipeClose: 'true',
					type: 'warning',
					timeout: 3000,
				});
				return false;
			}
			return true;
		},

		UpdateFunc() {
			if (this.checkUpdateValidation()) {

				const loading = ElLoading.service({
					lock: true,
					background: 'rgba(0, 0, 0, 0.7)',
					text: "",
				});

				this.UpdateTeam(this.data).then(Response => {
					this.$moshaToast('تمت عملية التعديل بنجاح', {
						hideProgressBar: 'false',
						showIcon: 'true',
						swipeClose: 'true',
						type: 'success',
						timeout: 3000,
					});
					loading.close();
					this.GetTeams(this.dataSearch);
					$('#edit_modal').modal('hide');
					// $('.close').trigger( "click" );
				}).catch(error => {
					if (error.response && error.response.status === 401) {
						this.$moshaToast(this.$t('general_user_not_allow_error_message'), {
							hideProgressBar: 'false',
							position: 'top-center',
							showIcon: 'true',
							swipeClose: 'true',
							type: 'warning',
							timeout: 3000,
						});
					} else {
						// Handle other errors with the provided message from the response
						this.$moshaToast(error.response?.data?.message || 'An error occurred', {
							hideProgressBar: 'false',
							position: 'top-center',
							showIcon: 'true',
							swipeClose: 'true',
							type: 'warning',  // Default type is 'warning'
							timeout: 3000,
						});
					}
					loading.close();
				});
			}
		},
		checkUpdateValidation() {
			if (this.data.id == 0) {
				this.$moshaToast('خطأ في تحديد الفريق', {
					hideProgressBar: 'false',
					position: 'top-center',
					showIcon: 'true',
					swipeClose: 'true',
					type: 'warning',
					timeout: 3000,
				});
				return false;
			} else if (this.data.name == "") {
				this.$moshaToast('أدخل الإسم', {
					hideProgressBar: 'false',
					position: 'top-center',
					showIcon: 'true',
					swipeClose: 'true',
					type: 'warning',
					timeout: 3000,
				});
				return false;
			}
			return true;
		},

		DeleteFunc() {

			if (this.checkDeleteValidation()) {

				const loading = ElLoading.service({
					lock: true,
					background: 'rgba(0, 0, 0, 0.7)',
					text: "",
				});

				this.DeleteTeam(this.data.id).then(Response => {
					console.log(Response);
					this.$moshaToast('تمت عملية الحذف بنجاح', {
						hideProgressBar: 'false',
						showIcon: 'true',
						swipeClose: 'true',
						type: 'success',
						timeout: 3000,
					});
					loading.close();
					this.GetTeams(this.dataSearch);
					$('#delete_modal').modal('hide');
					// $('.btn-danger').trigger("click");
				}).catch(error => {
					if (error.response && error.response.status === 401) {
						this.$moshaToast(this.$t('general_user_not_allow_error_message'), {
							hideProgressBar: 'false',
							position: 'top-center',
							showIcon: 'true',
							swipeClose: 'true',
							type: 'warning',
							timeout: 3000,
						});
					} else {
						// Handle other errors with the provided message from the response
						this.$moshaToast(error.response?.data?.message || 'An error occurred', {
							hideProgressBar: 'false',
							position: 'top-center',
							showIcon: 'true',
							swipeClose: 'true',
							type: 'warning',  // Default type is 'warning'
							timeout: 3000,
						});
					}
					loading.close();
				});
			}
		},
		checkDeleteValidation() {
			if (this.data.id == 0) {
				this.$moshaToast('هنالك خطأ في التحديد', {
					hideProgressBar: 'false',
					position: 'top-center',
					showIcon: 'true',
					swipeClose: 'true',
					type: 'warning',
					timeout: 3000,
				});
				return false;
			}
			return true;
		},

		// UpdatePermissionsFunc() {
		// 	this.rolePermissionData.permissionsId = this.updateCheckedPermissions;
		// 	if (this.checkUpdatePermissionsValidation()) {
		// 		const loading = ElLoading.service({
		// 			lock: true,
		// 			background: 'rgba(0, 0, 0, 0.7)',
		// 			text: "",
		// 		});
		// 		this.UpdateUserPermission(this.rolePermissionData).then(Response => {
		// 			this.$moshaToast('Updated successfully', {
		// 				hideProgressBar: 'false',
		// 				showIcon: 'true',
		// 				swipeClose: 'true',
		// 				type: 'success',
		// 				timeout: 3000,
		// 			});
		// 			loading.close();
		// 			this.GetData();
		// 			$('#update_role').modal('hide');
		// 		}).catch(error => {
		// 			if (error.response && error.response.status === 401) {
		// 				this.$moshaToast(this.$t('general_user_not_allow_error_message'), {
		// 					hideProgressBar: 'false',
		// 					position: 'top-center',
		// 					showIcon: 'true',
		// 					swipeClose: 'true',
		// 					type: 'warning',
		// 					timeout: 3000,
		// 				});
		// 			} else {
		// 				// Handle other errors with the provided message from the response
		// 				this.$moshaToast(error.response?.data?.message || 'An error occurred', {
		// 					hideProgressBar: 'false',
		// 					position: 'top-center',
		// 					showIcon: 'true',
		// 					swipeClose: 'true',
		// 					type: 'warning',  // Default type is 'warning'
		// 					timeout: 3000,
		// 				});
		// 			}
		// 			loading.close();
		// 		});
		// 	}
		// },
		// checkUpdatePermissionsValidation() {
		// 	if (this.rolePermissionData.userId == 0) {
		// 		this.$moshaToast('error in select user', {
		// 			hideProgressBar: 'false',
		// 			position: 'top-center',
		// 			showIcon: 'true',
		// 			swipeClose: 'true',
		// 			type: 'warning',
		// 			timeout: 3000,
		// 		});
		// 		return false;
		// 	} else if (!this.rolePermissionData.permissionsId || this.rolePermissionData.permissionsId.length === 0) {
		// 		this.$moshaToast('add user permission first', {
		// 			hideProgressBar: 'false',
		// 			position: 'top-center',
		// 			showIcon: 'true',
		// 			swipeClose: 'true',
		// 			type: 'warning',
		// 			timeout: 3000,
		// 		});
		// 		return false;
		// 	}
		// 	return true;
		// },

		async selectItem(id) {
			this.clearData();
			const foundItem = this.getTeamsData.find(element => element.id === id);
			console.log("foundItem :", foundItem);
			if (foundItem) {
				this.data.id = foundItem.id;
				this.data.name = foundItem.name;
				this.data.note = foundItem.note || "";
			}
		},
		// selectItemForRole(id) {
		// 	this.clearData();
		// 	const selectedUser = this.getUsersData.users.data.find(x => x.id === id);
		// 	if (selectedUser) {
		// 		this.rolePermissionData.userId = selectedUser.id;
		// 		// this.rolePermissionData.permissions = selectedUser.permissions;
		// 	}
		// 	// console.log("selectedUser : " , selectedUser);
		// 	this.updateCheckedPermissions = selectedUser.permissions;
		// 	// You can also update other states (e.g., indeterminate state) if needed
		// 	this.updateIndeterminateStatesForAll();

		// },

		clearData() {
			this.data.id = 0;
			this.data.name = "";
			this.data.note = "";
		},

		////////////////////////
		// checkbox method start
		// handleCheckAllModuleChange(moduleId) {
		// 	// Find the module data using moduleId
		// 	const moduleData = this.getUserPermissionsData.find(element => element.moduleId === moduleId);
		// 	const modulePerIds = moduleData.modulePermissions.map(x => x.id); // Use 'id' instead of 'pId'

		// 	if (this.checkModulePerAll[moduleId]) {
		// 		// Select all permissions in the module
		// 		this.checkedPermissions = [...new Set([...this.checkedPermissions, ...modulePerIds])];
		// 	} else {
		// 		// Deselect all permissions in the module
		// 		this.checkedPermissions = this.checkedPermissions.filter(pId => !modulePerIds.includes(pId));
		// 	}
		// 	// Update indeterminate states after changing
		// 	this.updateIndeterminateStates(moduleId);
		// },
		// handleCheckedPermissionsChange(moduleId) {
		// 	this.updateIndeterminateStates(moduleId);
		// },
		// updateIndeterminateStates(moduleId) {
		// 	const moduleData = this.getUserPermissionsData.find(element => element.moduleId === moduleId);
		// 	const modulePerIds = moduleData.modulePermissions.map(x => x.id);  // Use 'id' instead of 'pId'
		// 	const checkedCount = modulePerIds.filter(pId => this.checkedPermissions.includes(pId)).length;

		// 	this.checkModulePerAll[moduleId] = checkedCount === modulePerIds.length;
		// 	this.isIndeterminateStates[moduleId] = checkedCount > 0 && checkedCount < modulePerIds.length;
		// },
		// checkbox method end

		//////////////////
		// checkbox method start
		// handleCheckAllModuleChangeUpdate(moduleId) {
		// 	// Find the module data using moduleId
		// 	const moduleData = this.getUserPermissionsData.find(element => element.moduleId === moduleId);
		// 	const modulePerIds = moduleData.modulePermissions.map(x => x.id); // Use 'id' instead of 'pId'

		// 	if (this.updateCheckModulePerAll[moduleId]) {
		// 		// Select all permissions in the module
		// 		this.updateCheckedPermissions = [
		// 			...new Set([...this.updateCheckedPermissions, ...modulePerIds]),
		// 		];
		// 	} else {
		// 		// Deselect all permissions in the module
		// 		this.updateCheckedPermissions = this.updateCheckedPermissions.filter(
		// 			pId => !modulePerIds.includes(pId)
		// 		);
		// 	}

		// 	// Update indeterminate states after changing
		// 	this.updateIndeterminateStatesUpdate(moduleId);
		// },
		// handleCheckedPermissionsChangeUpdate(moduleId) {
		// 	// Update the indeterminate state after any permission change
		// 	this.updateIndeterminateStatesUpdate(moduleId);
		// },
		// updateIndeterminateStatesUpdate(moduleId) {
		// 	const moduleData = this.getUserPermissionsData.find(
		// 		element => element.moduleId === moduleId
		// 	);
		// 	const modulePerIds = moduleData.modulePermissions.map(x => x.id); // Use 'id' instead of 'pId'

		// 	const checkedCount = modulePerIds.filter(pId => this.updateCheckedPermissions.includes(pId))
		// 		.length;

		// 	// If all permissions are selected, mark the "Select All" checkbox as checked
		// 	this.updateCheckModulePerAll[moduleId] = checkedCount === modulePerIds.length;

		// 	// If some permissions are selected but not all, mark the "Select All" checkbox as indeterminate
		// 	this.updateIsIndeterminateStates[moduleId] = checkedCount > 0 && checkedCount < modulePerIds.length;
		// },
		// updateIndeterminateStatesForAll() {
		// 	this.getUserPermissionsData.forEach(module => {
		// 		this.updateIndeterminateStatesUpdate(module.moduleId);
		// 	});
		// },
		// checkbox method end


		validateEmail(email) {
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

			// Check if the input is empty
			if (!this.data.email) {
				this.emailError = '';
				return false;
			}
			// Check if the input does not match the email format
			else if (!emailPattern.test(this.data.email)) {
				this.emailError = this.$t('user_data_check_email_validation');
				return false;
			}
			// Clear the error if the input is valid
			else {
				this.emailError = '';
				return true;
			}
		},
		filterMobileInput(event) {
			const input = event.target.value.replace(/\D/g, '').slice(0, 10);
			this.data.mobile = input;
		},
		filterSSNInput(event) {
			const input = event.target.value.replace(/\D/g, '').slice(0, 9);
			this.data.ssn = input;
		},
		checkSSN(ssn) {
			let result = false;
			// Check if the length is 9
			if (ssn.length !== 9) {
				return result;
			}
			// Check if ssn converts to integer as 0
			if (parseInt(ssn) === 0) {
				return result;
			}
			let b = 0;
			for (let i = 0; i < ssn.length - 1; i++) {
				let a = parseInt(ssn.charAt(i));
				if (i % 2 === 1) {
					a *= 2;
					if (a > 9) {
						const v = a % 10;
						const v2 = Math.floor(a / 10);
						a = v + v2;
					}
				}
				b += a;
			}
			b = b % 10;
			b = 10 - b;
			if (b === 10) {
				b = 0;
			}
			if (b === parseInt(ssn.charAt(ssn.length - 1))) {
				result = true;
			}
			return result;
		},



	}
};
</script>
<template>
	<!-- Page Header -->
	<div class="page-header">
		<div class="row">
			<div class="col-sm-12">
				<h3 class="page-title">إدارة الفرق</h3>
				<!-- <ul class="breadcrumb">
					<li class="breadcrumb-item active">إدارة مديرين النظام</li>
				</ul> -->
			</div>
			<div class="col-12 row mt-3">
				<!-- Name filter -->
				<div class="col-12 col-sm-6 col-md-3 mb-2">
					<label>الإسم</label>
					<input @input="SearchChange" v-model="dataSearch.name" type="text" class="form-control"
						placeholder="الإسم">
				</div>

				<!-- Action Buttons -->
				<div class="col-12 mt-2">
					<a href="#add_modal" data-toggle="modal" v-on:click="clearData()"
						class="btn btn-primary float-left">إضافة</a>
				</div>
			</div>

		</div>
	</div>
	<!-- /Page Header -->
	<div class="row">
		<div class="col-sm-12">
			<div class="card">
				<div class="card-body">
					<div class="table-responsive">
						<table class="datatable table table-hover table-center mb-0">
							<thead>
								<tr>
									<th class="text-center">ID</th>
									<th class="text-center">الإسم</th>
									<th class="text-center">الملاحظات</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in getTeamsData">
									<td class="text-center">{{ index + 1 }}</td>
									<td class="text-center">{{ item.name }}</td>
									<td class="text-center">{{ item.note }}</td>

									<td class="text-right">
										<div class="actions">
											<!-- <a class="btn btn-sm bg-success-light" data-toggle="modal"
												href="#update_role" v-on:click="selectItemForRole(item.id)">
												<i data-feather="edit"></i> تعديل الصلاحية
											</a> -->
											<a class="btn btn-sm bg-success-light" data-toggle="modal"
												href="#edit_modal" v-on:click="selectItem(item.id)">
												<i data-feather="edit"></i> تعديل
											</a>
											<a data-toggle="modal" href="#delete_modal"
												class="btn btn-sm bg-danger-light" v-on:click="selectItem(item.id)">
												<i data-feather="trash-2"></i> حذف
											</a>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Add user Modal -->
	<div class="modal fade" id="add_modal" aria-hidden="true" role="dialog">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">إضافة فريق جديد</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div>
						<div class="row form-row">
							<div class="col-12 col-sm-12">
								<div class="form-group">
									<label>الإسم</label>
									<input v-model="data.name" type="text" class="form-control">
								</div>
							</div>
							<div class="col-12 col-sm-12">
								<div class="form-group">
									<label>الملاحظات</label>
									<textarea v-model="data.note" type="text" class="form-control" rows="4"></textarea>
								</div>
							</div>
						</div>
						<button v-on:click="createFunc()" class="btn btn-primary btn-block">إضافة</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- /ADD user Modal -->

	<!-- update user Modal -->
	<div class="modal fade" id="edit_modal" aria-hidden="true" role="dialog">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">تعديل الفريق</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div>
						<div class="row form-row">
							<div class="col-12 col-sm-12">
								<div class="form-group">
									<label>الإسم</label>
									<input v-model="data.name" type="text" class="form-control">
								</div>
							</div>
							<div class="col-12 col-sm-12">
								<div class="form-group">
									<label>الملاحظات</label>
									<textarea v-model="data.note" type="text" class="form-control" rows="4"></textarea>
								</div>
							</div>
						</div>
						<button v-on:click="UpdateFunc()" class="btn btn-primary btn-block">تعديل</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- /update user Details Modal -->

	<!-- Delete user Modal -->
	<div class="modal fade" id="delete_modal" aria-hidden="true" role="dialog">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<!--	<div class="modal-header">
							<h5 class="modal-title">Delete</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>-->
				<div class="modal-body">
					<div class="form-content p-2">
						<h4 class="modal-title">حذف</h4>
						<p class="mb-4">إنتبه سيتم حذف العنصر?</p>
						<button type="button" v-on:click="DeleteFunc()" class="btn btn-primary">حذف </button>
						<button type="button" class="btn btn-danger" data-dismiss="modal">إغلاق</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- /Delete user Modal -->

	<!-- update role -->
	<div class="modal fade" id="update_role" aria-hidden="true" role="dialog">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">تعديل إدعائات المستخدم</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div>
						<div class="row form-row">
							<div class="col-12 col-sm-6">
								<div class="form-group">
									<label>Role Permissions</label>
								</div>
							</div>

							<div v-for="item in getUserPermissionsData" :key="item.moduleId">
								<div class="col-6 mt-3">
									<el-checkbox style="color: #e5008f; font-weight: bold;"
										v-model="updateCheckModulePerAll[item.moduleId]"
										:indeterminate="updateIsIndeterminateStates[item.moduleId]"
										@change="handleCheckAllModuleChangeUpdate(item.moduleId)">
										{{ item.moduleName }}
									</el-checkbox>
								</div>

								<div class="col-6 ml-4">
									<el-checkbox-group v-model="updateCheckedPermissions"
										@change="handleCheckedPermissionsChangeUpdate(item.moduleId)">
										<div class="">
											<el-checkbox v-for="per in item.modulePermissions" :key="per.id"
												:label="per.id">
												{{ per.title }}
											</el-checkbox>
										</div>

									</el-checkbox-group>
								</div>

							</div>
						</div>
						<button v-on:click="UpdatePermissionsFunc()" class="btn btn-primary btn-block">Save</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- /update role -->


	<!-- send new password -->
	<div class="modal fade" id="send_password_modal" aria-hidden="true" role="dialog">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">إرسال كلمة مرور جديدة</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div>
						<div class="row form-row">
							<div class="col-12 col-sm-12">
								<div class="form-group">
									<label>المنطقة</label>
									<select v-model="dataNewPassword.sendWay" class="form-control"
										aria-label="Default select example">
										<option value="0" key="0" selected>-- طريقة الإرسال --</option>
										<option v-for="item in getSendMessageWaysData" :value="item.id" :key="item.id">
											{{ item.name }}</option>
									</select>
								</div>
							</div>
						</div>
						<button v-on:click="sendNewPassordFunc()" class="btn btn-primary btn-block">إرسال</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- /send new password -->

</template>
<style scoped>
.text-right a {
	margin-left: 5px;
}

.modal-body button {
	margin: 5px;
}
</style>