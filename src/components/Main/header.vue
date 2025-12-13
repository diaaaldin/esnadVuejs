<script>
import { RouterView } from 'vue-router';
import { mapState, mapGetters, mapActions } from "vuex";

export default {
    data() {
        return {
            selectedLanguage: localStorage.getItem('selectedLanguage') || 'ar', // Default to arabic
        }
    },
    mounted() {

    },
    components: {
        RouterView,
    },

    emits: {

    },

    created() {
        // Call the function from the store directly when the component is created
    },

    computed: {
        ...mapGetters("Users", ["getUserLoginName"]),
        ...mapGetters("NotificationsAndMessages", ["getUserNotificationsData"]),

        GetUserName() {
            const name = this.getUserLoginName;// just for loud this function again when name change
            let userName = localStorage.getItem("userName");
            if (userName == null) {
                return "";
            } else {
                return userName;
            }
        },
    },
    methods: {
        ...mapActions("NotificationsAndMessages", ["ReadAdminNotification"]),

        logout() {
            localStorage.clear();
            this.$router.push({ name: "login" });
        },
        changeLanguage() {
            //this.$i18n.locale = this.selectedLanguage;
            this.$i18n.locale = "en";
            localStorage.setItem('selectedLanguage', this.selectedLanguage);
            document.documentElement.setAttribute('dir', this.selectedLanguage === 'ar' ? 'rtl' : 'ltr');
            // Reload the page to apply the change globally
            window.location.reload();
        },

        formatDateTime(dateString) {
            const date = new Date(dateString);
            if (isNaN(date)) return '';

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            let hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, '0');

            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // Convert 0 to 12
            const formattedHours = String(hours).padStart(2, '0');

            return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
        }
    }
};
</script>
<template>
    <!-- Header -->
    <div class="header">

        <!-- Logo -->
        <div class="header-left">
            <router-link to="/" class="logo">
                <img src="/images/esnad_logo_horizental.png" alt="Logo">
            </router-link>

            <router-link to="/" class="logo logo-small">
                <img src="/images/esnad_logo.png" alt="Logo" width="30" height="30">
            </router-link>
        </div>
        <!-- /Logo -->

        <a href="javascript:void(0)" id="toggle_btn">
            <i data-feather="align-left"></i>
        </a>

        <!-- <div class="top-nav-search">
            <form>
                <input type="text" class="form-control" placeholder="ابحث...">
                <button class="btn" type="submit"><i data-feather="search"></i></button>
            </form>
        </div> -->

        <!-- Mobile Menu Toggle -->
        <a class="mobile_btn" id="mobile_btn" @click="toggleMobileMenu">
            <!-- <i class="fa fa-bars"></i> -->
            <i data-feather="menu"></i>
        </a>
        <!-- /Mobile Menu Toggle -->

        <!-- Header Right Menu -->
        <ul class="nav user-menu">

            <!-- Notifications -->
            <!-- <li class="nav-item dropdown noti-dropdown">
                <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">
                    <i data-feather="bell"></i>
                 
                    <span v-if="(getUserNotificationsData.notReadNum ?? 0) > 0" class="badge badge-pill">
                        {{ getUserNotificationsData.notReadNum ?? 0 }}
                    </span>
                </a>
                <div class="dropdown-menu notifications">
                    <div class="topnav-dropdown-header">
                        <span class="notification-title">{{ $t('header_notifications') }}</span>
                        <a href="javascript:void(0)" class="clear-noti"> {{ $t('header_clear_all') }} </a>
                    </div>
                    <div class="noti-content">
                        <ul class="notification-list">
                            <li v-for="(item, index) in (getUserNotificationsData.notifications?.data || [])"
                                class="notification-message">
                                <a v-on:click="ReadAdminNotification(item.id)">
                                    <div class="media">
                                        <span class="avatar avatar-sm">
                                            <img class="avatar-img rounded-circle" alt="User Image"
                                                src="@/assets/img/doctors/doctor-thumb-01.jpg">
                                        </span>
                                        <div class="media-body">
                                            <p class="noti-details">
                                                <span v-if="item.isRead == false" class="noti-title"> {{ item.message
                                                    }}</span>
                                                <span v-else> {{ item.message }}</span>

                                            </p>
                                            <p class="noti-time">
                                                <span class="notification-time">{{ formatDateTime(item.createdAt) }}</span>
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="topnav-dropdown-footer">
                        <a href="#">{{ $t('header_view_all_notifications') }}</a>
                    </div>
                </div>
            </li> -->
            <!-- /Notifications -->

            <!-- User Menu -->
            <li class="nav-item dropdown has-arrow">
                <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">
                    <span class="user-img"><img class="rounded-circle" src="/images/esnad_logo.png"
                            width="31" alt="Ryan Taylor"></span>
                </a>
                <div class="dropdown-menu">
                    <div class="user-header">
                        <div class="avatar avatar-sm">
                            <img src="/images/esnad_logo.png" alt="User Image"
                                class="avatar-img rounded-circle">
                        </div>
                        <div class="user-text">
                            <h6>{{ GetUserName }}</h6>
                            <p class="text-muted mb-0">{{ $t('header_userType') }}</p>
                        </div>
                    </div>
                    <!-- <router-link class="dropdown-item" to="/">{{ $t('header_to_store') }}</router-link> -->
                    <a v-on:click="logout()" class="dropdown-item">{{ $t('header_logout') }}</a>
                </div>
            </li>
            <!-- /User Menu -->
        </ul>
        <!-- /Header Right Menu -->
        <!-- <div class="local-changer">
            <select v-model="selectedLanguage" @change="changeLanguage">
                <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">
                    {{ locale }}</option>
            </select>
        </div> -->
    </div>
    <!-- /Header -->
</template>
<style scoped>
.local-changer select {
    margin-top: 15px;
    border-color: #15a5007d;
    padding: 2px;
    border-radius: 20px;
}
</style>