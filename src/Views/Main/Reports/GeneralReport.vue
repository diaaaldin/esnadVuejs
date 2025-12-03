<script>
import { mapGetters, mapActions } from "vuex";
import { ElLoading } from 'element-plus';

export default {
    data() {
        return {
            reportTitle: "",
            duration: 0
        }
    },
    mounted() {
        // Get params from route query
        if (this.$route.query.title) {
            this.reportTitle = this.$route.query.title;
            this.duration = parseInt(this.$route.query.duration) || 0;
            this.loadReport();
        }
    },
    computed: {
        ...mapGetters("Reports", ["getGeneralReportData"]),
        
        reportData() {
            return this.getGeneralReportData || [];
        },
        
        totalAmount() {
            return this.reportData.reduce((sum, item) => {
                return sum + (parseFloat(item.amount) || 0);
            }, 0);
        }
    },
    methods: {
        ...mapActions("Reports", ["GetGeneralReport"]),
        
        loadReport() {
            const loading = ElLoading.service({
                lock: true,
                background: 'rgba(0, 0, 0, 0.7)',
                text: "جاري تحميل التقرير...",
            });

            this.GetGeneralReport({ duration: this.duration }).then(() => {
                loading.close();
                // Auto print after data is loaded
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
        
        formatCurrency(value, currency) {
            let currencyCode = "ILS";
            if (currency) {
                const currencyUpper = currency.toString().toUpperCase();
                if (currencyUpper.includes("USD") || currencyUpper.includes("دولار") || currencyUpper === "USD") {
                    currencyCode = "USD";
                } else if (currencyUpper.includes("ILS") || currencyUpper.includes("شيكل") || currencyUpper.includes("NIS") || currencyUpper === "ILS") {
                    currencyCode = "ILS";
                }
            }
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode,
                maximumFractionDigits: 0
            }).format(value);
        },
        
        formatDate(date) {
            if (!date) return '';
            const d = new Date(date);
            return d.toLocaleDateString('ar-EG');
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
    <div id="generalReport" class="report-wrapper">
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
                    <h3 class="title">{{ reportTitle || 'التقرير العام' }}</h3>
                </div>
                <div class="pageHeader">
                    <p>تاريخ التقرير: <span><b>({{ getFormattedDate() }})</b></span></p>
                    <p v-if="duration > 0">المدة: <span><b>({{ duration }} يوم)</b></span></p>
                </div>
                <table class="info-table">
                    <tr>
                        <td><b>الممول</b></td>
                        <td><b>نوع التمويل</b></td>
                        <td><b>المبلغ</b></td>
                        <td><b>العملة</b></td>
                        <td><b>التاريخ</b></td>
                    </tr>
                    <tr v-if="reportData.length === 0">
                        <td colspan="5" class="text-center">لا توجد بيانات</td>
                    </tr>
                    <tr v-for="(item, index) in reportData" :key="index">
                        <td>{{ item.funder || '-' }}</td>
                        <td>{{ item.fundType || '-' }}</td>
                        <td>{{ formatCurrency(parseFloat(item.amount) || 0, item.currency) }}</td>
                        <td>{{ item.currency || '-' }}</td>
                        <td>{{ formatDate(item.date) }}</td>
                    </tr>
                    <tr v-if="reportData.length > 0">
                        <td colspan="2"><b>الإجمالي</b></td>
                        <td colspan="3"><b>{{ formatCurrency(totalAmount, 'ILS') }}</b></td>
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
    @top-center {
        content: "";
    }
    @bottom-center {
        content: counter(page);
    }
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

    #generalReport, #generalReport * {
        visibility: visible;
    }

    #generalReport {
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

    /* Hide URL and other browser elements */
    body::after {
        display: none;
    }
}
</style>
