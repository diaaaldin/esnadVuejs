<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { ElLoading } from 'element-plus';
 import cropper from '@/components/cropper/squereCropper.vue';
import axios from "axios";



export default {
	data() {
		return {
			data: {
				id: localStorage.getItem('id'),
                name: "",
                email: "",
                mobile: "",
                ssn: "",
                address : "",
				moreInfo : "",
				password: "",
 				confirmPassword: "",
 				userTypeCFK: 0
			},

			changePasswordData: {
                userId: localStorage.getItem('id'),
                email: "",
                mobile: "",
                sendWay: 0,
                oldPassword: "",
                newPassword: ""
            },

			confirmPassword : "",
			// imagePath : "",
			// showImageCropper: false,
			// imageCropperSrc: null,
			// base64Images: [],
			// myFiles: [],

            emailError: '',
		}
	},
	mounted() {

	},

	components: {
		cropper
	},

	emits: {

	},

	created() {
		// Call the function from the store directly when the component is created
		this.initFunc();
	},

	computed: {
		...mapGetters("Users", ["getUserData"]),
		// ...mapGetters("Code", ["getStatesData" , "getCitiesData"]),

	},

	methods: {
		...mapActions("Users", ["UserProfileInfo", "UserUpdate" , "ChangePassword"]),
		// ...mapActions("Code", ["GetStates", "GetCities"]),

		clearData() {
            this.changePasswordData.userId = 0;
            this.changePasswordData.email = "";
            this.changePasswordData.mobile = "";
            this.changePasswordData.sendWay = 0;
            this.changePasswordData.oldPassword = "";
            this.changePasswordData.newPassword = "";
            this.confirmPassword = "";
        },
		ChangePasswordFunc() {
	        if (this.checkValidation()) {
	        	const loading = ElLoading.service({
	        		lock: true,
	        		background: 'rgba(0, 0, 0, 0.7)',
	        		text: "",
	        	});
        
	        	this.ChangePassword(this.changePasswordData).then(Response => {
	        		// console.log(Response);
	        		this.$moshaToast(this.$t('general_update_operation_success_message'), {
	        			hideProgressBar: 'false',
	        			showIcon: 'true',
	        			swipeClose: 'true',
	        			type: 'success',
	        			timeout: 3000,
	        		});
	        		this.clearData();
	        		loading.close();
	        		
	        	}).catch(error => {
	        		this.$moshaToast(error.response.data.message, {
	        			hideProgressBar: 'false',
	        			position: 'top-center',
	        			showIcon: 'true',
	        			swipeClose: 'true',
	        			type: 'warning',
	        			timeout: 3000,
	        		});
	        		loading.close();
	        	});
	        }
        },
        checkValidation() {
        	if (this.changePasswordData.oldPassword.trim() == '') {
        		this.$moshaToast(this.$t('password_old_check_message'), {
        			hideProgressBar: 'false',
        			position: 'top-center',
        			showIcon: 'true',
        			swipeClose: 'true',
        			type: 'warning',
        			timeout: 3000,
        		});
        		// this.$refs.email.focus();
        		return false;
        	} else if (this.changePasswordData.newPassword.trim() == '') {
        		this.$moshaToast(this.$t('password_new_check_message'), {
        			hideProgressBar: 'false',
        			position: 'top-center',
        			showIcon: 'true',
        			swipeClose: 'true',
        			type: 'warning',
        			timeout: 3000,
        		});
        		// this.$refs.email.focus();
        		return false;
        	} else if (this.changePasswordData.newPassword.trim() != this.confirmPassword.trim()) {
        		this.$moshaToast(this.$t('password_confirm_new_equal_check_message'), {
        			hideProgressBar: 'false',
        			position: 'top-center',
        			showIcon: 'true',
        			swipeClose: 'true',
        			type: 'warning',
        			timeout: 3000,
        		});
        		// this.$refs.nickName.focus();
        		return false;
        	} 
        
        	return true;
        },

		async setData() {
			this.data.id = this.getUserData.id;
			this.data.name = this.getUserData.name;
			this.data.email = this.getUserData.email;
			this.data.mobile = this.getUserData.mobile;
            this.data.ssn = this.getUserData.ssn;
			this.data.address = this.getUserData.address;
			this.data.moreInfo = this.getUserData.moreInfo;
		},

		
		initFunc() {
			const loading = ElLoading.service({
				lock: true,
				background: 'rgba(0, 0, 0, 0.7)',
				text: "",
			});
            // this.GetStates();
            // this.GetCities();
			console.log(this.data);
			this.UserProfileInfo(this.data.id).then(Response => {
				this.setData();
				loading.close();
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
			this.UserProfileInfo(this.data.id).then(Response => {
				this.setData();
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

		UpdateFunc() {
			if (this.checkUpdateValidation()) {
				
				const loading = ElLoading.service({
					lock: true,
					background: 'rgba(0, 0, 0, 0.7)',
					text: "",
				});

				//// console.log("this.data for update : ", this.data);
				this.UserUpdate(this.data).then(Response => {
					this.$moshaToast(this.$t('general_update_operation_success_message'), {
						hideProgressBar: 'false',
						showIcon: 'true',
						swipeClose: 'true',
						type: 'success',
						timeout: 3000,
					});
					loading.close();
					this.GetData();
					$('#edit_personal_details').modal('hide');
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
			if (this.data.name == "") {
				this.$moshaToast(this.$t('user_data_check_name'), {
					hideProgressBar: 'false',
					position: 'top-center',
					showIcon: 'true',
					swipeClose: 'true',
					type: 'warning',
					timeout: 3000,
				});
				return false;
			}else if (this.data.email == "") {
				this.$moshaToast(this.$t('user_data_check_email'), {
					hideProgressBar: 'false',
					position: 'top-center',
					showIcon: 'true',
					swipeClose: 'true',
					type: 'warning',
					timeout: 3000,
				});
				return false;
			} else if (this.data.mobile == "") {
				this.$moshaToast(this.$t('user_data_check_mobile'), {
					hideProgressBar: 'false',
					position: 'top-center',
					showIcon: 'true',
					swipeClose: 'true',
					type: 'warning',
					timeout: 3000,
				});
				return false;
			}
			else if (this.data.ssn == "") {
				this.$moshaToast(this.$t('user_data_check_ssn'), {
					hideProgressBar: 'false',
					position: 'top-center',
					showIcon: 'true',
					swipeClose: 'true',
					type: 'warning',
					timeout: 3000,
				});
				return false;
			}

			else if (this.data.addressState == 0) {
				this.$moshaToast(this.$t('user_data_check_state'), {
					hideProgressBar: 'false',
					position: 'top-center',
					showIcon: 'true',
					swipeClose: 'true',
					type: 'warning',
					timeout: 3000,
				});
				return false;
			} else if (this.data.addressCity == 0) {
				this.$moshaToast(this.$t('user_data_check_city'), {
					hideProgressBar: 'false',
					position: 'top-center',
					showIcon: 'true',
					swipeClose: 'true',
					type: 'warning',
					timeout: 3000,
				});
				return false;
			} else if (this.data.addressInfo == "") {
				this.$moshaToast(this.$t('user_data_check_address_info'), {
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

		UpdateImageFunc(image) {
			this.imagePath = image;
			if (this.checkUpdateImageValidation()) {
				
				const loading = ElLoading.service({
					lock: true,
					background: 'rgba(0, 0, 0, 0.7)',
					text: "",
				});

				//// console.log("this.data for update : ", this.data);
				this.UpdateAdminImage(this.imagePath).then(Response => {
					this.$moshaToast(this.$t('general_update_operation_success_message'), {
						hideProgressBar: 'false',
						showIcon: 'true',
						swipeClose: 'true',
						type: 'success',
						timeout: 3000,
					});
					loading.close();
					this.GetData();
					$('#edit_personal_details').modal('hide');
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

		checkUpdateImageValidation() {
			if (this.imagePath == "") {
				this.$moshaToast(this.$t('user_data_check_image'), {
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

		toggleCropperModal() {
			if ($('#cropper_modal').is(':visible')) {
				$('#cropper_modal').modal('hide');
			} else {
				$('#cropper_modal').modal('show');
			}
			//this.showImageCropper = !this.showImageCropper;
		},
		
		cropperImageLoud(imageFile) {
			//this.imageCropperSrc = URL.createObjectURL(imageFile);
		},
        
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
			const input = event.target.value.replace(/\D/g, '').slice(0, 14);
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

		setStatesCities(state) {
			let res = this.getCitiesData.filter(x => x.state === state);
			if (res) {
				this.data.addressCity = 0;
				this.stateCities = res;
			} else this.stateCities = [];
		},
		// stateNameFunc(id) {
		// 	let res = this.getStatesData.find(x => x.id === id);
		// 	if (res) return res.name;
		// 	else return "";
		// },
		// cityNameFunc(id) {
		// 	let res = this.getCitiesData.find(x => x.id === id);
		// 	if (res) return res.name;
		// 	else return "";
		// }

	}
};
</script>
<template>
	<!-- Page Header -->
	<div class="page-header">
		<div class="row">
			<div class="col">
				<h3 class="page-title">{{ $t('profile_title') }}</h3>
				<!-- <ul class="breadcrumb">
									<li class="breadcrumb-item"><a href="index.html">Dashboard</a></li>
									<li class="breadcrumb-item active">Profile</li>
								</ul> -->
			</div>
		</div>
	</div>
	<!-- /Page Header -->
	<div class="row">
		<div class="col-md-12">
			<div class="profile-header">
				<div class="row align-items-center">
					<div class="col-auto profile-image">
						<a href="#">
							<img class="rounded-circle" alt="User Image" src="/images/esnad_logo.png">
						</a>
					</div>
					<div class="col ml-md-n2 profile-user-info">
						<h4 class="user-name mb-0">{{ this.getUserData.name }}</h4>
						<h6 class="text-muted">{{ this.getUserData.email }}</h6>
						<!-- <div class="user-Location"><i data-feather="map-pin"></i> {{
							stateNameFunc(this.getUserData.addressStateId) }} </div> -->
						<!-- <div class="about-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
							tempor incididunt ut labore et dolore magna aliqua.</div> -->
					</div>
					<!-- <div class="col-auto profile-btn">

						<a data-toggle="modal" href="#cropper_modal" class="btn btn-primary">
							{{ $t('profile_image_update') }}
						</a>
					</div> -->
				</div>
			</div>
			<div class="profile-menu">
				<ul class="nav nav-tabs nav-tabs-solid">
					<li class="nav-item">
						<a class="nav-link active" data-toggle="tab" href="#per_details_tab">{{ $t('profile_about_siction') }}</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" data-toggle="tab" href="#password_tab">{{ $t('profile_password_siction') }}</a>
					</li>
				</ul>
			</div>
			<div class="tab-content profile-tab-cont">

				<!-- Personal Details Tab -->
				<div class="tab-pane fade show active" id="per_details_tab">
					<!-- Personal Details -->
					<div class="row">
						<div class="col-lg-12">
							<div class="card">
								<div class="card-body">
									<h5 class="card-title d-flex justify-content-between">
										<span>{{ $t('profile_about_siction') }}</span>
										<a class="edit-link" data-toggle="modal" v-on:click="setData()"
											href="#edit_personal_details"><i data-feather="edit" class="mr-1"></i>{{ $t('general_update_button') }}</a>
									</h5>
									<div class="row">
										<p class="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">{{ $t('user_data_name') }}</p>
										<p class="col-sm-10">{{ this.getUserData.name }}</p>
									</div>
									<div class="row">
										<p class="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">{{ $t('user_data_email') }}</p>
										<p class="col-sm-10">{{ this.getUserData.email }}</p>
									</div>
									<div class="row">
										<p class="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">{{ $t('user_data_ssn') }}</p>
										<p class="col-sm-10">{{ this.getUserData.ssn }}</p>
									</div>
									<div class="row">
										<p class="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">{{ $t('user_data_mobile') }}</p>
										<p class="col-sm-10">{{ this.getUserData.mobile }}</p>
									</div>
									<div class="row">
										<p class="col-sm-2 text-muted text-sm-right mb-0">{{ $t('user_data_more_info') }}</p>
										<p class="col-sm-10 " style="white-space: pre-line;"> {{ this.getUserData.moreInfo }} </p>
									</div>
									<div class="row">
										<p class="col-sm-2 text-muted text-sm-right mb-0">{{ $t('user_data_address') }}</p>
										<p class="col-sm-10 " style="white-space: pre-line;"> {{ this.getUserData.address }} </p>			
									</div>
									
								</div>
							</div>
						</div>
					</div>
					<!-- /Personal Details -->
				</div>
				<!-- /Personal Details Tab -->

				<!-- Change Password Tab -->
				<div id="password_tab" class="tab-pane fade">

					<div class="card">
						<div class="card-body">
							<h5 class="card-title">{{ $t('profile_change_password_siction') }}</h5>
							<div class="row">
								<div class="col-md-10 col-lg-6">
									<div>
										<div class="form-group">
											<label>{{ $t('profile_old_password') }}</label>
											<input v-model="changePasswordData.oldPassword" type="password" class="form-control">
										</div>
										<div class="form-group">
											<label>{{ $t('profile_new_password') }}</label>
											<input v-model="changePasswordData.newPassword" type="password" class="form-control">
										</div>
										<div class="form-group">
											<label>{{ $t('profile_confirm_password') }}</label>
											<input v-model="confirmPassword" type="password" class="form-control">
										</div>
										<button v-on:click="ChangePasswordFunc()" class="btn btn-primary" type="button">{{ $t('general_save_button') }}</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- /Change Password Tab -->

			</div>
		</div>
	</div>

	<!-- Edit Details Modal -->
	<div class="modal fade" id="edit_personal_details" aria-hidden="true" role="dialog">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">{{ $t('profile_about_siction') }}</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<form>
						<div class="row form-row">
							<div class="col-12 col-sm-6">
								<div class="form-group">
									<label>{{ $t('user_data_name') }}</label>
									<input v-model="data.name" type="text" class="form-control">
								</div>
							</div>
							<div class="col-12 col-sm-6">
								<div class="form-group">
									<label>{{ $t('user_data_ssn') }}</label>
									<input v-model="data.ssn" type="text" class="form-control" @input="filterSSNInput">
								</div>
							</div>
							<div class="col-12 col-sm-6">
								<div class="form-group">
									<label>{{ $t('user_data_email') }}</label>
									<input v-model="data.email" type="email" class="form-control"
										@input="validateEmail">
								</div>
								<p v-if="emailError" style="color: red">{{ emailError }}</p>
							</div>
							<div class="col-12 col-sm-6">
								<div class="form-group">
									<label>{{ $t('user_data_mobile') }}</label>
									<input v-model="data.mobile" type="text" class="form-control"
										@input="filterMobileInput">
								</div>
							</div>
							<div class="col-12">
								<div class="form-group">
									<label>{{ $t('user_data_more_info') }}</label>
									<textarea v-model="data.moreInfo" type="text" class="form-control" maxlength="255"></textarea>
								</div>
							</div>

							<div class="col-12">
								<h5 class="form-title"><span>{{ $t('user_data_address') }}</span></h5>
							</div>

                            <div class="col-12">
								<div class="form-group">
									<label>{{ $t('user_data_address_info') }}</label>
									<textarea v-model="data.address" type="text" class="form-control" maxlength="255"></textarea>
								</div>
							</div>
                         

						</div>
						<button type="button" v-on:click="UpdateFunc()" class="btn btn-primary btn-block">{{ $t('general_save_button') }}</button>
					</form>
				</div>
			</div>
		</div>
	</div>
	<!-- /Edit Details Modal -->

	<!-- Edit profile image Modal -->
	<!-- <div class="modal fade" id="cropper_modal" aria-hidden="true" role="dialog">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">{{ $t('general_update_image') }}</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div>
						<cropper @b64image="(x) => UpdateImageFunc(x) " @IsShow="(x) => toggleCropperModal()"
							@copperImage="(x) => cropperImageLoud(x)"></cropper>
					</div>
				</div>
			</div>
		</div>
	</div> -->
	<!-- /Edit profile image Modal -->


</template>
<style scoped>


.text-right a {
	margin-left: 5px;
}

.modal-body button {
	margin: 5px;
}
</style>