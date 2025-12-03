<script>
import { mapGetters, mapActions } from "vuex";
import { ElLoading } from 'element-plus';

export default {
    data() {
        return {
            reportTitle: "",
            projectId: 0,
            funderId: 0,
            destinationId: 0
        }
    },
    mounted() {
        if (this.$route.query.title) {
            this.reportTitle = this.$route.query.title;
            this.projectId = parseInt(this.$route.query.projectId) || 0;
            this.funderId = parseInt(this.$route.query.funderId) || 0;
            this.destinationId = parseInt(this.$route.query.destinationId) || 0;
            this.loadReport();
        }
    },
    computed: {
        ...mapGetters("Reports", ["getDestinationsBenefitsReportData"]),
        
        reportData() {
            return this.getDestinationsBenefitsReportData || [];
        },
        
        totalAmount() {
            return this.reportData.reduce((sum, item) => {
                return sum + (item.amount || 0);
            }, 0);
        },
        
        totalRunningCost() {
            return this.reportData.reduce((sum, item) => {
                return sum + (item.runningCostAmount || 0);
            }, 0);
        }
    },
    methods: {
        ...mapActions("Reports", ["GetDestinationsBenefitsReport"]),
        
        loadReport() {
            const loading = ElLoading.service({
                lock: true,
                background: 'rgba(0, 0, 0, 0.7)',
                text: "جاري تحميل التقرير...",
            });

            this.GetDestinationsBenefitsReport({ 
                projectId: this.projectId,
                funderId: this.funderId,
                destinationId: this.destinationId
            }).then(() => {
                loading.close();
                this.$nextTick(() => {
                    setTimeout(() => {
                        window.print();
                        this.$moshaToast('تمت العملية بنجاح', {
                            hideProgressBar: 'false',
                            showIcon: 'true',
                            swipeClose: 'true',
                            type: 'success',
                            timeout: 1500,
                        });
                        setTimeout(() => {
                            this.$router.push({ name: 'reports' });
                        }, 2000);
                    }, 500);
                });
            }).catch(error => {
                loading.close();
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
                    this.$moshaToast(error.response?.data?.message || 'حدث خطأ أثناء تحميل التقرير', {
                        hideProgressBar: 'false',
                        position: 'top-center',
                        showIcon: 'true',
                        swipeClose: 'true',
                        type: 'error',
                        timeout: 3000,
                    });
                }
            });
        },
        
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: "ILS",
                maximumFractionDigits: 0
            }).format(value);
        },
        
        getFormattedDate() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    }
};
</script>
<template>
    <div id="destinationsBenefitsReport" class="report-wrapper">
        <!-- Header -->
        <header class="report-header">
            <div class="header-content">
                <img src="/images/esnad_logo.png" alt="Logo" class="header-logo">
                <div class="header-line"></div>
                <h1 class="header-title">إسناد</h1>
            </div>
        </header>

        <!-- Report Content -->
        <div class="report-container">
            <div class="table-container">
                <div class="tableHeader">
                    <h3 class="title">{{ reportTitle || 'تقرير فوائد الوجهات' }}</h3>
                </div>
                <div class="pageHeader">
                    <p>تاريخ التقرير: <span><b>({{ getFormattedDate() }})</b></span></p>
                </div>
                <table class="info-table">
                    <tr>
                        <td><b>المشروع</b></td>
                        <td><b>الممول</b></td>
                        <td><b>المبلغ</b></td>
                        <td><b>الوجهة</b></td>
                        <td><b>قيمة المصاريف التشغيلية</b></td>
                    </tr>
                    <tr v-if="reportData.length === 0">
                        <td colspan="5" class="text-center">لا توجد بيانات</td>
                    </tr>
                    <tr v-for="(item, index) in reportData" :key="index">
                        <td>{{ item.project || '-' }}</td>
                        <td>{{ item.funder || '-' }}</td>
                        <td>{{ formatCurrency(item.amount || 0) }}</td>
                        <td>{{ item.destination || '-' }}</td>
                        <td>{{ formatCurrency(item.runningCostAmount || 0) }}</td>
                    </tr>
                    <tr v-if="reportData.length > 0">
                        <td colspan="2"><b>الإجمالي</b></td>
                        <td><b>{{ formatCurrency(totalAmount) }}</b></td>
                        <td colspan="2"><b>{{ formatCurrency(totalRunningCost) }}</b></td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Footer -->
        <footer class="report-footer">
            <div class="footer-content">
                <span class="page-number">صفحة <span class="page-counter"></span></span>
            </div>
        </footer>
    </div>
</template>
<style scoped>
* {
    font-family: "Arial", sans-serif !important;
    font-weight: bold;
}

.report-wrapper {
    direction: rtl;
    text-align: center;
    background-color: #ffff;
    min-height: 100vh;
    position: relative;
    padding-top: 100px;
    padding-bottom: 80px;
}

/* Header Styles */
.report-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: #fff;
    padding: 15px 40px;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 100%;
}

.header-logo {
    max-width: 80px;
    width: 80px;
    height: auto;
    margin-bottom: 10px;
}

.header-line {
    width: 100%;
    height: 2px;
    background-color: #000;
    margin: 8px 0;
}

.header-title {
    text-align: center;
    margin: 5px 0 0 0;
    font-size: 22px;
    font-weight: bold;
}

/* Footer Styles */
.report-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: #fff;
    border-top: 2px solid #000;
    padding: 15px 40px;
    z-index: 1000;
}

.footer-content {
    text-align: center;
}

.page-number {
    font-size: 18px;
    font-weight: bold;
}

/* Report Container */
.report-container {
    margin: 0px 20px;
    padding: 20px 40px;
}

.report-container .title {
    padding-bottom: 30px;
    font-size: 25px;
    margin-top: 20px;
}

.report-container p {
    font-size: 21px;
}

.report-container td {
    font-size: 21px;
}

.table-container {
    width: 100%;
    border-collapse: collapse;
}

.info-table {
    width: 100%;
    margin-bottom: 20px;
    border: 1px solid black;
}

.info-table td {
    padding: 8px;
    border: 1px solid black;
    text-align: center;
}

.pageHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 30px;
}

.tableHeader {
    margin-top: 20px;
}

.text-center {
    text-align: center;
}

/* Print Styles */
@page {
    size: A4;
    margin: 0;
}

@media print {
    @page {
        size: A4;
        margin-top: 100px;
        margin-bottom: 80px;
    }

    body {
        margin: 0;
        padding: 0;
    }

    body * {
        visibility: hidden;
    }

    #destinationsBenefitsReport, #destinationsBenefitsReport * {
        visibility: visible;
    }

    #destinationsBenefitsReport {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
    }

    .report-wrapper {
        padding-top: 0;
        padding-bottom: 0;
    }

    .report-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        page-break-inside: avoid;
        page-break-after: avoid;
    }

    .report-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        page-break-inside: avoid;
        page-break-before: avoid;
    }

    .report-container {
        margin: 0;
        padding: 20px 40px;
        page-break-inside: avoid;
    }

    .info-table {
        page-break-inside: auto;
    }

    .info-table tr {
        page-break-inside: avoid;
        page-break-after: auto;
    }

    .page-counter::after {
        content: counter(page);
    }

    body::after {
        display: none;
    }
}
</style>
