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
                amount: 0,
                amountNumber: 0,
                code: "",
                destinationCFK: 0,
                walletId: 0,
                peopleCount: 0,
                photographedByCFK: 0,
                date: new Date().toISOString().split('T')[0],
                note: "",
                runningCost:{
                    id : 0,
                    outcomeId: 0,
                    amount: 0,
                    walletId: 0,
                    note: "",
                },
            },

            modalWalletsList: [],

            dataSearch: {
                teamId: 0,
                walletId: 0,
                fundWay: 0,
                currency: 0,
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

            // Multi-select for bulk delete
            selectedItems: [],

            // Store codes separately
            fundWaysList: [],
            currenciesList: [],
            fundersList: [],
            projectsList: [],
            destinationsList: [],
            photographersList: [],
        }
    },
    mounted() {
        // Load dropdown data on mount
        this.loadTeams();
        this.loadWallets();
        this.loadFundWays();
        this.loadCurrencies();
        this.loadFunders();
        this.loadProjects();
        this.loadDestinations();
        this.loadPhotographers();
        
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
        ...mapGetters("Outcomes", ["getOutcomesData", "getOutcomesPagination"]),
        ...mapGetters("Users", ["getTeamsData", "getUserInfo"]),
        ...mapGetters("Wallets", ["getWalletsData"]),

        isAdmin() {
            return this.getUserInfo?.userType === UserTypeEnum.Admin;
        },

        userTeamId() {
            return this.getUserInfo?.teamId || 0;
        },

        getFundWaysData() {
            return this.fundWaysList || [];
        },

        getCurrenciesData() {
            return this.currenciesList || [];
        },

        getFundersData() {
            return this.fundersList || [];
        },

        getProjectsData() {
            return this.projectsList || [];
        },

        getDestinationsData() {
            return this.destinationsList || [];
        },

        getPhotographersData() {
            return this.photographersList || [];
        },

        totalPages() {
            return this.getOutcomesPagination?.totalPages || 0;
        },

        currentPage() {
            return this.getOutcomesPagination?.currentPage || 1;
        },

        totalItems() {
            return this.getOutcomesPagination?.totalItems || 0;
        },

        pageSize() {
            return this.getOutcomesPagination?.pageSize || 5;
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

        getFilteredWalletsForModal() {
            if (this.data.teamId === 0) {
                return [];
            }
            // Use modalWalletsList if available, otherwise filter from getWalletsData
            if (this.modalWalletsList.length > 0) {
                return this.modalWalletsList;
            }
            return this.getWalletsData.filter(wallet => wallet.teamId === this.data.teamId);
        },

        getFilteredWalletsForSearch() {
            if (this.dataSearch.teamId === 0) {
                return [];
            }
            return this.getWalletsData.filter(wallet => wallet.teamId === this.dataSearch.teamId);
        },

        hasRunningCost() {
            // Check if the current outcome has running cost
            if (this.data.id === 0) return false;
            const foundItem = this.getOutcomesPagination.data.find(element => element.id === this.data.id);
            if (!foundItem) return false;
            return foundItem.runningCostAmount > 0 || (foundItem.runningCostWallet && foundItem.runningCostWallet.trim() !== '');
        },

        isAllSelected() {
            if (this.getOutcomesPagination.data.length === 0) return false;
            return this.getOutcomesPagination.data.every(item => this.selectedItems.includes(item.id));
        },

        hasSelectedItems() {
            return this.selectedItems.length > 0;
        },
    },
    methods: {
        ...mapActions("Outcomes", ["GetAllOutcomes", "CreateOutcome", "UpdateOutcome", "DeleteOutcome", "DeleteMultiOutcome", "CreateOutcomesFromExcel"]),
        ...mapActions("Users", ["GetTeams"]),
        ...mapActions("Wallets", ["GetAllWallets"]),
        ...mapActions("Code", ["GetCodesByParent"]),

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

        loadFundWays() {
            this.GetCodesByParent({ parent1: ParentEnum.FundWays, parent2: 0 }).then(response => {
                this.fundWaysList = response || [];
            }).catch(error => {
                console.error("Error loading fund ways:", error);
            });
        },

        loadCurrencies() {
            this.GetCodesByParent({ parent1: ParentEnum.Currencies, parent2: 0 }).then(response => {
                this.currenciesList = response || [];
            }).catch(error => {
                console.error("Error loading currencies:", error);
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

        loadPhotographers() {
            this.GetCodesByParent({ parent1: ParentEnum.Photographers, parent2: 0 }).then(response => {
                this.photographersList = response || [];
            }).catch(error => {
                console.error("Error loading photographers:", error);
            });
        },

        searchFunc() {
            this.pagination.page = 1; // Reset to first page on search
            this.getDataFunc();
        },

        onTeamChangeInSearch() {
            this.dataSearch.walletId = 0; // Reset wallet when team changes
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

            return this.GetAllOutcomes(searchParams).then(response => {
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
            // Set teamId based on user role
            if (!this.isAdmin && this.userTeamId > 0) {
                this.data.teamId = this.userTeamId;
            } else {
                this.data.teamId = 0;
            }
            this.data.funderCFK = 0;
            this.data.projectCFK = 0;
            this.data.amount = 0;
            this.data.amountNumber = 0;
            this.data.code = "";
            this.data.destinationCFK = 0;
            this.data.walletId = 0;
            this.data.peopleCount = 0;
            this.data.photographedByCFK = 0;
            this.data.date = new Date().toISOString().split('T')[0];
            this.data.note = "";
            this.data.runningCost = {
                id: 0,
                outcomeId: 0,
                amount: 0,
                walletId: 0,
                note: "",
            };
            this.modalWalletsList = [];
            // Load wallets if teamId is set
            if (this.data.teamId > 0) {
                this.loadWalletsForModal(this.data.teamId);
            }
        },

        UpdateFunc() {
            if (this.checkUpdateValidation()) {
                const loading = ElLoading.service({
                    lock: true,
                    background: 'rgba(0, 0, 0, 0.7)',
                    text: "",
                });

                // Prepare data for sending to backend
                const dataToSend = { ...this.data };
                
                // Check if runningCost has all default values, set to null if so
                if (dataToSend.runningCost && 
                    dataToSend.runningCost.id === 0 && 
                    dataToSend.runningCost.outcomeId === 0 && 
                    dataToSend.runningCost.amount === 0 && 
                    dataToSend.runningCost.walletId === 0 && 
                    dataToSend.runningCost.note === "") {
                    dataToSend.runningCost = null;
                }

                this.UpdateOutcome(dataToSend).then(Response => {
                     
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
            if (this.data.amount == 0 || this.data.amount == "") {
                this.$moshaToast('المبلغ ' + ' ' + this.$t('general_required'), {
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
            if (this.data.walletId == 0) {
                this.$moshaToast('المحفظة ' + ' ' + this.$t('general_required'), {
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

                // Prepare data for sending to backend
                const dataToSend = { ...this.data };
                
                // Check if runningCost has all default values, set to null if so
                if (dataToSend.runningCost && 
                    dataToSend.runningCost.id === 0 && 
                    dataToSend.runningCost.outcomeId === 0 && 
                    dataToSend.runningCost.amount === 0 && 
                    dataToSend.runningCost.walletId === 0 && 
                    dataToSend.runningCost.note === "") {
                    dataToSend.runningCost = null;
                }

                this.CreateOutcome(dataToSend).then(Response => {
                     
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
            const foundItem = this.getOutcomesPagination.data.find(element => element.id === id);
            if (foundItem) {
                this.data.id = foundItem.id;
                // Get teamId from wallet
                const wallet = this.getWalletsData.find(w => w.id === foundItem.walletId);
                this.data.teamId = wallet?.teamId || 0;
                this.data.funderCFK = foundItem.funderCFK || 0;
                this.data.projectCFK = foundItem.projectCFK || 0;
                this.data.amount = foundItem.amount || 0;
                this.data.amountNumber = foundItem.amountNumber || 0;
                this.data.code = foundItem.code || "";
                this.data.destinationCFK = foundItem.destinationCFK || 0;
                this.data.walletId = foundItem.walletId || 0;
                this.data.peopleCount = foundItem.peopleCount || 0;
                this.data.photographedByCFK = foundItem.photographedByCFK || 0;
                this.data.date = foundItem.date ? foundItem.date.split('T')[0] : new Date().toISOString().split('T')[0];
                this.data.note = foundItem.note || "";
                // Handle running cost - only populate if it exists
                if (foundItem.runningCostAmount > 0 || (foundItem.runningCostWallet && foundItem.runningCostWallet.trim() !== '')) {
                    // Outcome has running cost, don't populate runningCost fields
                    this.data.runningCost = {
                        id: 0,
                        outcomeId: 0,
                        amount: 0,
                        walletId: 0,
                        note: "",
                    };
                } else {
                    // Outcome doesn't have running cost, initialize empty
                    this.data.runningCost = {
                        id: 0,
                        outcomeId: 0,
                        amount: 0,
                        walletId: 0,
                        note: "",
                    };
                }
                // Load wallets for the selected team
                if (this.data.teamId > 0) {
                    this.loadWalletsForModal(this.data.teamId);
                }
            }
        },

        onTeamChangeInModal() {
            this.data.walletId = 0; // Reset wallet when team changes
            if (this.data.teamId > 0) {
                this.loadWalletsForModal(this.data.teamId);
            } else {
                this.modalWalletsList = [];
            }
        },

        loadWalletsForModal(teamId) {
            const loading = ElLoading.service({
                lock: false,
                background: 'rgba(0, 0, 0, 0.1)',
                text: "",
            });
            this.GetAllWallets({ teamId: teamId, name: "", fundWays: 0 }).then(response => {
                this.modalWalletsList = response || [];
                loading.close();
            }).catch(error => {
                console.error("Error loading wallets:", error);
                this.modalWalletsList = [];
                loading.close();
            });
        },

        DeleteFunc() {
            if (this.checkDeleteValidation()) {
                const loading = ElLoading.service({
                    lock: true,
                    background: 'rgba(0, 0, 0, 0.7)',
                    text: "",
                });

                this.DeleteOutcome(this.data.id).then(Response => {
                     
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

            this.CreateOutcomesFromExcel(this.excelFile).then(Response => {
                 
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
                console.log("error : ", error)
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

        formatCurrency(value) {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: "ILS",
				// Allows up to 1 decimal digit
				maximumFractionDigits: 0
			}).format(value);
		},

        // Multi-select methods
        toggleSelectAll() {
            if (this.isAllSelected) {
                this.selectedItems = [];
            } else {
                this.selectedItems = this.getOutcomesPagination.data.map(item => item.id);
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

            this.DeleteMultiOutcome(this.selectedItems).then(Response => {
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
                <h3 class="page-title">إدارة الصادرات</h3>
            </div>
            <div class="col-12 row mt-3">
                <!-- Filters Row 1 -->
                <div class="col-12 col-sm-6 col-md-3 mb-2" v-if="isAdmin">
                    <label>الفريق</label>
                    <select v-model="dataSearch.teamId" class="form-control" @change="onTeamChangeInSearch()">
                        <option value="0">-- إختر الفريق --</option>
                        <option v-for="team in getTeamsData" :key="team.id" :value="team.id">{{ team.name }}</option>
                    </select>
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>المحفظة</label>
                    <select v-model="dataSearch.walletId" class="form-control" @change="searchFunc()"
                        :disabled="dataSearch.teamId === 0">
                        <option value="0">-- إختر المحفظة --</option>
                        <option v-for="wallet in getFilteredWalletsForSearch" :key="wallet.id" :value="wallet.id">{{
                            wallet.name }}</option>
                    </select>
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>نوع التمويل</label>
                    <select v-model="dataSearch.fundWay" class="form-control" @change="searchFunc()">
                        <option value="0">-- إختر نوع التمويل --</option>
                        <option v-for="fundWay in getFundWaysData" :key="fundWay.id" :value="fundWay.id">{{ fundWay.name
                            }}</option>
                    </select>
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>الممول</label>
                    <select v-model="dataSearch.funder" class="form-control" @change="searchFunc()">
                        <option value="0">-- إختر الممول --</option>
                        <option v-for="funder in getFundersData" :key="funder.id" :value="funder.id">{{ funder.name }}
                        </option>
                    </select>
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>المشروع</label>
                    <select v-model="dataSearch.project" class="form-control" @change="searchFunc()">
                        <option value="0">-- إختر المشروع --</option>
                        <option v-for="project in getProjectsData" :key="project.id" :value="project.id">{{ project.name
                            }}</option>
                    </select>
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-2">
                    <label>المنطقة</label>
                    <select v-model="dataSearch.destination" class="form-control" @change="searchFunc()">
                        <option value="0">-- إختر المنطقة --</option>
                        <option v-for="destination in getDestinationsData" :key="destination.id" :value="destination.id">{{ destination.name
                            }}</option>
                    </select>
                </div>
                <!-- Filters Row 2 -->
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
                        class="btn btn-primary float-left mr-3">{{ $t('general_create_button') }}</a>
                    <a href="#excel_modal" data-toggle="modal" class="btn btn-success float-left mr-3">رفع من Excel</a>
                    <button v-if="hasSelectedItems" @click="DeleteMultiFunc()" class="btn btn-danger float-left">
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
                                    <th class="text-center">رقم المشروع</th>
                                    <th class="text-center">الممول</th>
                                    <th class="text-center">المشروع</th>
                                    <th class="text-center">المبلغ</th>
                                    <th class="text-center">الوجهة</th>
                                    <th class="text-center">المحفظة</th>
                                    <th class="text-center">وحدة القياس</th>
                                    <th class="text-center">الكمية</th>
                                    <th class="text-center">عدد المستفيدين</th>
                                    <th class="text-center">فريق التوثيق</th>
                                    <th class="text-center">التاريخ</th>
                                    <th class="text-center">الملاحظات</th>
                                    <th class="text-center">قيمة المصاريف التشغيلية</th>
                                    <th class="text-center">محفظة المصاريف التشغيلية</th>
                                    <th class="text-center">ملاحظات المصاريف التشغيلية</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in getOutcomesPagination.data" :key="item.id">
                                    <td class="text-center">
                                        <input type="checkbox" :checked="isItemSelected(item.id)" 
                                            @change="toggleSelectItem(item.id)">
                                    </td>
                                    <td class="text-center">{{ (currentPage - 1) * pagination.pageSize + index + 1 }}</td>
                                    <td class="text-center">{{ item.code || '-' }}</td>
                                    <td class="text-center">{{ item.funder }}</td>
                                    <td class="text-center">{{ item.project }}</td>
                                    <td class="text-center">{{ formatCurrency(item.amount) }}</td>
                                    <td class="text-center">{{ item.destination }}</td>
                                    <td class="text-center">{{ item.wallet }}</td>
                                    <td class="text-center">{{ item.unitMegerment || '-' }}</td>
                                    <td class="text-center">{{ item.amountNumber || 0 }}</td>
                                    <td class="text-center">{{ item.peopleCount || 0 }}</td>
                                    <td class="text-center">{{ item.photographedBy || '-' }}</td>
                                    <td class="text-center">{{ item.date ? item.date.split('T')[0] : '' }}</td>
                                    <td class="text-center">{{ item.note }}</td>
                                    <td class="text-center">{{ formatCurrency(item.runningCostAmount) }}</td>
                                    <td class="text-center">{{ item.runningCostWallet }}</td>
                                    <td class="text-center">{{ item.runningCostNote }}</td>
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
                                    <label>الممول</label>
                                    <select v-model="data.funderCFK" class="form-control">
                                        <option value="0">-- إختر الممول --</option>
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
                                        <option v-for="project in getProjectsData" :key="project.id" :value="project.id">{{
                                            project.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>الكود</label>
                                    <input v-model="data.code" type="text" class="form-control" placeholder="الكود">
                                </div>
                            </div>
                            <!-- <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>المبلغ</label>
                                    <input v-model="data.amount" type="number" step="0.01" class="form-control">
                                </div>
                            </div> -->
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>المنطقة</label>
                                    <select v-model="data.destinationCFK" class="form-control">
                                        <option value="0">-- إختر المنطقة --</option>
                                        <option v-for="destination in getDestinationsData" :key="destination.id"
                                            :value="destination.id">{{ destination.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>الكمية</label>
                                    <input v-model="data.amountNumber" type="number" class="form-control">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>عدد المستفيدين</label>
                                    <input v-model="data.peopleCount" type="number" class="form-control">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>جهة التوثيق</label>
                                    <select v-model="data.photographedByCFK" class="form-control">
                                        <option value="0">-- إختر جهة التوثيق --</option>
                                        <option v-for="photographer in getPhotographersData" :key="photographer.id"
                                            :value="photographer.id">{{ photographer.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
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

                            <!-- Running Cost Fields - Only show if outcome doesn't have running cost -->
                            <template v-if="!hasRunningCost">
                                <div class="col-12">
                                    <h5 class="form-title"><span>المصاريف التشغيلية</span></h5>
                                </div>

                                <div class="col-12 col-sm-6">
                                    <div class="form-group">
                                        <label>المبلغ</label>
                                        <input v-model="data.runningCost.amount" type="number" step="0.01" class="form-control">
                                    </div>
                                </div>
                                <div class="col-12 col-sm-6">
                                    <div class="form-group">
                                        <label>المحفظة</label>
                                        <select v-model="data.runningCost.walletId" class="form-control" :disabled="data.teamId === 0">
                                            <option value="0">-- إختر المحفظة --</option>
                                            <option v-for="wallet in getFilteredWalletsForModal" :key="wallet.id"
                                                :value="wallet.id">{{ wallet.name }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label>ملاحظات</label>
                                        <textarea v-model="data.runningCost.note" type="text" class="form-control" maxlength="255"></textarea>
                                    </div>
                                </div>
                            </template>
                         
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
                                    <select v-model="data.teamId" class="form-control" @change="onTeamChangeInModal()">
                                        <option value="0">-- إختر الفريق --</option>
                                        <option v-for="team in getTeamsData" :key="team.id" :value="team.id">{{
                                            team.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>المحفظة</label>
                                    <select v-model="data.walletId" class="form-control" :disabled="data.teamId === 0">
                                        <option value="0">-- إختر المحفظة --</option>
                                        <option v-for="wallet in getFilteredWalletsForModal" :key="wallet.id"
                                            :value="wallet.id">{{ wallet.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>الممول</label>
                                    <select v-model="data.funderCFK" class="form-control">
                                        <option value="0">-- إختر الممول --</option>
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
                                        <option v-for="project in getProjectsData" :key="project.id" :value="project.id">{{
                                            project.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>الكود</label>
                                    <input v-model="data.code" type="text" class="form-control" placeholder="الكود">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>المبلغ</label>
                                    <input v-model="data.amount" type="number" step="0.01" class="form-control">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>المنطقة</label>
                                    <select v-model="data.destinationCFK" class="form-control">
                                        <option value="0">-- إختر المنطقة --</option>
                                        <option v-for="destination in getDestinationsData" :key="destination.id"
                                            :value="destination.id">{{ destination.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>الكمية</label>
                                    <input v-model="data.amountNumber" type="number" class="form-control">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>عدد المستفيدين</label>
                                    <input v-model="data.peopleCount" type="number" class="form-control">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>فريق التوثيق</label>
                                    <select v-model="data.photographedByCFK" class="form-control">
                                        <option value="0">-- إختر فريق التوثيق --</option>
                                        <option v-for="photographer in getPhotographersData" :key="photographer.id"
                                            :value="photographer.id">{{ photographer.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
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
                            
							<div class="col-12">
								<h5 class="form-title"><span>المصاريف التشغيلية</span></h5>
							</div>

                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>المبلغ</label>
                                    <input v-model="data.runningCost.amount" type="number" step="0.01" class="form-control">
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label>المحفظة</label>
                                    <select v-model="data.runningCost.walletId" class="form-control" :disabled="data.teamId === 0">
                                        <option value="0">-- إختر المحفظة --</option>
                                        <option v-for="wallet in getFilteredWalletsForModal" :key="wallet.id"
                                            :value="wallet.id">{{ wallet.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12">
								<div class="form-group">
									<label>ملاحظات</label>
									<textarea v-model="data.runningCost.note" type="text" class="form-control" maxlength="255"></textarea>
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
                    <h5 class="modal-title">رفع المصروفات من Excel</h5>
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
                                1. التاريخ <br>
                                2. رقم المشروع <br>
                                3. إسم المشروع <br>
                                4. الممول <br>
                                5. المبلغ <br>
                                6. المنطقة <br>
                                7. العدد <br>
                                8. المحفظة <br>
                                9. عدد المستفيدين <br>
                                10. فريق التوثيق <br>
                                11. الملاحظات <br>
                                12. مبلغ المصاريف التشغيلية (اختياري) <br>
                                13. محفظة المصاريف التشغيلية (اختياري) <br>
                                14. ملاحظات المصاريف التشغيلية (اختياري)
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
