<script>
import { ElLoading } from 'element-plus';
import { RouterView } from 'vue-router';
import { mapState, mapGetters, mapActions } from "vuex";


export default {
	props: {

	},

	components: {
		RouterView
	},

	data() {
		return {
			user: {
				email: "",
				password: "",
			},

			newPasswordData: {
				userId: 0,
				email: "",
				Mobile: "",
				sendWay: 0,
				oldPassword: "",
				newPassword: ""
			},
		}
	},
	created() {
		localStorage.clear();
	},


	computed: {
		...mapGetters("Users", ["getUserInfo"]),
	},

	methods: {
		...mapActions("Users", ["UserLogin", "GetNewPassword"]),

		getLoginfunc() {

			if (this.checkValidation()) {
				const loading = ElLoading.service({
					lock: true,
					background: 'rgba(0, 0, 0, 0.7)',
					text: "",
				});

				this.UserLogin(this.user).then(Response => {				
					this.$moshaToast(this.$t('login_success_message'), {
					hideProgressBar: false,
					showIcon: true,
					swipeClose: true,
					type: 'success',
					timeout: 3000,
				});
					loading.close();
					this.$router.push({ name: "Home" });
				}).catch(error => {
					// Handle any errors that might occur during the API call
					//console.error(error);
					if (error.response && error.response.status === 401) {
						this.$moshaToast(this.$t('general_user_not_allow_error_message'), {
							hideProgressBar: false,
							position: 'top-center',
							showIcon: true,
							swipeClose: true,
							type: 'warning',
							timeout: 3000,
						});
					} else {
						// Handle other errors with the provided message from the response
						this.$moshaToast(error.response?.data?.message || 'An error occurred', {
							hideProgressBar: false,
							position: 'top-center',
							showIcon: true,
							swipeClose: true,
							type: 'warning',  // Default type is 'warning'
							timeout: 3000,
						});
					}
					loading.close();
				});
			}

		},

		checkValidation() {
			if (this.user.email.trim() == '') {
				this.$moshaToast(this.$t('login_check_validation_email_message'), {
					hideProgressBar: false,
					position: 'top-center',
					showIcon: true,
					swipeClose: true,
					type: 'warning',
					timeout: 3000,
				});
				this.$refs.email.focus();
				return;
			}
			if (this.user.password.trim() == '') {
				this.$moshaToast(this.$t('login_check_validation_password_message'), {
					hideProgressBar: false,
					position: 'top-center',
					showIcon: true,
					swipeClose: true,
					type: 'warning',
					timeout: 3000,
				});
				this.$refs.password.focus();
				return;
			}
			return true;
		},

		getNewPasswordFunc() {
			if (this.checkNewPasswordValidation()) {
				const loading = ElLoading.service({
					lock: true,
					background: 'rgba(0, 0, 0, 0.7)',
					text: "",
				});
				this.GetNewPassword(this.newPasswordData).then(Response => {
					this.$moshaToast('We send new password to your email', {
						hideProgressBar: 'false',
						showIcon: 'true',
						swipeClose: 'true',
						type: 'success',
						timeout: 3000,
					});
					loading.close();
					this.closeForgotPasswordModal();
				}).catch(error => {
					this.$moshaToast(error.response?.data?.message || 'An error occurred', {
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

		checkNewPasswordValidation() {
			if (this.newPasswordData.email.trim() == '') {
				this.$moshaToast("enter email", {
					hideProgressBar: 'false',
					position: 'top-center',
					showIcon: 'true',
					swipeClose: 'true',
					type: 'warning',
					timeout: 3000,
				});
				this.$refs.email.focus();
				return;
			}
			return true;
		},

		showForgotPasswordModal() {
			// Reset the form data
			this.newPasswordData = {
				userId: 0,
				email: "",
				Mobile: "",
				sendWay: 0,
				oldPassword: "",
				newPassword: ""
			};
			// Show the modal using Bootstrap
			this.$nextTick(() => {
				const modalElement = document.getElementById('forgot_password');
				if (modalElement) {
					// Check if Bootstrap 5 is available
					if (window.bootstrap && window.bootstrap.Modal) {
						const modal = new window.bootstrap.Modal(modalElement);
						modal.show();
					} else if (window.$ && window.$.fn.modal) {
						// Fallback to jQuery Bootstrap
						window.$('#forgot_password').modal('show');
					}
				}
			});
		},

		closeForgotPasswordModal() {
			// Close the modal using Bootstrap
			this.$nextTick(() => {
				const modalElement = document.getElementById('forgot_password');
				if (modalElement) {
					// Check if Bootstrap 5 is available
					if (window.bootstrap && window.bootstrap.Modal) {
						const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
						if (modalInstance) {
							modalInstance.hide();
						}
					} else if (window.$ && window.$.fn.modal) {
						// Fallback to jQuery Bootstrap
						window.$('#forgot_password').modal('hide');
					}
				}
			});
		},
	},
}
</script>

<template>
	<!-- Main Wrapper -->
	<div class="main-wrapper login-body">
		<div class="login-wrapper">
			<div class="container">
				<div class="loginbox">
					<div class="login-left">
						<img class="img-fluid" src="/images/esnad_logo_dark.png" alt="Logo">
					</div>
					<div class="login-right">
						<div class="login-right-wrap">
							<h1>{{ $t('login_title') }}</h1>
							<p class="account-subtitle">{{ $t('login_title_p') }}</p>

							<!-- Form -->
							<div>
								<div class="form-group">
									<input v-model="user.email" ref="email" required type="email" name="email"
										class="form-control" @keypress.enter="getLoginfunc()"
										:placeholder="$t('login_email_input_plachoder')" id="email"
										aria-describedby="email">
								</div>
								<div class="form-group">
									<input v-model="user.password" ref="password" required type="password"
										name="password" class="form-control" @keypress.enter="getLoginfunc()"
										:placeholder="$t('login_password_input_plachoder')" id="password"
										aria-describedby="password">
								</div>
								<div class="form-group">
									<button v-on:click="getLoginfunc()" class="btn btn-primary btn-block">{{
										$t('login_button') }}</button>
								</div>
							</div>
							<!-- /Form -->
							<div class="text-center forgotpass">
								<a href="javascript:void(0)" @click="showForgotPasswordModal()" data-bs-toggle="modal" data-bs-target="#forgot_password">
									{{ $t('login_forgot_password') || 'Forgot Password?' }}
								</a>
							</div>
							<div class="text-center mt-3">
								<router-link to="/about-us" class="text-muted small">
									<i class="fa fa-info-circle me-1"></i>من نحن
								</router-link>
							</div>
							<!--	<div class="login-or">
									<span class="or-line"></span>
									<span class="span-or">or</span>
								</div>
								  -->
							<!-- Social Login -->
							<!-- <div class="social-login">
									<span>Login with</span>
									<a href="#" class="facebook"><i class="fa fa-facebook"></i></a><a href="#" class="google"><i class="fa fa-google"></i></a>
								</div>-->
							<!-- /Social Login -->

							<!--<div class="text-center dont-have">Don’t have an account? <a href="register.html">Register</a></div>-->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>


	<div class="modal fade" id="forgot_password" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLabel">هل نسيت كلمة المرور ؟ </h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>				
				</div>
				<div class="modal-body">
					<form action="" method="">
						<label class=" label-form"> أدخل بريدك الالكتروني </label>
						<div class="input-group mb-3">
							<input type="email" class="form-control" placeholder="Example@email.com" aria-label="Email"
								aria-describedby="basic-addon1" v-model="newPasswordData.email">
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary"  data-dismiss="modal" aria-label="Close">الغاء</button>
					<button type="button" class="btn btn-primary" v-on:click="getNewPasswordFunc()">
						أرسل كلمة المرور الجديدة </button>
				</div>
			</div>
		</div>
	</div>
	<!-- /Main Wrapper -->
</template>

<style scoped></style>