<script>
import { mapActions } from "vuex";
import { ParentEnum } from '@/config/config.js'
import { ElLoading } from 'element-plus';
import ReportsApi from '@/apis/Reports';

export default {
    data() {
        return {
            // Modal data for each report
            generalReportData: {
                title: "",
                duration: 0
            },
            fundersReportData: {
                title: "",
                funderId: 0,
                projectId: 0
            },
            itemsReportData: {
                title: "",
                projectId: 0,
                itemId: 0,
                fromDate: "",
                toDate: ""
            },
            destinationsReportData: {
                title: "",
                destinationId: 0,
                fromDate: "",
                toDate: ""
            },
            destinationsBenefitsReportData: {
                title: "",
                projectId: 0,
                funderId: 0,
                destinationId: 0
            },
            // Dropdown lists
            fundersList: [],
            projectsList: [],
            itemsList: [],
            destinationsList: [],
            // Active modal
            activeModal: null
        }
    },
    mounted() {
        this.loadFunders();
        this.loadProjects();
        this.loadItems();
        this.loadDestinations();
    },
    computed: {
        // Exception period options (1-12 months) reused from PeopleManagement
        getExceptionPeriodOptions() {
            const options = [];
            for (let i = 1; i <= 12; i++) {
                options.push({
                    value: i,
                    label: this.getExceptionPeriodLabel(i)
                });
            }
            return options;
        }
    },
    methods: {
        ...mapActions("Code", ["GetCodesByParent"]),

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

        loadItems() {
            this.GetCodesByParent({ parent1: ParentEnum.Items, parent2: 0 }).then(response => {
                this.itemsList = response || [];
            }).catch(error => {
                console.error("Error loading items:", error);
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

        openModal(modalType) {
            this.activeModal = modalType;
            // Reset form data
            this.clearModalData(modalType);
        },

        clearModalData(modalType) {
            switch (modalType) {
                case 'general':
                    this.generalReportData = { title: "", duration: 0 };
                    break;
                case 'funders':
                    this.fundersReportData = { title: "", funderId: 0, projectId: 0 };
                    break;
                case 'items':
                    this.itemsReportData = { title: "", projectId: 0, itemId: 0, fromDate: "", toDate: "" };
                    break;
                case 'destinations':
                    this.destinationsReportData = { title: "", destinationId: 0, fromDate: "", toDate: "" };
                    break;
                case 'destinationsBenefits':
                    this.destinationsBenefitsReportData = { title: "", projectId: 0, funderId: 0, destinationId: 0 };
                    break;
            }
        },

        closeModal() {
            this.activeModal = null;
        },

        downloadBlobAsFile(response, defaultFileName) {
            try {
                const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                let fileName = defaultFileName;
                const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
                if (contentDisposition) {
                    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
                    if (matches && matches[1]) {
                        fileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
                    }
                }

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName || defaultFileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (e) {
                console.error('Error downloading file', e);
                this.$moshaToast('حدث خطأ أثناء تحميل الملف', {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'error',
                    timeout: 3000,
                });
            }
        },

        generateReport(reportType) {
            let params = {};
            let exportCall;
            let defaultTitle = '';

            switch (reportType) {
                case 'general':
                    if (!this.generalReportData.title) {
                        this.$moshaToast('يرجى إدخال عنوان التقرير', {
                            hideProgressBar: 'false',
                            position: 'top-center',
                            showIcon: 'true',
                            swipeClose: 'true',
                            type: 'warning',
                            timeout: 3000,
                        });
                        return;
                    }
                    params = {
                        title: this.generalReportData.title,
                        duration: this.generalReportData.duration
                    };
                    exportCall = ReportsApi.ExportGeneralReport(params);
                    defaultTitle = this.generalReportData.title;
                    break;

                case 'funders':
                    if (!this.fundersReportData.title) {
                        this.$moshaToast('يرجى إدخال عنوان التقرير', {
                            hideProgressBar: 'false',
                            position: 'top-center',
                            showIcon: 'true',
                            swipeClose: 'true',
                            type: 'warning',
                            timeout: 3000,
                        });
                        return;
                    }
                    params = {
                        title: this.fundersReportData.title,
                        funderId: this.fundersReportData.funderId,
                        projectId: this.fundersReportData.projectId
                    };
                    exportCall = ReportsApi.ExportFundersReport(params);
                    defaultTitle = this.fundersReportData.title;
                    break;

                case 'items':
                    if (!this.itemsReportData.title) {
                        this.$moshaToast('يرجى إدخال عنوان التقرير', {
                            hideProgressBar: 'false',
                            position: 'top-center',
                            showIcon: 'true',
                            swipeClose: 'true',
                            type: 'warning',
                            timeout: 3000,
                        });
                        return;
                    }
                    params = {
                        title: this.itemsReportData.title,
                        projectId: this.itemsReportData.projectId,
                        itemId: this.itemsReportData.itemId,
                        fromDate: this.itemsReportData.fromDate,
                        toDate: this.itemsReportData.toDate
                    };
                    exportCall = ReportsApi.ExportItemsReport(params);
                    defaultTitle = this.itemsReportData.title;
                    break;

                case 'destinations':
                    if (!this.destinationsReportData.title) {
                        this.$moshaToast('يرجى إدخال عنوان التقرير', {
                            hideProgressBar: 'false',
                            position: 'top-center',
                            showIcon: 'true',
                            swipeClose: 'true',
                            type: 'warning',
                            timeout: 3000,
                        });
                        return;
                    }
                    params = {
                        title: this.destinationsReportData.title,
                        destinationId: this.destinationsReportData.destinationId,
                        fromDate: this.destinationsReportData.fromDate,
                        toDate: this.destinationsReportData.toDate
                    };
                    exportCall = ReportsApi.ExportDestinationsReport(params);
                    defaultTitle = this.destinationsReportData.title;
                    break;

                case 'destinationsBenefits':
                    if (!this.destinationsBenefitsReportData.title) {
                        this.$moshaToast('يرجى إدخال عنوان التقرير', {
                            hideProgressBar: 'false',
                            position: 'top-center',
                            showIcon: 'true',
                            swipeClose: 'true',
                            type: 'warning',
                            timeout: 3000,
                        });
                        return;
                    }
                    params = {
                        title: this.destinationsBenefitsReportData.title,
                        projectId: this.destinationsBenefitsReportData.projectId,
                        funderId: this.destinationsBenefitsReportData.funderId,
                        destinationId: this.destinationsBenefitsReportData.destinationId
                    };
                    exportCall = ReportsApi.ExportDestinationsBenefitsReport(params);
                    defaultTitle = this.destinationsBenefitsReportData.title;
                    break;
            }

            if (!exportCall) return;

            const loading = ElLoading.service({
                lock: true,
                background: 'rgba(0, 0, 0, 0.7)',
                text: "جاري إنشاء التقرير وتحميله...",
            });

            exportCall.then((response) => {
                loading.close();
                this.downloadBlobAsFile(response, `${defaultTitle || 'report'}.xlsx`);
                this.$moshaToast('تم إنشاء التقرير وتحميله بنجاح', {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'success',
                    timeout: 3000,
                });
                this.closeModal();
            }).catch((error) => {
                loading.close();
                console.error('Error exporting report', error);
                const message = error.response?.data?.message || 'حدث خطأ أثناء إنشاء التقرير';
                this.$moshaToast(message, {
                    hideProgressBar: 'false',
                    position: 'top-center',
                    showIcon: 'true',
                    swipeClose: 'true',
                    type: 'error',
                    timeout: 3000,
                });
            });
        }
    }
};
</script>
<template>
    <div class="page-header">
        <div class="row">
            <div class="col-sm-12">
                <h3 class="page-title">التقارير</h3>
            </div>
        </div>
    </div>

    <div class="row mt-4">
        <!-- General Report Card -->
        <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card report-card" style="cursor: pointer;" @click="openModal('general')">
                <div class="card-body text-center">
                    <i data-feather="file-text" style="width: 48px; height: 48px; margin-bottom: 15px;"></i>
                    <h5 class="card-title">التقرير العام</h5>
                    <p class="card-text text-muted">عرض التقرير العام للإيرادات</p>
                </div>
            </div>
        </div>

        <!-- Funders Report Card -->
        <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card report-card" style="cursor: pointer;" @click="openModal('funders')">
                <div class="card-body text-center">
                    <i data-feather="users" style="width: 48px; height: 48px; margin-bottom: 15px;"></i>
                    <h5 class="card-title">تقرير الممولين</h5>
                    <p class="card-text text-muted">عرض تقرير الممولين والمشاريع</p>
                </div>
            </div>
        </div>

        <!-- Items Report Card -->
        <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card report-card" style="cursor: pointer;" @click="openModal('items')">
                <div class="card-body text-center">
                    <i data-feather="package" style="width: 48px; height: 48px; margin-bottom: 15px;"></i>
                    <h5 class="card-title">تقرير الأصناف</h5>
                    <p class="card-text text-muted">عرض تقرير الأصناف والكميات</p>
                </div>
            </div>
        </div>

        <!-- Destinations Report Card -->
        <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card report-card" style="cursor: pointer;" @click="openModal('destinations')">
                <div class="card-body text-center">
                    <i data-feather="map-pin" style="width: 48px; height: 48px; margin-bottom: 15px;"></i>
                    <h5 class="card-title">تقرير المناطق</h5>
                    <p class="card-text text-muted">عرض تقرير المناطق والأصناف</p>
                </div>
            </div>
        </div>

        <!-- Destinations Benefits Report Card -->
        <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card report-card" style="cursor: pointer;" @click="openModal('destinationsBenefits')">
                <div class="card-body text-center">
                    <i data-feather="trending-up" style="width: 48px; height: 48px; margin-bottom: 15px;"></i>
                    <h5 class="card-title">تقرير فوائد المناطق</h5>
                    <p class="card-text text-muted">عرض تقرير فوائد المناطق والمشاريع</p>
                </div>
            </div>
        </div>
    </div>

    <!-- General Report Modal -->
    <div class="modal" :class="{ 'show': activeModal === 'general' }" v-if="activeModal === 'general'" style="display: block;">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">تقرير عام</h5>
                    <button type="button" class="close" @click="closeModal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>عنوان التقرير</label>
                        <input v-model="generalReportData.title" type="text" class="form-control" placeholder="أدخل عنوان التقرير">
                    </div>
                    <div class="form-group">
                        <label>مدة التقرير</label>
                        <select v-model.number="generalReportData.duration" class="form-control">
                            <option value="0">-- إختر مدة التقرير --</option>
                            <option v-for="option in getExceptionPeriodOptions" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">إلغاء</button>
                    <button type="button" class="btn btn-primary" @click="generateReport('general')">إنشاء التقرير</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Funders Report Modal -->
    <div class="modal" :class="{ 'show': activeModal === 'funders' }" v-if="activeModal === 'funders'" style="display: block;">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">تقرير الممولين</h5>
                    <button type="button" class="close" @click="closeModal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>عنوان التقرير</label>
                        <input v-model="fundersReportData.title" type="text" class="form-control" placeholder="أدخل عنوان التقرير">
                    </div>
                    <div class="form-group">
                        <label>الممول</label>
                        <select v-model.number="fundersReportData.funderId" class="form-control">
                            <option value="0">-- جميع الممولين --</option>
                            <option v-for="funder in fundersList" :key="funder.id" :value="funder.id">{{ funder.name }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>المشروع</label>
                        <select v-model.number="fundersReportData.projectId" class="form-control">
                            <option value="0">-- جميع المشاريع --</option>
                            <option v-for="project in projectsList" :key="project.id" :value="project.id">{{ project.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">إلغاء</button>
                    <button type="button" class="btn btn-primary" @click="generateReport('funders')">إنشاء التقرير</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Items Report Modal -->
    <div class="modal" :class="{ 'show': activeModal === 'items' }" v-if="activeModal === 'items'" style="display: block;">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">تقرير الأصناف</h5>
                    <button type="button" class="close" @click="closeModal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>عنوان التقرير</label>
                        <input v-model="itemsReportData.title" type="text" class="form-control" placeholder="أدخل عنوان التقرير">
                    </div>
                    <div class="form-group">
                        <label>المشروع</label>
                        <select v-model.number="itemsReportData.projectId" class="form-control">
                            <option value="0">-- جميع المشاريع --</option>
                            <option v-for="project in projectsList" :key="project.id" :value="project.id">{{ project.name }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>الصنف</label>
                        <select v-model.number="itemsReportData.itemId" class="form-control">
                            <option value="0">-- جميع الأصناف --</option>
                            <option v-for="item in itemsList" :key="item.id" :value="item.id">{{ item.name }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>من تاريخ</label>
                        <input v-model="itemsReportData.fromDate" type="date" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>إلى تاريخ</label>
                        <input v-model="itemsReportData.toDate" type="date" class="form-control">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">إلغاء</button>
                    <button type="button" class="btn btn-primary" @click="generateReport('items')">إنشاء التقرير</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Destinations Report Modal -->
    <div class="modal" :class="{ 'show': activeModal === 'destinations' }" v-if="activeModal === 'destinations'" style="display: block;">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">تقرير المناطق</h5>
                    <button type="button" class="close" @click="closeModal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>عنوان التقرير</label>
                        <input v-model="destinationsReportData.title" type="text" class="form-control" placeholder="أدخل عنوان التقرير">
                    </div>
                    <div class="form-group">
                        <label>المنطقة</label>
                        <select v-model.number="destinationsReportData.destinationId" class="form-control">
                            <option value="0">-- جميع المناطق --</option>
                            <option v-for="destination in destinationsList" :key="destination.id" :value="destination.id">{{ destination.name }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>من تاريخ</label>
                        <input v-model="destinationsReportData.fromDate" type="date" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>إلى تاريخ</label>
                        <input v-model="destinationsReportData.toDate" type="date" class="form-control">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">إلغاء</button>
                    <button type="button" class="btn btn-primary" @click="generateReport('destinations')">إنشاء التقرير</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Destinations Benefits Report Modal -->
    <div class="modal" :class="{ 'show': activeModal === 'destinationsBenefits' }" v-if="activeModal === 'destinationsBenefits'" style="display: block;">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">تقرير فوائد المناطق</h5>
                    <button type="button" class="close" @click="closeModal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>عنوان التقرير</label>
                        <input v-model="destinationsBenefitsReportData.title" type="text" class="form-control" placeholder="أدخل عنوان التقرير">
                    </div>
                    <div class="form-group">
                        <label>المشروع</label>
                        <select v-model.number="destinationsBenefitsReportData.projectId" class="form-control">
                            <option value="0">-- جميع المشاريع --</option>
                            <option v-for="project in projectsList" :key="project.id" :value="project.id">{{ project.name }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>الممول</label>
                        <select v-model.number="destinationsBenefitsReportData.funderId" class="form-control">
                            <option value="0">-- جميع الممولين --</option>
                            <option v-for="funder in fundersList" :key="funder.id" :value="funder.id">{{ funder.name }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>المنطقة</label>
                        <select v-model.number="destinationsBenefitsReportData.destinationId" class="form-control">
                            <option value="0">-- جميع المناطق --</option>
                            <option v-for="destination in destinationsList" :key="destination.id" :value="destination.id">{{ destination.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">إلغاء</button>
                    <button type="button" class="btn btn-primary" @click="generateReport('destinationsBenefits')">إنشاء التقرير</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade" :class="{ show: activeModal !== null }" v-if="activeModal !== null" @click="closeModal"></div>
</template>
<style scoped>
.report-card {
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid #e0e0e0;
}

.report-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.report-card i {
    color: #007bff;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1050;
    width: 100%;
    height: 100%;
    overflow: hidden;
    outline: 0;
}

.modal.show {
    display: block;
}

.modal-dialog {
    position: relative;
    width: auto;
    margin: 1.75rem auto;
    max-width: 500px;
    pointer-events: none;
}

.modal-dialog-centered {
    display: flex;
    align-items: center;
    min-height: calc(100% - 3.5rem);
}

.modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.2);
    border-radius: .3rem;
    outline: 0;
}

.modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: calc(.3rem - 1px);
    border-top-right-radius: calc(.3rem - 1px);
}

.modal-body {
    position: relative;
    flex: 1 1 auto;
    padding: 1rem;
}

.modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 1rem;
    border-top: 1px solid #dee2e6;
    border-bottom-right-radius: calc(.3rem - 1px);
    border-bottom-left-radius: calc(.3rem - 1px);
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1040;
    width: 100vw;
    height: 100vh;
    background-color: #000;
}

.modal-backdrop.show {
    opacity: 0.5;
}
</style>

