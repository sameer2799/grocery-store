import AdminDashboard from './Dashboards/AdminDash.js'
import CustDashboard from './Dashboards/CustDash.js'
import SellDashboard from './Dashboards/SellDash.js'

export default {
    props : ['data'],
    template: `<div>
        <admin-dashboard v-if="userRole=='admin'"></admin-dashboard>
        <cust-dashboard v-if="userRole=='buyer'"></cust-dashboard>
        <sell-dashboard v-if="userRole=='seller'"></sell-dashboard>
    </div>`,
    data() {
        return {
            userRole: localStorage.getItem('role'),
        }
    },
    components: {
        AdminDashboard,
        CustDashboard,
        SellDashboard
    }
}