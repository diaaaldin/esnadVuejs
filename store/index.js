import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";
import Users from "./modules/Users/index";
import Code from "./modules/Code/index";
import Vehicles from "./modules/Vehicles/index";
import Orders from "./modules/Orders/index";
import Roles from "./modules/Roles/index";
import NotificationsAndMessages from "./modules/NotificationsAndMessages/index";
import Visits from "./modules/Visits/index";
import Statistics from "./modules/Statistics/index";
import Payment from "./modules/Payment/index";
import Interfaces from "./modules/Interfaces/index";
import Wallets from "./modules/Wallets/index";
import Incomes from "./modules/Incomes/index";
import Outcomes from "./modules/Outcomes/index";
import FinancialSummary from "./modules/FinancialSummary/index";
import Projects from "./modules/Projects/index";
import People from "./modules/People/index";
import PeopleProjects from "./modules/PeopleProjects/index";
import Reports from "./modules/Reports/index";
import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate';
import callHubPlugin from './CullHubPlugin.js';

const store = createStore({
    state:{
        isLogged : false,
    },
    // getter for read
    getters : getters,
    // mutations for update and operation  like setter 
    mutations : mutations,
    // for custom function 
    actions : actions,
    
     modules :{
      Users,
      Code,
      Vehicles,
      Orders,
      Roles,
      NotificationsAndMessages,
      Visits,
      Statistics,
      Payment,
      Interfaces,
      Wallets,
      Incomes,
      Outcomes,
      FinancialSummary,
      Projects,
      People,
      PeopleProjects,
      Reports
     },

     plugins: [
        createPersistedState({
          paths: ['Users','Vehicles','Orders','Code','Roles'
            ,'NotificationsAndMessages','Visits','Statistics','Payment','Interfaces','Wallets','Incomes','Outcomes','FinancialSummary','Projects','People','PeopleProjects'], 
        }),
        callHubPlugin
      ],
      
});



export default store;