<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { ElLoading } from 'element-plus';
import { ParentEnum } from '@/config/config.js'

export default {
    data() {
        return {
            data: {
                id: 0,
                projectId: 0,
                ssn: "",
                statusCFK: 0,
                note: "",
            },

            dataSearch: {
                projectId: 0,
                name: "",
                ssn: "",
                status: 0,
                searchText: "",
            },

            pagination: {
                page: 1,
                pageSize: 5,
                sortColumn: "",
                sortDirection: "ascending",
            },

            // Store codes separately
            projectsList: [],
            statusList: [],
        }
    },
    mounted() {
        // Load dropdown data on mount
        this.loadProjects();
        this.loadStatuses();
    },
    components: {

    },

    emits: {

    },

    created() {
        // Check if projectId is passed in route query
        if (this.$route.query.projectId) {
            const projectId = parseInt(this.$route.query.projectId);
            if (projectId && projectId > 0) {
                this.dataSearch.projectId = projectId;
                this.data.projectId = projectId; // Also set in data for create/edit forms
            }
        }
        // Call the function from the store directly when the component is created
        this.initFunc();
    },

    computed: {
        ...mapGetters("PeopleProjects", ["getPeopleProjectsData", "getPeopleProjectsPagination"]),

        getProjectsListData() {
            return this.projectsList || [];
        },

        getStatusListData() {
            return this.statusList || [];
        },

        totalPages() {
            return this.getPeopleProjectsPagination?.totalPages || 0;
        },

        currentPage() {
            return this.getPeopleProjectsPagination?.currentPage || 1;
        },

        totalItems() {
            return this.getPeopleProjectsPagination?.totalItems || 0;
        },

        pageSize() {
            return this.getPeopleProjectsPagination?.pageSize || 5;
        },

        startItem() {
            if (this.totalItems === 0) return 0;
            return ((this.currentPage - 1) * this.pageSize) + 1;
        },

        endItem() {
            const end = this.currentPage * this.pageSize;
            return end > this.totalItems ? this.totalItems : end;
        },

        paginationPages() {
            const pages = [];
            const total = this.totalPages;
            const current = this.currentPage;
            
            // Show max 5 page numbers
            let start = Math.max(1, current - 2);
            let end = Math.min(total, current + 2);
            
            // Adjust if we're near the start or end
            if (end - start < 4) {
                if (start === 1) {
                    end = Math.min(total, start + 4);
                } else if (end === total) {
                    start = Math.max(1, end - 4);
                }
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            return pages;
        },

        currentProjectName() {
            // Get project name from any row in the pagination data
            if (this.getPeopleProjectsPagination?.data && this.getPeopleProjectsPagination.data.length > 0) {
                const firstItem = this.getPeopleProjectsPagination.data[0];
                return firstItem.project || firstItem.projectName || '';
            }
            return '';
        },

    },
    methods: {
        ...mapActions("PeopleProjects", ["GetPeopleProjectsByProjectId", "CreatePeopleProject", "UpdatePeopleProject", "DeletePeopleProject"]),
        ...mapActions("Code", ["GetCodesByParent"]),

        loadProjects() {
            this.GetCodesByParent({ parent1: ParentEnum.Projects, parent2: 0 }).then(response => {
                this.projectsList = response || [];
            }).catch(error => {
                console.error("Error loading projects:", error);
            });
        },

        loadStatuses() {
            this.GetCodesByParent({ parent1: ParentEnum.PeopleProjectStatus, parent2: 0 }).then(response => {
                this.statusList = response || [];
            }).catch(error => {
                console.error("Error loading statuses:", error);
            });
        },

        searchFunc() {
            this.pagination.page = 1; // Reset to first page on search
            this.getDataFunc();
        },

        onProjectChangeInSearch() {
            this.searchFunc();
        },

        initFunc() {
            const loading = ElLoading.service({
                lock: true,
                background: 'rgba(0, 0, 0, 0.7)',
                text: "",
            });

            this.getDataFunc().then(() => {
                loading.close();
            }).catch(() => {
                loading.close();
            });
        },

        getDataFunc() {
            const searchParams = {
                ...this.dataSearch,
                ...this.pagination
            };

            return this.GetPeopleProjectsByProjectId(searchParams).then(response => {
                // console.log("response : ", response );
                // console.log("this.getPeopleProjectsPagination : ", this.getPeopleProjectsPagination );
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
                        type: 'warning',
                        timeout: 3000,
                    });
                }
            });
        },

        clearData() {
            this.data.id = 0;
            // Keep projectId from route query if available, otherwise reset to 0
            if (!this.$route.query.projectId) {
                this.data.projectId = 0;
            } else {
                const projectId = parseInt(this.$route.query.projectId);
                this.data.projectId = projectId && projectId > 0 ? projectId : 0;
            }
            this.data.ssn = "";
            this.data.statusCFK = 0;
            this.data.note = "";
        },

        UpdateFunc() {
            if (this.checkUpdateValidation()) {
                const loading = ElLoading.service({
                    lock: true,
                    background: 'rgba(0, 0, 0, 0.7)',
                    text: "",
                });

                this.UpdatePeopleProject(this.data).then(Response => {
                    console.log(Response);
                    this.$moshaToast(this.$t('general_update_operation_success_message'), {
                        hideProgressBar: 'false',
                        showIcon: 'true',
                        swipeClose: 'true',
                        type: 'success',
                        timeout: 3000,
                    });
                    loading.close();
                    this.getDataFunc();
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
                        this.$moshaToast(error.response?.data?.message || 'An error occurred', {
                            hideProgressBar: 'false',
                            position: 'top-center',
                            showIcon: 'true',
                            swipeClose: 'true',
                            type: 'warning',
                            timeout: 3000,
                        });
                    }
                    loading.close();
                });
            }
        },

        checkCreateValidation() {
            if (this.data.projectId == 0) {
                this.$moshaToast('المشروع ' + ' ' + this.$t('general_required'), {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'warning',
                    timeout: 3000,
                });
                return false;
            }
            if (!this.data.ssn || this.data.ssn.trim() === "") {
                this.$moshaToast('رقم الهوية ' + ' ' + this.$t('general_required'), {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'warning',
                    timeout: 3000,
                });
                return false;
            }
            if (this.data.statusCFK == 0) {
                this.$moshaToast('الحالة ' + ' ' + this.$t('general_required'), {
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
            }
            return this.checkCreateValidation();
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

                this.CreatePeopleProject(this.data).then(Response => {
                    console.log(Response);
                    this.$moshaToast(this.$t('general_create_operation_success_message'), {
                        hideProgressBar: 'false',
                        showIcon: 'true',
                        swipeClose: 'true',
                        type: 'success',
                        timeout: 3000,
                    });
                    loading.close();
                    this.getDataFunc();
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
                        this.$moshaToast(error.response?.data?.message || 'An error occurred', {
                            hideProgressBar: 'false',
                            position: 'top-center',
                            showIcon: 'true',
                            swipeClose: 'true',
                            type: 'warning',
                            timeout: 3000,
                        });
                    }
                    loading.close();
                });
            }
        },

        selectItem(id) {
            this.clearData();
            const foundItem = this.getPeopleProjectsPagination.data.find(element => element.id === id);
            if (foundItem) {
                this.data.id = foundItem.id;
                this.data.projectId = foundItem.projectId || 0;
                this.data.ssn = foundItem.ssn || "";
                this.data.statusCFK = foundItem.statusCFK || 0;
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

                this.DeletePeopleProject(this.data.id).then(Response => {
                    console.log(Response);
                    this.$moshaToast(this.$t('general_delete_operation_success_message'), {
                        hideProgressBar: 'false',
                        showIcon: 'true',
                        swipeClose: 'true',
                        type: 'success',
                        timeout: 3000,
                    });
                    loading.close();
                    this.getDataFunc();
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
                        this.$moshaToast(error.response?.data?.message || 'An error occurred', {
                            hideProgressBar: 'false',
                            position: 'top-center',
                            showIcon: 'true',
                            swipeClose: 'true',
                            type: 'warning',
                            timeout: 3000,
                        });
                    }
                    loading.close();
                });
            }
        },

        changePage(page) {
            this.pagination.page = page;
            this.getDataFunc();
        },

        changePageSize(size) {
            this.pagination.pageSize = size;
            this.pagination.page = 1;
            this.getDataFunc();
        },
    }
};
</script>
<template>
    <!-- Breadcrumb Navigation -->
    <div class="bread">
        <nav>
            <div class="container">
                <ol class="breadcrumb">
                    <!-- <li class="breadcrumb-item">
                        <router-link to="/" :class="{ active: $route.path === '/' }">الرئيسية</router-link>
                    </li> -->
                    <li class="breadcrumb-item">
                        <router-link to="/projects_management" :class="{ active: $route.path === '/projects_management' }">إدارة المشاريع</router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page" v-if="currentProjectName">
                        {{ currentProjectName }}
                    </li>
                </ol>
            </div>
        </nav>
    </div>
    <!-- /Breadcrumb Navigation -->
    
    <!-- Page Header -->
    <div class="page-header">
        <div class="row">
            <div class="col-sm-12">
                <h3 class="page-title">إدارة مستفيدين المشاريع</h3>
            </div>
            <div class="col-12 row mt-3">
                <!-- Filters Row 1 -->
                <!-- <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>المشروع</label>
                    <select v-model="dataSearch.projectId" class="form-control" @change="onProjectChangeInSearch()">
                        <option value="0">-- إختر المشروع --</option>
                        <option v-for="project in getProjectsListData" :key="project.id" :value="project.id">{{ project.name }}</option>
                    </select>
                </div> -->
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>الاسم</label>
                    <input v-model="dataSearch.name" type="text" class="form-control" @input="searchFunc()" placeholder="بحث بالاسم...">
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>رقم الهوية</label>
                    <input v-model="dataSearch.ssn" type="text" class="form-control" @input="searchFunc()" placeholder="بحث برقم الهوية...">
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>الحالة</label>
                    <select v-model="dataSearch.status" class="form-control" @change="searchFunc()">
                        <option value="0">-- إختر الحالة --</option>
                        <option v-for="status in getStatusListData" :key="status.id" :value="status.id">{{ status.name }}</option>
                    </select>
                </div>
                <!-- <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>بحث</label>
                    <input v-model="dataSearch.searchText" type="text" class="form-control" @input="searchFunc()" placeholder="بحث...">
                </div> -->
                <!-- Action Buttons -->
                <div class="col-12 mt-2">
                    <a href="#add_modal" data-toggle="modal" v-on:click="clearData()"
                        class="btn btn-primary float-left">{{ $t('general_create_button') }}</a>
                </div>
            </div>
        </div>
    </div>
    <!-- /Page Header -->

    <div class="row">
        <div class="col-12 mt-2">
            <label>عدد العناصر في الصفحة:</label>
            <select v-model="pagination.pageSize" @change="changePageSize(pagination.pageSize)"
                class="form-control d-inline-block w-auto ml-2">
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
            </select>
        </div>
        <div class="col-sm-12">
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="datatable table table-hover table-center mb-0">
                            <thead>
                                <tr>
                                    <th class="text-center">ID</th>
                                    <!-- <th class="text-center">المشروع</th> -->
                                    <th class="text-center">اسم الشخص</th>
                                    <th class="text-center">رقم الهوية</th>
                                    <th class="text-center">الجوال</th>
                                    <th class="text-center">الحالة</th>
                                    <th class="text-center">الملاحظات</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in getPeopleProjectsPagination.data" :key="item.id">
                                    <td class="text-center">{{ (currentPage - 1) * pagination.pageSize + index + 1 }}</td>
                                    <!-- <td class="text-center">{{ item.project || '-' }}</td> -->
                                    <td class="text-center">{{ item.peopleName || '-' }}</td>
                                    <td class="text-center">{{ item.ssn || '-' }}</td>
                                    <td class="text-center">{{ item.moblie || '-' }}</td>
                                    <td class="text-center">{{ item.status || '-' }}</td>
                                    <td class="text-center">{{ item.note || '-' }}</td>
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
                    <!-- Pagination -->
                    <div class="row mt-3" v-if="totalItems > 0">
                        <div class="col-sm-12 col-md-5">
                            <div class="dataTables_info" role="status" aria-live="polite">
                                عرض {{ startItem }} إلى {{ endItem }} من {{ totalItems }} إدخال
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-7">
                            <div class="dataTables_paginate paging_simple_numbers">
                                <ul class="pagination justify-content-end">
                                    <li class="paginate_button page-item previous" :class="{ disabled: currentPage === 1 }">
                                        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)"
                                            :tabindex="currentPage === 1 ? -1 : 0">السابق</a>
                                    </li>
                                    <li class="paginate_button page-item" v-for="page in paginationPages" :key="page"
                                        :class="{ active: page === currentPage }">
                                        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                                    </li>
                                    <li class="paginate_button page-item next" :class="{ disabled: currentPage === totalPages }">
                                        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)"
                                            :tabindex="currentPage === totalPages ? -1 : 0">التالي</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
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
                                    <label>الحالة</label>
                                    <select v-model="data.statusCFK" class="form-control">
                                        <option value="0">-- إختر الحالة --</option>
                                        <option v-for="status in getStatusListData" :key="status.id" :value="status.id">{{ status.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-12">
                                <div class="form-group">
                                    <label>الملاحظات</label>
                                    <textarea v-model="data.note" class="form-control" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                        <button v-on:click="UpdateFunc()" class="btn btn-primary btn-block">{{ $t('general_save_button') }}</button>
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
                                    <label>رقم الهوية</label>
                                    <input v-model="data.ssn" type="text" class="form-control" placeholder="رقم الهوية">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>الحالة</label>
                                    <select v-model="data.statusCFK" class="form-control">
                                        <option value="0">-- إختر الحالة --</option>
                                        <option v-for="status in getStatusListData" :key="status.id" :value="status.id">{{ status.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-12">
                                <div class="form-group">
                                    <label>الملاحظات</label>
                                    <textarea v-model="data.note" class="form-control" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                        <button v-on:click="CreateFunc()" class="btn btn-primary btn-block">{{ $t('general_save_button') }}</button>
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

</template>
<style scoped>
.text-right a {
    margin-left: 5px;
}

.modal-body button {
    margin: 5px;
}
</style>
