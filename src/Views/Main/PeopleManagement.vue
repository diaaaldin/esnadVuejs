<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { ElLoading } from 'element-plus';
import { ParentEnum } from '@/config/config.js'

export default {
    data() {
        return {
            data: {
                id: 0,
                name: "",
                mobile: "",
                ssn: "",
                destinationCFK: 0,
                address: "",
                note: "",
            },

            dataSearch: {
                name: "",
                ssn: "",
                projectId: 0,
                exceptionPeriod: 0,
                searchText: "",
            },

            pagination: {
                page: 1,
                pageSize: 5,
                sortColumn: "",
                sortDirection: "ascending",
            },

            excelFile: null,
            excelProjectId: 0,
            excelExceptionPeriod: 0,

            // Multi-select for bulk delete
            selectedItems: [],

            // Store codes separately
            projectsList: [],
            destinationsList: [],
            allProjectsList: [], // Store all projects from API
        }
    },
    mounted() {
        // Load dropdown data on mount
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
        ...mapGetters("People", ["getPeopleDataList", "getPeoplePagination"]),
        ...mapGetters("Projects", ["getProjectsPagination"]),

        getProjectsListData() {
            return this.projectsList || [];
        },

        // Get last 10 projects for Excel modal
        getLast10Projects() {
            if (!this.allProjectsList || this.allProjectsList.length === 0) {
                return [];
            }
            // Sort by id descending and take first 10
            return [...this.allProjectsList]
                .sort((a, b) => (b.id || 0) - (a.id || 0))
                .slice(0, 10);
        },

        // Get exception period options with Arabic labels
        getExceptionPeriodOptions() {
            const options = [];
            for (let i = 1; i <= 12; i++) {
                options.push({
                    value: i,
                    label: this.getExceptionPeriodLabel(i)
                });
            }
            return options;
        },

        getDestinationsData() {
            return this.destinationsList || [];
        },

        totalPages() {
            return this.getPeoplePagination?.totalPages || 0;
        },

        currentPage() {
            return this.getPeoplePagination?.currentPage || 1;
        },

        totalItems() {
            return this.getPeoplePagination?.totalItems || 0;
        },

        pageSize() {
            return this.getPeoplePagination?.pageSize || 5;
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

        isAllSelected() {
            if (this.getPeoplePagination.data.length === 0) return false;
            return this.getPeoplePagination.data.every(item => this.selectedItems.includes(item.id));
        },

        hasSelectedItems() {
            return this.selectedItems.length > 0;
        },
    },
    methods: {
        ...mapActions("People", ["GetAllPeople", "CreatePeople", "UpdatePeople", "DeletePeople", "DeleteMultiPeople", "CreatePeopleFromExcel"]),
        ...mapActions("Projects", ["GetAllProjects"]),
        ...mapActions("Code", ["GetCodesByParent"]),

        loadProjects() {
            // Load projects from Projects API for search dropdown
            this.GetCodesByParent({ parent1: ParentEnum.Projects, parent2: 0 }).then(response => {
                this.projectsList = response || [];
            }).catch(error => {
                console.error("Error loading projects from code:", error);
            });

            // Load all projects from Projects API for Excel modal (last 10)
            this.GetAllProjects({
                teamId: 0,
                funder: 0,
                project: 0,
                destination: 0,
                fromDate: "",
                toDate: "",
                page: 1,
                pageSize: 100, // Get more to ensure we have enough
                sortColumn: "id",
                sortDirection: "descending",
                searchText: ""
            }).then(() => {
                // Get projects from pagination
                const projectsData = this.getProjectsPagination?.data || [];
                this.allProjectsList = projectsData;
            }).catch(error => {
                console.error("Error loading projects from API:", error);
            });
        },

        loadDestinations() {
            this.GetCodesByParent({ parent1: ParentEnum.Destinations, parent2: 0 }).then(response => {
                this.destinationsList = response || [];
            }).catch(error => {
                console.error("Error loading destinations:", error);
            });
        },

        getExceptionPeriodLabel(period) {
            if (period === 1) {
                return "1 شهر";
            } else if (period === 2) {
                return "شهرين";
            } else {
                return `${period} أشهر`;
            }
        },

        searchFunc() {
            this.pagination.page = 1; // Reset to first page on search
            this.getDataFunc();
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

            return this.GetAllPeople(searchParams).then(response => {
                // Clear selections when data changes
                this.selectedItems = [];
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
            this.data.name = "";
            this.data.mobile = "";
            this.data.ssn = "";
            this.data.destinationCFK = 0;
            this.data.address = "";
            this.data.note = "";
        },

        UpdateFunc() {
            if (this.checkUpdateValidation()) {
                const loading = ElLoading.service({
                    lock: true,
                    background: 'rgba(0, 0, 0, 0.7)',
                    text: "",
                });

                this.UpdatePeople(this.data).then(Response => {
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
            if (this.data.name == "" || this.data.name.trim() == "") {
                this.$moshaToast('الاسم ' + ' ' + this.$t('general_required'), {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'warning',
                    timeout: 3000,
                });
                return false;
            }
            if (this.data.ssn == "" || this.data.ssn.trim() == "") {
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

                this.CreatePeople(this.data).then(Response => {
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
            const foundItem = this.getPeoplePagination.data.find(element => element.id === id);
            if (foundItem) {
                this.data.id = foundItem.id;
                this.data.name = foundItem.name || "";
                this.data.mobile = foundItem.mobile || "";
                this.data.ssn = foundItem.ssn || "";
                this.data.destinationCFK = foundItem.destinationCFK || 0;
                this.data.address = foundItem.address || "";
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

                this.DeletePeople(this.data.id).then(Response => {
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

            if (this.excelProjectId == 0) {
                this.$moshaToast('يرجى اختيار المشروع', {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'warning',
                    timeout: 3000,
                });
                loading.close();
                return;
            }

            this.CreatePeopleFromExcel({ 
                file: this.excelFile, 
                projectId: this.excelProjectId, 
                exceptionPeriod: this.excelExceptionPeriod 
            }).then(Response => {
                if (Response && Response.isFileDownload) {
                    this.$moshaToast(Response.message || 'تم تنزيل ملف الصفوف المرفوضة', {
                        hideProgressBar: 'false',
                        showIcon: 'true',
                        swipeClose: 'true',
                        type: 'warning',
                        timeout: 5000,
                    });
                } else {
                    this.$moshaToast('تم رفع الملف بنجاح', {
                        hideProgressBar: 'false',
                        showIcon: 'true',
                        swipeClose: 'true',
                        type: 'success',
                        timeout: 3000,
                    });
                }
                loading.close();
                this.getDataFunc();
                $('#excel_modal').modal('hide');
                this.excelFile = null;
                this.excelProjectId = 0;
                this.excelExceptionPeriod = 0;
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

        // Multi-select methods
        toggleSelectAll() {
            if (this.isAllSelected) {
                this.selectedItems = [];
            } else {
                this.selectedItems = this.getPeoplePagination.data.map(item => item.id);
            }
        },

        toggleSelectItem(id) {
            const index = this.selectedItems.indexOf(id);
            if (index > -1) {
                this.selectedItems.splice(index, 1);
            } else {
                this.selectedItems.push(id);
            }
        },

        isItemSelected(id) {
            return this.selectedItems.includes(id);
        },

        DeleteMultiFunc() {
            if (this.selectedItems.length === 0) {
                this.$moshaToast('يرجى اختيار عنصر واحد على الأقل للحذف', {
                    hideProgressBar: false,
                    position: 'top-center',
                    showIcon: true,
                    swipeClose: true,
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

            this.DeleteMultiPeople(this.selectedItems).then(Response => {
                this.$moshaToast(`تم حذف ${this.selectedItems.length} عنصر بنجاح`, {
                    hideProgressBar: false,
                    showIcon: true,
                    swipeClose: true,
                    type: 'success',
                    timeout: 3000,
                });
                loading.close();
                this.selectedItems = [];
                this.getDataFunc();
            }).catch(error => {
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
                    this.$moshaToast(error.response?.data?.message || 'حدث خطأ أثناء حذف العناصر', {
                        hideProgressBar: false,
                        position: 'top-center',
                        showIcon: true,
                        swipeClose: true,
                        type: 'warning',
                        timeout: 3000,
                    });
                }
                loading.close();
            });
        },
    }
};
</script>
<template>
    <!-- Page Header -->
    <div class="page-header">
        <div class="row">
            <div class="col-sm-12">
                <h3 class="page-title">إدارة المستفيدين</h3>
            </div>
            <div class="col-12 row mt-3">
                <!-- Filters -->
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>الاسم</label>
                    <input v-model="dataSearch.name" type="text" class="form-control" @input="searchFunc()" placeholder="اسم الشخص">
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>رقم الهوية</label>
                    <input v-model="dataSearch.ssn" type="text" class="form-control" @input="searchFunc()" placeholder="رقم الهوية">
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>المشروع</label>
                    <select v-model="dataSearch.projectId" class="form-control" @change="searchFunc()">
                        <option value="0">-- إختر المشروع --</option>
                        <option v-for="project in getProjectsListData" :key="project.id" :value="project.id">{{ project.name }}</option>
                    </select>
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>فترة الاستثناء</label>
                    <select v-model="dataSearch.exceptionPeriod" class="form-control" @change="searchFunc()">
                        <option value="0">-- إختر فترة الاستثناء --</option>
                        <option v-for="option in getExceptionPeriodOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                    </select>
                </div>
                <!-- Action Buttons -->
                <div class="col-12 mt-2 d-flex align-items-center" style="gap: 5px;">
                    <a href="#add_modal" data-toggle="modal" v-on:click="clearData()"
                        class="btn btn-primary">{{ $t('general_create_button') }}</a>
                    <a href="#excel_modal" data-toggle="modal" class="btn btn-success">رفع من Excel</a>
                    <button v-if="hasSelectedItems" @click="DeleteMultiFunc()" class="btn btn-danger">
                        حذف المحدد ({{ selectedItems.length }})
                    </button>
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
                                    <th class="text-center" style="width: 50px;">
                                        <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll()" 
                                            :indeterminate="selectedItems.length > 0 && !isAllSelected">
                                    </th>
                                    <th class="text-center">ID</th>
                                    <th class="text-center">الاسم</th>
                                    <th class="text-center">رقم الهوية</th>
                                    <th class="text-center">الجوال</th>
                                    <th class="text-center">المنطقة</th>
                                    <th class="text-center">العنوان</th>
                                    <th class="text-center">الملاحظات</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in getPeoplePagination.data" :key="item.id">
                                    <td class="text-center">
                                        <input type="checkbox" :checked="isItemSelected(item.id)" 
                                            @change="toggleSelectItem(item.id)">
                                    </td>
                                    <td class="text-center">{{ (currentPage - 1) * pagination.pageSize + index + 1 }}
                                    </td>
                                    <td class="text-center">{{ item.name || '-' }}</td>
                                    <td class="text-center">{{ item.ssn || '-' }}</td>
                                    <td class="text-center">{{ item.mobile || '-' }}</td>
                                    <td class="text-center">{{ item.destination || '-' }}</td>
                                    <td class="text-center">{{ item.address || '-' }}</td>
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
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>الاسم</label>
                                    <input v-model="data.name" type="text" class="form-control" placeholder="اسم الشخص">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>رقم الهوية</label>
                                    <input v-model="data.ssn" type="text" class="form-control" placeholder="رقم الهوية">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>الجوال</label>
                                    <input v-model="data.mobile" type="text" class="form-control" placeholder="رقم الجوال">
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
                            <div class="col-12 col-sm-12">
                                <div class="form-group">
                                    <label>العنوان</label>
                                    <input v-model="data.address" type="text" class="form-control" placeholder="العنوان">
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
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>الاسم</label>
                                    <input v-model="data.name" type="text" class="form-control" placeholder="اسم الشخص">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>رقم الهوية</label>
                                    <input v-model="data.ssn" type="text" class="form-control" placeholder="رقم الهوية">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>الجوال</label>
                                    <input v-model="data.mobile" type="text" class="form-control" placeholder="رقم الجوال">
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
                            <div class="col-12 col-sm-12">
                                <div class="form-group">
                                    <label>العنوان</label>
                                    <input v-model="data.address" type="text" class="form-control" placeholder="العنوان">
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
                    <h5 class="modal-title">رفع المستفيدين من Excel</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div>
                        <div class="form-group">
                            <label>المشروع</label>
                            <select v-model="excelProjectId" class="form-control">
                                <option value="0">-- إختر المشروع --</option>
                                <option v-for="project in getLast10Projects" :key="project.id" :value="project.id">{{ project.project || project.name || '-' }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>فترة الاستثناء</label>
                            <select v-model="excelExceptionPeriod" class="form-control">
                                <option value="0">-- إختر فترة الاستثناء --</option>
                                <option v-for="option in getExceptionPeriodOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>اختر ملف Excel (.xlsx أو .xls)</label>
                            <input id="excelFileInput" type="file" accept=".xlsx,.xls" @change="handleExcelUpload"
                                class="form-control">
                            <small class="form-text text-muted">
                                يجب أن يحتوي الملف على الأعمدة التالية بالترتيب:<br>
                                1. الاسم <br>
                                2. رقم الهوية <br>
                                3. الجوال <br>
                                4. المنطقة <br>
                                5. العنوان
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
