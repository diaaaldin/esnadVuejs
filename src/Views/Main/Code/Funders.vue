<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { ElLoading } from 'element-plus';
import { ParentEnum } from '@/config/config.js'
import cropper from '@/components/cropper/squereCropper.vue';

export default {
    data() {
        return {
            data: {
                id: 0,
                name: "",
                parent: ParentEnum.Funders,
                parent2: 0,
                arrangeNum: 0,
                value: 0,
                valueSt: "",
            },

          

            //////////////////////////
            imageCropperSrc: null,
        }
    },
    mounted() {

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
        ...mapGetters("Code", ["getCodesData"]),

    },
    methods: {
        ...mapActions("Code", ["GetCodesByParent", "CreateCode", "UpdateCode", "DeleteCode"]),

        	initFunc() {
			const loading = ElLoading.service({
				lock: true,
				background: 'rgba(0, 0, 0, 0.7)',
				text: "",
			});
	
			this.GetCodesByParent({ parent1: ParentEnum.Funders, parent2: 0 }).then(response => {
                 
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

        clearData() {
            this.data.id = 0;
            this.data.name = "";
            this.data.parent = ParentEnum.Funders;
            this.data.parent2 = 0;
            this.data.value = 0;
            this.data.valueSt = "";
            this.imageCropperSrc = null;
        },

        UpdateFunc() {
            if (this.checkUpdateValidation()) {
                const loading = ElLoading.service({
                    lock: true,
                    background: 'rgba(0, 0, 0, 0.7)',
                    text: "",
                });

                this.UpdateCode(this.data).then(Response => {
                     
                    this.$moshaToast(this.$t('general_update_operation_success_message'), {
                        hideProgressBar: 'false',
                        showIcon: 'true',
                        swipeClose: 'true',
                        type: 'success',
                        timeout: 3000,
                    });
                    loading.close();
                    this.GetCodesByParent({ parent1: ParentEnum.Funders, parent2: 0 });
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

                this.CreateCode(this.data).then(Response => {
                     
                    this.$moshaToast(this.$t('general_create_operation_success_message'), {
                        hideProgressBar: 'false',
                        showIcon: 'true',
                        swipeClose: 'true',
                        type: 'success',
                        timeout: 3000,
                    });
                    loading.close();
                    this.GetCodesByParent({ parent1: ParentEnum.Funders, parent2: 0 });
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
            const foundItem = this.getCodesData.find(element => element.id === id);
            if (foundItem) {
                this.data.id = foundItem.id;
                this.data.name = foundItem.name;
                this.data.parent = foundItem.parent || ParentEnum.Funders;
                this.data.parent2 = foundItem.parent2 || 0;
                this.data.value = foundItem.value;
                this.data.valueSt = foundItem.valueSt;
            }
        },

        DeleteFunc() {
            if (this.checkDeleteValidation()) {
                const loading = ElLoading.service({
                    lock: true,
                    background: 'rgba(0, 0, 0, 0.7)',
                    text: "",
                });

                this.DeleteCode(this.data.id).then(Response => {
                     
                    this.$moshaToast(this.$t('general_delete_operation_success_message'), {
                        hideProgressBar: 'false',
                        showIcon: 'true',
                        swipeClose: 'true',
                        type: 'success',
                        timeout: 3000,
                    });
                    loading.close();
                    this.GetCodesByParent({ parent1: ParentEnum.Funders, parent2: 0 });
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


    }
};
</script>
<template>
    <!-- Page Header -->
    <div class="page-header">
        <div class="row">
            <div class="col-sm-12">
                <h3 class="page-title">{{ $t('code_funders_title') }}</h3>
                <!-- <ul class="breadcrumb">
                                <li class="breadcrumb-item active">BodyType page</li>
                            </ul> -->
            </div>
            <div class="col-12 row">
				<!-- <div class="col-4 col-sm-4 row align-items-center">
					<div class=" col-sm-12">
						<input @input="SearchChange" v-model="dataSearch.name" type="text" class="form-control"
							placeholder="الإسم">
					</div>
				</div> -->
				<div class="col-4">
					<a href="#add_modal" data-toggle="modal" v-on:click="clearData()"
						class="btn btn-primary float-left mt-2">{{ $t('general_create_button') }}</a>
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
                                    <!-- <th class="text-center">{{ $t('general_table_value_item') }}</th>
                                    <th class="text-center">{{ $t('general_table_value_st_item') }}</th> -->
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in getCodesData">
                                    <td class="text-center">{{ index + 1 }}</td>
                                    <td class="text-center">{{ item.name }}</td>
                                    <!-- <td class="text-center">{{ item.value }}</td> -->
                                    <!-- <td class="text-center" v-if="isImageValue(item.id)">
                                        <img :src="item.valueSt" class="img-responsive rounded" alt="image" height="80">
                                    </td>
                                    <td class="text-center" v-else>{{ item.valueSt }}</td> -->
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
                            <div class="col-12 col-sm-12">
								<div class="form-group">
									<label>{{ $t('general_modal_name_input') }}</label>
									<input v-model="data.name" type="text" class="form-control">
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
                            <div class="col-12 col-sm-12">
                                <div class="form-group">
                                    <label>{{ $t('general_modal_name_input') }}</label>
                                    <input v-model="data.name" type="text" class="form-control">
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