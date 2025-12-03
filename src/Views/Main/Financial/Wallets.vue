<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { ElLoading } from 'element-plus';
import { ParentEnum, FundWaysEnum, UserTypeEnum } from '@/config/config.js'
import cropper from '@/components/cropper/squereCropper.vue';

export default {
    data() {
        return {
            data: {
                id: 0,
                name: "",
                mobile: "",
                email: "",
                balance: 0,
                teamId: 0,
                typeCFK: 0, // fundways
                note: "",

            },

            dataSearch: {
                teamId: 0,
                name: "",
                fundWays: 0,
            },


            //////////////////////////
            imageCropperSrc: null,
        }
    },
    mounted() {
        // Load teams and fund ways on mount
        this.loadTeams();
        this.loadFundWays();
        
        // Set default teamId for non-admin users
        if (!this.isAdmin && this.userTeamId > 0) {
            this.dataSearch.teamId = this.userTeamId;
        }
    },
    components: {
        cropper,
    },

    emits: {

    },

    created() {
        // Call the function from the store directly when the component is created
        this.initFunc();
    },

    computed: {
        ...mapGetters("Wallets", ["getWalletsData"]),
        ...mapGetters("Users", ["getTeamsData", "getUserInfo"]),
        ...mapGetters("Code", ["getCodesData"]),

        isAdmin() {
            return this.getUserInfo?.userType === UserTypeEnum.Admin;
        },

        userTeamId() {
            return this.getUserInfo?.teamId || 0;
        },
    },
    methods: {
        ...mapActions("Wallets", ["GetAllWallets", "CreateWallet", "UpdateWallet", "DeleteWallet"]),
        ...mapActions("Users", ["GetTeams"]),
        ...mapActions("Code", ["GetCodesByParent"]),

        loadTeams() {
            this.GetTeams({ name: "" }).catch(error => {
                console.error("Error loading teams:", error);
            });
        },

        loadFundWays() {
            this.GetCodesByParent({ parent1: ParentEnum.FundWays, parent2: 0 }).catch(error => {
                console.error("Error loading fund ways:", error);
            });
        },

        getFundWaysData() {
            return this.getCodesData || [];
        },

        searchFunc() {
            this.getDataFunc();
        },

        	initFunc() {
			const loading = ElLoading.service({
				lock: true,
				background: 'rgba(0, 0, 0, 0.7)',
				text: "",
			});
	
			this.GetAllWallets({ 
                teamId: this.dataSearch.teamId || 0, 
                name: this.dataSearch.name || "", 
                fundWays: this.dataSearch.fundWays || 0 
            }).then(response => {
                console.log("responce : " ,response);
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

        getDataFunc() {	
			this.GetAllWallets({ 
                teamId: this.dataSearch.teamId || 0, 
                name: this.dataSearch.name || "", 
                fundWays: this.dataSearch.fundWays || 0 
            }).then(response => {
              
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

        clearData() {
            this.data.id = 0;
            this.data.name = "";
            this.data.mobile = "";
            this.data.email = "";
            this.data.balance = 0;
            // Set teamId based on user role
            if (!this.isAdmin && this.userTeamId > 0) {
                this.data.teamId = this.userTeamId;
            } else {
                this.data.teamId = 0;
            }
            this.data.typeCFK = 0;
            this.data.note = "";
            this.imageCropperSrc = null;
        },

        UpdateFunc() {
            if (this.checkUpdateValidation()) {
                const loading = ElLoading.service({
                    lock: true,
                    background: 'rgba(0, 0, 0, 0.7)',
                    text: "",
                });

                this.UpdateWallet(this.data).then(Response => {
                    console.log(Response);
                    this.$moshaToast(this.$t('general_update_operation_success_message'), {
                        hideProgressBar: 'false',
                        showIcon: 'true',
                        swipeClose: 'true',
                        type: 'success',
                        timeout: 3000,
                    });
                    loading.close();
                    this.initFunc();
                    $('#edit_specialities_details').modal('hide');
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

        checkCreateValidation() {
            if (this.data.name == "") {
                this.$moshaToast(this.$t('general_modal_name_input') + ' ' + this.$t('general_required'), {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'warning',
                    timeout: 3000,
                });
                return false;
            }
            if (this.data.teamId == 0) {
                this.$moshaToast(this.$t('general_table_team') + ' ' + this.$t('general_required'), {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'warning',
                    timeout: 3000,
                });
                return false;
            }
            if (this.data.typeCFK == 0) {
                this.$moshaToast(this.$t('general_table_fund_ways') + ' ' + this.$t('general_required'), {
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

        checkUpdateValidation() {
            if (this.data.id == 0) {
                this.$moshaToast(this.$t('general_select_item_error'), {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'warning',
                    timeout: 3000,
                });
                return false;
            } else if (this.data.name == "") {
                this.$moshaToast(this.$t('general_modal_name_input') + ' ' + this.$t('general_required'), {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'warning',
                    timeout: 3000,
                });
                return false;
            } else if (this.data.teamId == 0) {
                this.$moshaToast(this.$t('general_table_team') + ' ' + this.$t('general_required'), {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'warning',
                    timeout: 3000,
                });
                return false;
            } else if (this.data.typeCFK == 0) {
                this.$moshaToast(this.$t('general_table_fund_ways') + ' ' + this.$t('general_required'), {
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

        checkDeleteValidation() {
            if (this.data.id == 0) {
                this.$moshaToast(this.$t('general_select_item_error'), {
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

        CreateFunc() {
            if (this.checkCreateValidation()) {
                const loading = ElLoading.service({
                    lock: true,
                    background: 'rgba(0, 0, 0, 0.7)',
                    text: "",
                });

                this.CreateWallet(this.data).then(Response => {
                    console.log(Response);
                    this.$moshaToast(this.$t('general_create_operation_success_message'), {
                        hideProgressBar: 'false',
                        showIcon: 'true',
                        swipeClose: 'true',
                        type: 'success',
                        timeout: 3000,
                    });
                    loading.close();
                    this.initFunc();
                    $('#add_modal').modal('hide');
                    this.clearData();
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

        selectItem(id) {
            this.clearData();
            const foundItem = this.getWalletsData.find(element => element.id === id);
            if (foundItem) {
                this.data.id = foundItem.id;
                this.data.name = foundItem.name || "";
                this.data.mobile = foundItem.mobile || "";
                this.data.email = foundItem.email || "";
                this.data.balance = foundItem.balance || 0;
                this.data.teamId = foundItem.teamId || 0;
                this.data.typeCFK = foundItem.typeCFK || 0;
                this.data.note = foundItem.note || "";
            }
        },

        DeleteFunc() {
            if (this.checkDeleteValidation()) {
                const loading = ElLoading.service({
                    lock: true,
                    background: 'rgba(0, 0, 0, 0.7)',
                    text: "",
                });

                this.DeleteWallet(this.data.id).then(Response => {
                    console.log(Response);
                    this.$moshaToast(this.$t('general_delete_operation_success_message'), {
                        hideProgressBar: 'false',
                        showIcon: 'true',
                        swipeClose: 'true',
                        type: 'success',
                        timeout: 3000,
                    });
                    loading.close();
                    this.initFunc();
                    $('#delete_modal').modal('hide');
                    this.clearData();
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

        toggleCropperModal() {
            if ($('#cropper_modal').is(':visible')) {
                $('#cropper_modal').modal('hide');
            } else {
                $('#cropper_modal').modal('show');
            }
        },

        cropperImageLoud(imageFile) {
            this.imageCropperSrc = URL.createObjectURL(imageFile);
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
    <!-- Page Header -->
    <div class="page-header">
        <div class="row">
            <div class="col-sm-12">
                <h3 class="page-title">إدارة المحافظ المالية</h3>
                <!-- <ul class="breadcrumb">
                                <li class="breadcrumb-item active">BodyType page</li>
                            </ul> -->
            </div>
			<div class="col-12 row mt-3">
				<!-- Team filter -->
				<div class="col-12 col-sm-6 col-md-3 mb-2" v-if="isAdmin">
					<label>{{ $t('general_table_team') }}</label>
					<select v-model="dataSearch.teamId" class="form-control" @change="searchFunc()">
						<option value="0">-- إختر الفريق --</option>
						<option v-for="team in getTeamsData" :key="team.id" :value="team.id">{{ team.name }}</option>
					</select>
				</div>

				<!-- Name filter -->
				<div class="col-12 col-sm-6 col-md-3 mb-2">
					<label>{{ $t('general_table_name_item') }}</label>
					<input @input="searchFunc()" v-model="dataSearch.name" type="text" class="form-control"
						:placeholder="$t('general_table_name_item')">
				</div>

				<!-- Fund ways filter -->
				<div class="col-12 col-sm-6 col-md-3 mb-2">
					<label>{{ $t('general_table_fund_ways') }}</label>
					<select v-model="dataSearch.fundWays" class="form-control" @change="searchFunc()">
						<option value="0">-- إختر نوع المحفظة --</option>
						<option v-for="fundWay in getFundWaysData()" :key="fundWay.id" :value="fundWay.id">{{ fundWay.name }}</option>
					</select>
				</div>

				<!-- (optional) extra column to keep layout consistent when isAdmin is false -->
				<!-- <div class="col-12 col-sm-6 col-md-3 mb-2"></div> -->

				<!-- Action Buttons (separate row, like Outcoms.vue) -->
				<div class="col-12 mt-2">
					<a href="#add_modal" data-toggle="modal" v-on:click="clearData()"
						class="btn btn-primary float-left">{{ $t('general_create_button') }}</a>
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
                                    <th class="text-center">{{ $t('general_table_name_item') }}</th>
                                    <th class="text-center">رقم الجوال</th>
                                    <th class="text-center">اللإيميل</th>
                                    <th class="text-center">الرصيد</th>
                                    <th class="text-center">الفريق</th>
                                    <th class="text-center">نوع المحفظة</th>
                                    <th class="text-center">الملاحظات</th>

                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in getWalletsData">
                                    <td class="text-center">{{ index + 1 }}</td>
                                    <td class="text-center">{{ item.name }}</td>
                                    <td class="text-center">{{ item.mobile }}</td>
                                    <td class="text-center">{{ item.email }}</td>
                                    <td class="text-center">{{ formatCurrency(item.balance) }}</td>
                                    <td class="text-center">{{ item.teamName }}</td>
                                    <td class="text-center">{{ item.typeName }}</td>
                                    <td class="text-center">{{ item.note }}</td>
                                   
                                    <td class="text-right">
                                        <div class="actions">
                                            <a class="btn btn-sm bg-success-light" data-toggle="modal"
                                                href="#edit_specialities_details" v-on:click="selectItem(item.id)">
                                                <i data-feather="edit"></i> {{ $t('general_update_button') }}
                                            </a>
                                            <a data-toggle="modal" href="#delete_modal"
												class="btn btn-sm bg-danger-light" v-on:click="selectItem(item.id)">
												<i data-feather="trash-2"></i> {{ $t('general_delete_button') }}
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

    <!-- Edit Details Modal -->
    <div class="modal fade" id="edit_specialities_details" aria-hidden="true" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ $t('general_update_modal_title') }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div>
                        <div class="row form-row">
                            <div class="col-12 col-sm-6">
								<div class="form-group">
									<label>{{ $t('general_modal_name_input') }}</label>
									<input v-model="data.name" type="text" class="form-control" :placeholder="$t('general_modal_name_input')">
								</div>
							</div>
                            <div class="col-12 col-sm-6">
								<div class="form-group">
									<label>{{ $t('general_table_mobile') }}</label>
									<input v-model="data.mobile" type="text" class="form-control" :placeholder="$t('general_table_mobile')">
								</div>
							</div>
                            <div class="col-12 col-sm-6">
								<div class="form-group">
									<label>{{ $t('general_table_email') }}</label>
									<input v-model="data.email" type="email" class="form-control" :placeholder="$t('general_table_email')">
								</div>
							</div>
                            <div class="col-12 col-sm-6">
								<div class="form-group">
									<label>{{ $t('general_table_balance') }}</label>
									<input v-model="data.balance" type="number" class="form-control" :placeholder="$t('general_table_balance')">
								</div>
							</div>
                            <div class="col-12 col-sm-12" v-if="isAdmin">
								<div class="form-group">
									<label>{{ $t('general_table_team') }}</label>
									<select v-model="data.teamId" class="form-control">
										<option value="0">{{ $t('general_select') }}</option>
										<option v-for="team in getTeamsData" :key="team.id" :value="team.id">{{ team.name }}</option>
									</select>
								</div>
							</div>
                            <div class="col-12 col-sm-12">
								<div class="form-group">
									<label>{{ $t('general_table_fund_ways') }}</label>
									<select v-model="data.typeCFK" class="form-control">
										<option value="0">{{ $t('general_select') }}</option>
										<option v-for="fundWay in getFundWaysData()" :key="fundWay.id" :value="fundWay.id">{{ fundWay.name }}</option>
									</select>
								</div>
							</div>
                            <div class="col-12 col-sm-12">
								<div class="form-group">
									<label>{{ $t('general_table_note') }}</label>
									<textarea placeholder="{{ $t('general_table_note') }}" v-model="data.note" class="form-control" rows="3"></textarea>
								</div>
							</div>
                            <!-- <div class="col-12 col-sm-12">
                                <div class="form-group">
                                    <label>{{ $t('general_table_value_item') }}</label>
                                    <input v-model="data.value" type="number" class="form-control">
                                </div>
                            </div> -->
                            <!-- <div class="col-12 col-sm-12" v-if="isImageValue(data.id)">
                                <div class="col-12" v-on:click="toggleCropperModal()">
                                    <div class="box py-2 px-3 mb-3 rounded-3 cropper">
                                        <label class="w-100 h-100">
                                            <div class="icon"></div>
                                            <h5 class="text-center">{{ $t('general_update_image') }}</h5>
                                            <img src="/images/plus-icon.svg" alt=""
                                                class="d-block mx-auto rounded-circle p-2" />
                                        </label>
                                    </div>
                                    <div v-if="imageCropperSrc" class="imageCropper">
                                        <img :src="imageCropperSrc" alt="imageCropper">
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-12" v-else>
                                <div class="form-group">
                                    <label>{{ $t('general_table_value_st_item') }}</label>
                                    <input v-model="data.valueSt" type="string" class="form-control">
                                </div>
                            </div> -->
                        </div>
                        <button v-on:click="UpdateFunc()" class="btn btn-primary btn-block">{{ $t('general_save_button')
                            }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Edit Details Modal -->

    <!-- Add Details Modal -->
    <div class="modal fade" id="add_modal" aria-hidden="true" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ $t('general_create_modal_title') }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div>
                        <div class="row form-row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>{{ $t('general_modal_name_input') }}</label>
                                    <input v-model="data.name" type="text" class="form-control" :placeholder="$t('general_table_name_item')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>{{ $t('general_table_mobile') }}</label>
                                    <input v-model="data.mobile" type="text" class="form-control" :placeholder="$t('general_table_mobile')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>{{ $t('general_table_email') }}</label>
                                    <input v-model="data.email" type="email" class="form-control" :placeholder="$t('general_table_email')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>{{ $t('general_table_balance') }}</label>
                                    <input v-model="data.balance" type="number" class="form-control" :placeholder="$t('general_table_balance')">
                                </div>
                            </div>
                            <div class="col-12 col-sm-12" v-if="isAdmin">
                                <div class="form-group">
                                    <label>{{ $t('general_table_team') }}</label>
                                    <select v-model="data.teamId" class="form-control" :placeholder="$t('general_table_team')">
                                        <option value="0">-- إختر الفريق --</option>
                                        <option v-for="team in getTeamsData" :key="team.id" :value="team.id">{{ team.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-12">
                                <div class="form-group">
                                    <label>{{ $t('general_table_fund_ways') }}</label>
                                    <select v-model="data.typeCFK" class="form-control" :placeholder="$t('general_table_fund_ways')">
                                        <option value="0">-- إختر نوع المحفظة --</option>
                                        <option v-for="fundWay in getFundWaysData()" :key="fundWay.id" :value="fundWay.id">{{ fundWay.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-12">
                                <div class="form-group">
                                    <label>{{ $t('general_table_note') }}</label>
                                    <textarea v-model="data.note" class="form-control" rows="3" :placeholder="$t('general_table_note')"></textarea>
                                </div>
                            </div>
                        </div>
                        <button v-on:click="CreateFunc()" class="btn btn-primary btn-block">{{ $t('general_save_button')
                            }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Add Details Modal -->

    <!-- Delete Modal -->
    <div class="modal fade" id="delete_modal" aria-hidden="true" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="form-content p-2">
                        <h4 class="modal-title">{{ $t('general_delete_modal_title') }}</h4>
                        <p class="mb-4">{{ $t('general_delete_confirmation_message') }}</p>
                        <button type="button" v-on:click="DeleteFunc()" class="btn btn-primary">{{ $t('general_delete_button') }}</button>
                        <button type="button" class="btn btn-danger" data-dismiss="modal">{{ $t('general_cancele_button') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Delete Modal -->

    <!-- cropper Modal -->
    <div class="modal fade" id="cropper_modal" aria-hidden="true" role="dialog">
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
                        <cropper @b64image="(x) => data.valueSt = x" @IsShow="(x) => toggleCropperModal()"
                            @copperImage="(x) => cropperImageLoud(x)"></cropper>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /cropper Modal -->




</template>
<style scoped>
.text-right a {
    margin-left: 5px;
}

.modal-body button {
    margin: 5px;
}
</style>