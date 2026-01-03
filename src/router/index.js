import { createRouter, createWebHistory } from 'vue-router'

const main = () => import('../Views/Main.vue')
const Login = () => import('../Views/User/Login.vue')
const Home = () => import('../Views/Main/Home.vue')
const profile = () => import('../Views/Main/Profile.vue')


const admins = () => import('../Views/Main/Users/Admins.vue')
const teams = () => import('../Views/Main/Users/Teams.vue')
const team_leaders = () => import('../Views/Main/Users/TeamLeaders.vue')
const team_mempers = () => import('../Views/Main/Users/TeamMempers.vue')
const AccissDenied = () => import('../Views/AccessDenied.vue')
const AboutUs = () => import('../Views/AboutUs.vue')

const funders = () => import('../Views/Main/Code/Funders.vue')
const currencies = () => import('../Views/Main/Code/Currencies.vue')
const destinations = () => import('../Views/Main/Code/Destinations.vue')
const fundWays = () => import('../Views/Main/Code/FundWays.vue')
const items = () => import('../Views/Main/Code/Items.vue')
const itemsMountTypes = () => import('../Views/Main/Code/ItemsMountTypes.vue')
const photographers = () => import('../Views/Main/Code/Photographers.vue')
const projects = () => import('../Views/Main/Code/Projects.vue')

const incoms = () => import('../Views/Main/Financial/Incoms.vue')
const outcoms = () => import('../Views/Main/Financial/Outcoms.vue')
const wallets = () => import('../Views/Main/Financial/Wallets.vue')
const financial_summary = () => import('../Views/Main/Financial/FinancialSummary.vue')

const projects_management = () => import('../Views/Main/ProjectsManagement.vue')
const people_management = () => import('../Views/Main/PeopleManagement.vue')
const projects_people_management = () => import('../Views/Main/ProjectsPeopleManagement.vue')

const reports = () => import('../Views/Main/Reports.vue')
// const general_report = () => import('../Views/Main/Reports/GeneralReport.vue')
// const funders_report = () => import('../Views/Main/Reports/FundersReport.vue')
// const items_report = () => import('../Views/Main/Reports/ItemsReport.vue')
// const destinations_report = () => import('../Views/Main/Reports/DestinationsReport.vue')
// const destinations_benefits_report = () => import('../Views/Main/Reports/DestinationsBenefitsReport.vue')

const routes = [
    {
        path: '/login',
        name: "login",
        component: Login
    },
    {
        path: '/AccissDenied',
        name: "AccissDenied",
        component: AccissDenied
    },
    {
        path: '/about-us',
        name: "AboutUs",
        component: AboutUs
    },
    // {
    //     path: '/general',
    //     name: "general_report",
    //     component: general_report
    // },
    // {
    //     path: '/funders',
    //     name: "funders_report",
    //     component: funders_report
    // },
    // {
    //     path: '/items',
    //     name: "items_report",
    //     component: items_report
    // },
    // {
    //     path: '/destinations',
    //     name: "destinations_report",
    //     component: destinations_report
    // },
    // {
    //     path: '/destinations-benefits',
    //     name: "destinations_benefits_report",
    //     component: destinations_benefits_report
    // },
    {
        path: '/',
        name: "main",
        component: main,
        children: [
            {
                path: '',
                name: "Home",
                component: Home
            },
            {
                path: '/profile',
                name: "profile",
                component: profile
            },
           
            {
                path: '/admins',
                name: "admins",
                component: admins
            },
            {
                path: '/teams',
                name: "teams",
                component: teams
            },
            {
                path: '/team_leaders',
                name: "team_leaders",
                component: team_leaders
            },
            {
                path: '/team_mempers',
                name: "team_mempers",
                component: team_mempers
            },
            {
                path: '/funders',
                name: "funders",
                component: funders
            },
            {
                path: '/currencies',
                name: "currencies",
                component: currencies
            },
            {
                path: '/destinations',
                name: "destinations",
                component: destinations
            },
            {
                path: '/fundWays',
                name: "fundWays",
                component: fundWays
            },
            {
                path: '/items',
                name: "items",
                component: items
            },
            {
                path: '/itemsMountTypes',
                name: "itemsMountTypes",
                component: itemsMountTypes
            },
            {
                path: '/photographers',
                name: "photographers",
                component: photographers
            },
            {
                path: '/projects',
                name: "projects",
                component: projects
            },
            {
                path: '/incoms',
                name: "incoms",
                component: incoms
            },
            {
                path: '/outcoms',
                name: "outcoms",
                component: outcoms
            },
            {
                path: '/wallets',
                name: "wallets",
                component: wallets
            },
            {
                path: '/financial_summary',
                name: "financial_summary",
                component: financial_summary
            },
            {
                path: '/projects_management',
                name: "projects_management",
                component: projects_management
            },
            {
                path: '/people_management',
                name: "people_management",
                component: people_management
            },
            {
                path: '/projects_people_management',
                name: "projects_people_management",
                component: projects_people_management
            },
            {
                path: '/reports',
                name: "reports",
                component: reports
            },
           
          
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    // to scroll to the top if any route happen
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { left: 0, top: 0 }; // Always scroll to the top
        }
    }
});

export default router 
