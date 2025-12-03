<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { ElLoading } from 'element-plus';
import { ParentEnum, UserTypeEnum } from '@/config/config.js'

export default {
    data() {
        return {
            data: {
                id: 0,
                teamId: 0,
                funderCFK: 0,
                projectCFK: 0,
                destinationCFK: 0,
                peopleCount: 0,
                date: new Date().toISOString().split('T')[0],
                note: "",
            },

            dataSearch: {
                teamId: 0,
                funder: 0,
                project: 0,
                destination: 0,
                fromDate: "",
                toDate: "",
                searchText: "",
            },

            pagination: {
                page: 1,
                pageSize: 5,
                sortColumn: "",
                sortDirection: "ascending",
            },

            excelFile: null,

            // Store codes separately
            fundersList: [],
            projectsList: [],
            destinationsList: [],
        }
    },
    mounted() {
        // Load dropdown data on mount
        this.loadTeams();
        this.loadFunders();
        this.loadProjects();
        this.loadDestinations();
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
        ...mapGetters("Projects", ["getProjectsData", "getProjectsPagination"]),
        ...mapGetters("Users", ["getTeamsData", "getUserInfo"]),

        isAdmin() {
            return this.getUserInfo?.userType === UserTypeEnum.Admin;
        },

        userTeamId() {
            return this.getUserInfo?.teamId || 0;
        },

        getFundersData() {
            return this.fundersList || [];
        },

        getProjectsListData() {
            return this.projectsList || [];
        },

        getDestinationsData() {
            return this.destinationsList || [];
        },

        totalPages() {
            return this.getProjectsPagination?.totalPages || 0;
        },

        currentPage() {
            return this.getProjectsPagination?.currentPage || 1;
        },

        totalItems() {
            return this.getProjectsPagination?.totalItems || 0;
        },

        pageSize() {
            return this.getProjectsPagination?.pageSize || 5;
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

    },
    methods: {
        ...mapActions("Projects", ["GetAllProjects", "CreateProject", "UpdateProject", "DeleteProject", "CreateProjectsFromExcel"]),
        ...mapActions("Users", ["GetTeams"]),
        ...mapActions("Code", ["GetCodesByParent"]),

        loadTeams() {
            this.GetTeams({ name: "" }).catch(error => {
                console.error("Error loading teams:", error);
            });
        },

        loadFunders() {
            this.GetCodesByParent({ parent1: ParentEnum.Funders, parent2: 0 }).then(response => {
                this.fundersList = response || [];
            }).catch(error => {
                console.error("Error loading funders:", error);
            });
        },

        loadProjects() {
            this.GetCodesByParent({ parent1: ParentEnum.Projects, parent2: 0 }).then(response => {
                this.projectsList = response || [];
            }).catch(error => {
                console.error("Error loading projects:", error);
            });
        },

        loadDestinations() {
            this.GetCodesByParent({ parent1: ParentEnum.Destinations, parent2: 0 }).then(response => {
                this.destinationsList = response || [];
            }).catch(error => {
                console.error("Error loading destinations:", error);
            });
        },

        searchFunc() {
            this.pagination.page = 1; // Reset to first page on search
            this.getDataFunc();
        },

        onTeamChangeInSearch() {
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

            return this.GetAllProjects(searchParams).then(response => {
                // console.log("response : ", response );
                // console.log("this.getProjectsPagination : ", this.getProjectsPagination );
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
            // Set teamId based on user role
            if (!this.isAdmin && this.userTeamId > 0) {
                this.data.teamId = this.userTeamId;
            } else {
                this.data.teamId = 0;
            }
            this.data.funderCFK = 0;
            this.data.projectCFK = 0;
            this.data.destinationCFK = 0;
            this.data.peopleCount = 0;
            this.data.date = new Date().toISOString().split('T')[0];
            this.data.note = "";
        },

        UpdateFunc() {
            if (this.checkUpdateValidation()) {
                const loading = ElLoading.service({
                    lock: true,
                    background: 'rgba(0, 0, 0, 0.7)',
                    text: "",
                });

                this.UpdateProject(this.data).then(Response => {
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
            if (this.data.teamId == 0) {
                this.$moshaToast('الفريق ' + ' ' + this.$t('general_required'), {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'warning',
                    timeout: 3000,
                });
                return false;
            }
            if (this.data.funderCFK == 0) {
                this.$moshaToast('الممول ' + ' ' + this.$t('general_required'), {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'warning',
                    timeout: 3000,
                });
                return false;
            }
            if (this.data.projectCFK == 0) {
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
            if (this.data.destinationCFK == 0) {
                this.$moshaToast('الوجهة ' + ' ' + this.$t('general_required'), {
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

                this.CreateProject(this.data).then(Response => {
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
            const foundItem = this.getProjectsPagination.data.find(element => element.id === id);
            if (foundItem) {
                this.data.id = foundItem.id;
                this.data.teamId = foundItem.teamId || 0;
                this.data.funderCFK = foundItem.funderCFK || 0;
                this.data.projectCFK = foundItem.projectCFK || 0;
                this.data.destinationCFK = foundItem.destinationCFK || 0;
                this.data.peopleCount = foundItem.peopleCount || 0;
                this.data.date = foundItem.date ? foundItem.date.split('T')[0] : new Date().toISOString().split('T')[0];
                this.data.note = foundItem.note || "";
            }
        },
        
        goToProjectPeople(id){
            // Find the project item to get the projectCFK
            const foundItem = this.getProjectsPagination.data.find(element => element.id === id);
            console.log("foundItem : ", foundItem );
            if (foundItem && foundItem.id) {
                // Navigate to ProjectsPeopleManagement with the projectCFK as projectId
                this.$router.push({ 
                    name: 'projects_people_management',
                    query: { projectId: foundItem.id }
                });
            } else {
                this.$moshaToast('لا يمكن العثور على المشروع', {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'warning',
                    timeout: 3000,
                });
            }
        },

        DeleteFunc() {
            if (this.checkDeleteValidation()) {
                const loading = ElLoading.service({
                    lock: true,
                    background: 'rgba(0, 0, 0, 0.7)',
                    text: "",
                });

                this.DeleteProject(this.data.id).then(Response => {
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

        handleExcelUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const allowedExtensions = ['.xlsx', '.xls'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                this.$moshaToast('صيغة الملف غير صحيحة. يرجى رفع ملف Excel (.xlsx أو .xls)', {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'warning',
                    timeout: 3000,
                });
                return;
            }

            this.excelFile = file;
        },

        uploadExcelFunc() {
            if (!this.excelFile) {
                this.$moshaToast('يرجى اختيار ملف Excel', {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'warning',
                    timeout: 3000,
                });
                return;
            }

            const loading = ElLoading.service({
                lock: true,
                background: 'rgba(0, 0, 0, 0.7)',
                text: "",
            });

            this.CreateProjectsFromExcel(this.excelFile).then(Response => {
                console.log(Response);
                this.$moshaToast('تم رفع الملف بنجاح', {
                    hideProgressBar: 'false',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'success',
                    timeout: 3000,
                });
                loading.close();
                this.getDataFunc();
                $('#excel_modal').modal('hide');
                this.excelFile = null;
                // Reset file input
                const fileInput = document.getElementById('excelFileInput');
                if (fileInput) fileInput.value = '';
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
    <!-- Page Header -->
    <div class="page-header">
        <div class="row">
            <div class="col-sm-12">
                <h3 class="page-title">إدارة المشاريع</h3>
            </div>
            <div class="col-12 row mt-3">
                <!-- Filters Row 1 -->
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>الفريق</label>
                    <select v-model="dataSearch.teamId" class="form-control" @change="onTeamChangeInSearch()">
                        <option value="0">-- إختر الفريق --</option>
                        <option v-for="team in getTeamsData" :key="team.id" :value="team.id">{{ team.name }}</option>
                    </select>
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>الممول</label>
                    <select v-model="dataSearch.funder" class="form-control" @change="searchFunc()">
                        <option value="0">-- إختر جهة التمويل --</option>
                        <option v-for="funder in getFundersData" :key="funder.id" :value="funder.id">{{ funder.name }}
                        </option>
                    </select>
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>المشروع</label>
                    <select v-model="dataSearch.project" class="form-control" @change="searchFunc()">
                        <option value="0">-- إختر المشروع --</option>
                        <option v-for="project in getProjectsListData" :key="project.id" :value="project.id">{{ project.name
                            }}</option>
                    </select>
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>الوجهة</label>
                    <select v-model="dataSearch.destination" class="form-control" @change="searchFunc()">
                        <option value="0">-- إختر المنطقة --</option>
                        <option v-for="destination in getDestinationsData" :key="destination.id" :value="destination.id">{{
                            destination.name }}</option>
                    </select>
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>من تاريخ</label>
                    <input v-model="dataSearch.fromDate" type="date" class="form-control" @change="searchFunc()">
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>إلى تاريخ</label>
                    <input v-model="dataSearch.toDate" type="date" class="form-control" @change="searchFunc()">
                </div>
                <!-- <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>بحث</label>
                    <input v-model="dataSearch.searchText" type="text" class="form-control" @input="searchFunc()" placeholder="بحث...">
                </div> -->
                <!-- Action Buttons -->
                <div class="col-12 mt-2">
                    <a href="#add_modal" data-toggle="modal" v-on:click="clearData()"
                        class="btn btn-primary float-left">{{ $t('general_create_button') }}</a>
                    <!-- <a href="#excel_modal" data-toggle="modal" class="btn btn-success float-left">رفع من Excel</a> -->
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
                                    <th class="text-center">الفريق</th>
                                    <th class="text-center">جهة التمويل</th>
                                    <th class="text-center">المشروع</th>
                                    <th class="text-center">الوجهة</th>
                                    <th class="text-center">عدد الأشخاص</th>
                                    <th class="text-center">التاريخ</th>
                                    <th class="text-center">الملاحظات</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in getProjectsPagination.data" :key="item.id">
                                    <td class="text-center">{{ (currentPage - 1) * pagination.pageSize + index + 1 }}
                                    </td>
                                    <td class="text-center">{{ item.teamName || '-' }}</td>
                                    <td class="text-center">{{ item.funder || '-' }}</td>
                                    <td class="text-center">{{ item.project || '-' }}</td>
                                    <td class="text-center">{{ item.destination || '-' }}</td>
                                    <td class="text-center">{{ item.peopleCount || 0 }}</td>
                                    <td class="text-center">{{ item.date ? item.date.split('T')[0] : '' }}</td>
                                    <td class="text-center">{{ item.note || '-' }}</td>
                                    <td class="text-right">
                                        <div class="actions">
                                            <a class="btn btn-sm bg-success-light"
                                                 v-on:click.prevent="goToProjectPeople(item.id)">
                                                <i data-feather="edit"></i> مستفيدين المشروع
                                            </a>
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
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>الفريق</label>
                                    <select v-model="data.teamId" class="form-control">
                                        <option value="0">-- إختر الفريق --</option>
                                        <option v-for="team in getTeamsData" :key="team.id" :value="team.id">{{ team.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>الممول</label>
                                    <select v-model="data.funderCFK" class="form-control">
                                        <option value="0">-- إختر جهة التمويل --</option>
                                        <option v-for="funder in getFundersData" :key="funder.id" :value="funder.id">{{
                                            funder.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>المشروع</label>
                                    <select v-model="data.projectCFK" class="form-control">
                                        <option value="0">-- إختر المشروع --</option>
                                        <option v-for="project in getProjectsListData" :key="project.id" :value="project.id">{{ project.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>المنطقة</label>
                                    <select v-model="data.destinationCFK" class="form-control">
                                        <option value="0">-- إختر المنطقة --</option>
                                        <option v-for="destination in getDestinationsData" :key="destination.id" :value="destination.id">{{ destination.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>عدد المستفيدين</label>
                                    <input v-model="data.peopleCount" type="number" class="form-control">
                                </div>
                            </div>
                            <div class="col-12 col-sm-12">
                                <div class="form-group">
                                    <label>التاريخ</label>
                                    <input v-model="data.date" type="date" class="form-control">
                                </div>
                            </div>
                            <div class="col-12 col-sm-12">
                                <div class="form-group">
                                    <label>الملاحظات</label>
                                    <textarea v-model="data.note" class="form-control" rows="3"></textarea>
                                </div>
                            </div>
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
                            <div class="col-12 col-sm-6" v-if="isAdmin">
                                <div class="form-group">
                                    <label>الفريق</label>
                                    <select v-model="data.teamId" class="form-control">
                                        <option value="0">-- إختر الفريق --</option>
                                        <option v-for="team in getTeamsData" :key="team.id" :value="team.id">{{ team.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>الممول</label>
                                    <select v-model="data.funderCFK" class="form-control">
                                        <option value="0">-- إختر جهة التمويل --</option>
                                        <option v-for="funder in getFundersData" :key="funder.id" :value="funder.id">{{ funder.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>المشروع</label>
                                    <select v-model="data.projectCFK" class="form-control">
                                        <option value="0">-- إختر المشروع --</option>
                                        <option v-for="project in getProjectsListData" :key="project.id" :value="project.id">{{ project.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>المنطقة</label>
                                    <select v-model="data.destinationCFK" class="form-control">
                                        <option value="0">-- إختر المنطقة --</option>
                                        <option v-for="destination in getDestinationsData" :key="destination.id" :value="destination.id">{{ destination.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>عدد المستفيدين</label>
                                    <input v-model="data.peopleCount" type="number" class="form-control">
                                </div>
                            </div>
                            <div class="col-12 col-sm-12">
                                <div class="form-group">
                                    <label>التاريخ</label>
                                    <input v-model="data.date" type="date" class="form-control">
                                </div>
                            </div>
                            <div class="col-12 col-sm-12">
                                <div class="form-group">
                                    <label>الملاحظات</label>
                                    <textarea v-model="data.note" class="form-control" rows="3"></textarea>
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
                        <button type="button" v-on:click="DeleteFunc()" class="btn btn-primary">{{
                            $t('general_delete_button') }}</button>
                        <button type="button" class="btn btn-danger" data-dismiss="modal">{{
                            $t('general_cancele_button') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Delete Modal -->

    <!-- Excel Upload Modal -->
    <div class="modal fade" id="excel_modal" aria-hidden="true" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">رفع المشاريع من Excel</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div>
                        <div class="form-group">
                            <label>اختر ملف Excel (.xlsx أو .xls)</label>
                            <input id="excelFileInput" type="file" accept=".xlsx,.xls" @change="handleExcelUpload"
                                class="form-control">
                            <small class="form-text text-muted">
                                يجب أن يحتوي الملف على الأعمدة التالية بالترتيب:<br>
                                1. الفريق <br>
                                2. الممول <br>
                                3. المشروع <br>
                                4. الوجهة <br>
                                5. عدد الأشخاص <br>
                                6. التاريخ <br>
                                7. الملاحظات
                            </small>
                        </div>
                        <button v-on:click="uploadExcelFunc()" class="btn btn-success btn-block">رفع الملف</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Excel Upload Modal -->

</template>
<style scoped>
.text-right a {
    margin-left: 5px;
}

.modal-body button {
    margin: 5px;
}
</style>
