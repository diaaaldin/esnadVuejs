<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { ElLoading } from 'element-plus';
import { ParentEnum, UserTypeEnum } from '@/config/config.js'

export default {
    data() {
        return {
            dataSearch: {
                teamId: 0,
                walletId: "",
                type: 0,
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
        }
    },
    mounted() {
        // Load dropdown data on mount
        this.loadTeams();
        this.loadWallets();
        // Replace feather icons after mount
        this.$nextTick(() => {
            if (this.$replaceFeatherIcons) {
                this.$replaceFeatherIcons();
            }
        });
        
        // Set default teamId for non-admin users
        if (!this.isAdmin && this.userTeamId > 0) {
            this.dataSearch.teamId = this.userTeamId;
            this.loadWallets(this.userTeamId);
        }
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
        ...mapGetters("FinancialSummary", ["getFinancialSummaryData", "getFinancialSummaryPagination"]),
        ...mapGetters("Users", ["getTeamsData", "getUserInfo"]),
        ...mapGetters("Wallets", ["getWalletsData"]),

        isAdmin() {
            return this.getUserInfo?.userType === UserTypeEnum.Admin;
        },

        userTeamId() {
            return this.getUserInfo?.teamId || 0;
        },

        totalPages() {
            return this.getFinancialSummaryPagination?.totalPages || 0;
        },

        currentPage() {
            return this.getFinancialSummaryPagination?.currentPage || 1;
        },

        totalItems() {
            return this.getFinancialSummaryPagination?.totalItems || 0;
        },

        pageSize() {
            return this.getFinancialSummaryPagination?.pageSize || 5;
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

        getFilteredWalletsForSearch() {
            if (this.dataSearch.teamId === 0) {
                return this.getWalletsData || [];
            }
            return this.getWalletsData.filter(wallet => wallet.teamId === this.dataSearch.teamId);
        },

        getWalletsForCards() {
            if (this.dataSearch.teamId === 0) {
                return [];
            }
            return this.getWalletsData.filter(wallet => wallet.teamId === this.dataSearch.teamId);
        },
    },
    methods: {
        ...mapActions("FinancialSummary", ["GetFinancialSummary"]),
        ...mapActions("Users", ["GetTeams"]),
        ...mapActions("Wallets", ["GetAllWallets"]),

        loadTeams() {
            this.GetTeams({ name: "" }).catch(error => {
                console.error("Error loading teams:", error);
            });
        },

        loadWallets(teamId = 0) {
            this.GetAllWallets({ teamId: teamId, name: "", fundWays: 0 }).catch(error => {
                console.error("Error loading wallets:", error);
            });
        },

        searchFunc() {
            this.pagination.page = 1; // Reset to first page on search
            this.getDataFunc();
        },

        onTeamChangeInSearch() {
            this.dataSearch.walletId = ""; // Reset wallet when team changes
            if (this.dataSearch.teamId > 0) {
                this.loadWallets(this.dataSearch.teamId);
            }
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

            return this.GetFinancialSummary(searchParams).then(response => {
                console.log("response : ", response );
                console.log("this.getFinancialSummaryPagination : ", this.getFinancialSummaryPagination );
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


        changePage(page) {
            this.pagination.page = page;
            this.getDataFunc();
        },

        changePageSize(size) {
            this.pagination.pageSize = size;
            this.pagination.page = 1;
            this.getDataFunc();
        },

        formatCurrency(value) {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: "ILS",
				// Allows up to 1 decimal digit
				maximumFractionDigits: 0
			}).format(value);
		}
    },
    watch: {
        // Watch for wallet cards changes and replace icons
        getWalletsForCards: {
            handler() {
                this.$nextTick(() => {
                    if (this.$replaceFeatherIcons) {
                        setTimeout(() => {
                            this.$replaceFeatherIcons();
                        }, 100);
                    }
                });
            },
            deep: true
        }
    },
    updated() {
        // Replace icons when component updates (e.g., when cards are rendered)
        this.$nextTick(() => {
            if (this.$replaceFeatherIcons) {
                setTimeout(() => {
                    this.$replaceFeatherIcons();
                }, 100);
            }
        });
    }
};
</script>
<template>


    <!-- Page Header -->
    <div class="page-header">
        <div class="row">
            <div class="col-sm-12">
                <h3 class="page-title">الملخص المالي</h3>
            </div>

                <!-- Wallet Cards -->
    <div class="row mb-3" v-if="dataSearch.teamId > 0 && getWalletsForCards.length > 0">
        <div class="col-xl-3 col-md-4 col-sm-6 col-12 mb-2" v-for="wallet in getWalletsForCards" :key="wallet.id">
            <div class="card wallet-card-small">
                <div class="card-body p-2">
                    <div class="dash-widget-header">
                        <span class="dash-widget-icon text-primary border-primary">
                            <img src="/images/icons-fund.png" alt="Projects" width="40" height="40">

                        </span>
                        <div class="dash-count">
                            <h5 class="mb-0">{{formatCurrency(wallet.balance || 0) }}</h5>
                        </div>
                    </div>
                    <div class="dash-widget-info mt-2">
                        <h6 class="text-muted mb-1 small">{{ wallet.name }}</h6>
                        <div class="progress progress-xs">
                            <div class="progress-bar bg-primary w-50"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Wallet Cards -->
            <div class="col-12 row mt-3">
                <!-- Filters -->
                <div class="col-12 col-sm-6 col-md-3 mb-2" v-if="isAdmin">
                    <label>الفريق</label>
                    <select v-model="dataSearch.teamId" class="form-control" @change="onTeamChangeInSearch()">
                        <option value="0">-- إختر الفريق --</option>
                        <option v-for="team in getTeamsData" :key="team.id" :value="team.id">{{ team.name }}</option>
                    </select>
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>المحفظة</label>
                    <select v-model="dataSearch.walletId" class="form-control" @change="searchFunc()">
                        <option value="">-- إختر المحفظة --</option>
                        <option v-for="wallet in getFilteredWalletsForSearch" :key="wallet.id" :value="wallet.id.toString()">{{
                            wallet.name }}</option>
                    </select>
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>النوع</label>
                    <select v-model="dataSearch.type" class="form-control" @change="searchFunc()">
                        <option value="0">-- إختر النوع --</option>
                        <option value="1">وارد</option>
                        <option value="2">صادر</option>
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
                                    <th class="text-center">المحفظة</th>
                                    <th class="text-center">النوع</th>
                                    <th class="text-center">المبلغ</th>
                                    <th class="text-center">التاريخ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in getFinancialSummaryPagination.data" :key="item.id || index">
                                    <td class="text-center">{{ (currentPage - 1) * pagination.pageSize + index + 1 }}
                                    </td>
                                    <td class="text-center">{{ item.walletName || '-' }}</td>
                                    <td class="text-center">{{ item.typeName || '-' }}</td>
                                    <td class="text-center">{{formatCurrency( item.amount || 0) }}</td>
                                    <td class="text-center">{{ item.date ? item.date.split('T')[0] : '-' }}</td>
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


</template>
<style scoped>
.text-right a {
    margin-left: 5px;
}

.modal-body button {
    margin: 5px;
}

.wallet-card-small {
    font-size: 0.875rem;
}

.wallet-card-small .dash-widget-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.wallet-card-small .dash-widget-icon {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    border: 2px solid;
    flex-shrink: 0;
}

.wallet-card-small .dash-widget-icon i,
.wallet-card-small .dash-widget-icon svg {
    width: 1.25rem;
    height: 1.25rem;
}

.wallet-card-small .dash-count h5 {
    font-size: 1rem;
    font-weight: 600;
}

.wallet-card-small .dash-widget-info h6 {
    font-size: 0.75rem;
}

.wallet-card-small .progress-xs {
    height: 0.25rem;
}
</style>
