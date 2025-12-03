<script>
//import { RouterView } from 'vue-router';
import { mapState, mapGetters, mapActions } from "vuex";
import Sidebar from '@/components/Main/sidebar.vue';
import Header from '@/components/Main/header.vue';

export default {
    data() {
        return {
            dataNotification : {
                page : 1,
                pageSize : 1000
            }
        }
    },
    components: {
        Header,
        Sidebar,
    },
    mounted() {
        ////////

        this.initSidebarMenu();
        this.initPageContentHeight();
        this.initMobileMenuOverlay();
        this.initSidebarSlimScroll();
        
        // Initialize sidebar toggle after Feather icons are replaced
        this.$nextTick(() => {
            // Wait a bit more to ensure Feather icons are replaced
            setTimeout(() => {
                this.initSmallSidebar();
            }, 300);
        });

    },
    async created() {
        await this.chickValidationToken();
        this.initFunc();
        
    },

    computed: {

    },

    methods: {
        // ...mapActions("NotificationsAndMessages", ["GetUserNotifications"]),

        initFunc(){
            // if(this.isTokenValid()){
            //     this.GetUserNotifications(this.dataNotification);
            // }
        },

        chickValidationToken() {
            if (!this.isTokenValid()) {
                console.log("token not valid");
                this.$router.push({ name: 'login' });
            }
        },

        isTokenValid() {
            const token = localStorage.getItem('token');
            if (!token) return false;

            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Math.floor(Date.now() / 1000);
        },

        initSidebarMenu() {
            // Initially close all submenus
            $('#sidebar-menu ul ul').slideUp(0); // Ensure all submenus are collapsed
            $('#sidebar-menu a').removeClass('subdrop'); // Remove the 'subdrop' class from all links

            // Event listener for when a menu item is clicked
            $('#sidebar-menu a').on('click', function (e) {
                if ($(this).parent().hasClass('submenu')) {
                    e.preventDefault();
                }
                if (!$(this).hasClass('subdrop')) {
                    // Close all other submenus
                    $('ul', $(this).parents('ul:first')).slideUp(350);
                    $('a', $(this).parents('ul:first')).removeClass('subdrop');

                    // Open the clicked submenu
                    $(this).next('ul').slideDown(350);
                    $(this).addClass('subdrop');
                } else if ($(this).hasClass('subdrop')) {
                    // Close the clicked submenu
                    $(this).removeClass('subdrop');
                    $(this).next('ul').slideUp(350);
                }
            });

            // Optional: if you have a specific active link, trigger the initial open
            $('#sidebar-menu ul li.submenu a.active')
                .parents('li:last')
                .children('a:first')
                .addClass('active')
                .trigger('click');
        },
        initPageContentHeight() {
            const setHeight = () => {
                const height = $(window).height();
                $(this.$refs.pageWrapper).css('min-height', height);
            };
            setHeight();
            $(window).resize(setHeight);
        },
        initMobileMenuOverlay() {
            const body = document.body;
            const overlay = document.createElement("div");
            overlay.classList.add("sidebar-overlay");
            body.appendChild(overlay);

            document
                .querySelector("#mobile_btn")
                .addEventListener("click", () => {
                    document.querySelector(".main-wrapper").classList.toggle("slide-nav");
                    overlay.classList.toggle("opened");
                    document.documentElement.classList.add("menu-opened");
                });

            overlay.addEventListener("click", () => {
                document.querySelector(".main-wrapper").classList.remove("slide-nav");
                overlay.classList.remove("opened");
                document.documentElement.classList.remove("menu-opened");
            });
        },
        initSidebarSlimScroll() {
            const $slimScrolls = this.$el.querySelectorAll('.slimscroll');
            if ($slimScrolls.length > 0) {
                $slimScrolls.forEach(element => {
                    $(element).slimScroll({
                        height: 'auto',
                        width: '100%',
                        position: 'left',
                        size: '7px',
                        color: '#ccc',
                        allowPageScroll: false,
                        wheelStep: 10,
                        touchScrollStep: 100,
                    });
                    const wHeight = window.innerHeight - 60;
                    element.style.height = `${wHeight}px`;
                });
                window.addEventListener('resize', () => {
                    const rHeight = window.innerHeight - 60;
                    $slimScrolls.forEach(element => {
                        element.style.height = `${rHeight}px`;
                    });
                });
            }
        },
        initSmallSidebar() {
            // Remove any existing handlers to prevent duplicates
            $(document).off("click", "#toggle_btn");
            
            // Set up click handler with event delegation
            $(document).on("click", "#toggle_btn", (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if ($("body").hasClass("mini-sidebar")) {
                    $("body").removeClass("mini-sidebar");
                    $(".subdrop + ul").slideDown();
                } else {
                    $("body").addClass("mini-sidebar");
                    $(".subdrop + ul").slideUp();
                }
                setTimeout(() => {
                    if (this.mA) this.mA.redraw();
                    if (this.mL) this.mL.redraw();
                }, 300);
            });

            $(document).on("mouseover", (e) => {
                e.stopPropagation();
                if ($("body").hasClass("mini-sidebar")) {
                    const isInSidebar = e.target.closest(".sidebar");
                    if (isInSidebar) {
                        $("body").addClass("expand-menu");
                    } else {
                        $("body").removeClass("expand-menu");
                    }
                }
            });
        },



    }
};
</script>

<template>
    <div class="main-wrapper">
        <Header></Header>
        <Sidebar ></Sidebar>
        <div class="page-wrapper">
            <div class="content container-fluid">
                <router-view />
            </div>
        </div>
    </div>
</template>

<style scoped></style>