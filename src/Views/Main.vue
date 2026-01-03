<script>
//import { RouterView } from 'vue-router';
import { mapState, mapGetters, mapActions } from "vuex";
import Sidebar from '@/components/Main/sidebar.vue';
import Header from '@/components/Main/header.vue';

export default {
    data() {
        return {
            dataNotification: {
                page: 1,
                pageSize: 1000
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

        initFunc() {
            // if(this.isTokenValid()){
            //     this.GetUserNotifications(this.dataNotification);
            // }
        },

        chickValidationToken() {
            if (!this.isTokenValid()) {
                this.$router.push({ name: 'login' });
            }
        },

        // isTokenValid() {
        //     try {
        //         const token = localStorage.getItem('token');
        //         if (!token) return false;

        //         const parts = token.split('.');
        //         if (parts.length !== 3) return false;

        //         const payload = JSON.parse(atob(parts[1]));
        //         if (!payload || !payload.exp) return false;

        //         return payload.exp > Math.floor(Date.now() / 1000);
        //     } catch (error) {
        //         console.error('Token validation error:', error);
        //         return false;
        //     }
        // },
        isTokenValid() {
            try {
                let token = localStorage.getItem('token');
                if (!token) return false;

                // Remove Bearer prefix
                if (token.startsWith('Bearer ')) {
                    token = token.slice(7);
                }

                const parts = token.split('.');
                if (parts.length !== 3) return false;

                // Base64URL → Base64
                let base64 = parts[1]
                    .replace(/-/g, '+')
                    .replace(/_/g, '/');

                // Add padding
                while (base64.length % 4) {
                    base64 += '=';
                }

                const payload = JSON.parse(
                    decodeURIComponent(
                        atob(base64)
                            .split('')
                            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                            .join('')
                    )
                );

                if (!payload.exp) return false;

                return payload.exp > Math.floor(Date.now() / 1000);
            } catch (e) {
                console.error('Token validation error:', e);
                return false;
            }
        },

        initSidebarMenu() {
            // Remove any existing handlers to prevent duplicates
            $('#sidebar-menu').off('click', 'a.subdrop, a:has(+ ul)');

            // Initially close all submenus
            $('#sidebar-menu ul ul').slideUp(0); // Ensure all submenus are collapsed
            $('#sidebar-menu a').removeClass('subdrop'); // Remove the 'subdrop' class from all links

            // Use event delegation - attach to #sidebar-menu so it works with dynamically added elements
            $('#sidebar-menu').on('click', 'a', function (e) {
                const $link = $(this);
                const $parent = $link.parent();

                // Only handle dropdown links (those that have a next ul sibling)
                if ($link.next('ul').length === 0) {
                    return; // Not a dropdown, let it proceed normally
                }

                // Prevent default for dropdown links
                if ($parent.hasClass('submenu') || $link.hasClass('subdrop') || $link.next('ul').length > 0) {
                    e.preventDefault();
                }

                if (!$link.hasClass('subdrop')) {
                    // Close all other submenus at the same level
                    $('ul', $link.parents('ul:first')).slideUp(350);
                    $('a', $link.parents('ul:first')).removeClass('subdrop');

                    // Open the clicked submenu
                    $link.next('ul').slideDown(350);
                    $link.addClass('subdrop');
                } else if ($link.hasClass('subdrop')) {
                    // Close the clicked submenu
                    $link.removeClass('subdrop');
                    $link.next('ul').slideUp(350);
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
        <Sidebar></Sidebar>
        <div class="page-wrapper">
            <div class="content container-fluid">
                <router-view />
            </div>
        </div>
    </div>
</template>

<style scoped></style>