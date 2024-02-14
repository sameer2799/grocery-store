import NavBar from './navBar.js'
import Customer from './Dashboards/customer.js'
import UnAdmin from './Dashboards/unadmin.js'


export default {
    props : ['data'],
    template: `
    <div>
        <div v-if="userRole==='buyer'" class="container">
            <div class="m-3 row">
            <div class="col-12">
                <div class="jumbotron jumbotron-fluid">
                    <div class="container">
                        <h1 class="display-4">Welcome to the Farmer's Market!</h1>
                        <p class="lead">We provide the best quality products at the best prices!</p>
                    </div>
                </div>
            </div>
            </div>
            <customer></customer>
        </div>
        <div v-if="userRole==='admin'" class="container">
            <div class="m-3 row">
                <div class="col-12">
                    <div class="jumbotron jumbotron-fluid">
                        <div class="container">
                            <h1 class="display-4">Welcome Admin</h1>
                            <p class="lead">Get your work done easily!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="m-3 row">
                <div class="col-12">
                    <button type="button" class="btn btn-outline-info" @click="goDashboard">Dashboard</button>
                </div>
            </div>
            <div class="container m-3 p-3">
                <h3>This is what Customers See:</h3>
                <un-admin></un-admin>
            </div>
        </div>
        <div v-if="userRole==='seller'" class="container">
            <div class="m-3 row">
                <div class="col-12">
                    <div class="jumbotron jumbotron-fluid">
                        <div class="container">
                            <h1 class="display-4">Welcome to the Farmer's Market!</h1>
                            <p class="lead">Best platform to sell your best quality products!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between m-2">
                <div class="p-2">
                    <button type="button" class="btn btn-outline-info" @click="goDashboard">Dashboard</button>
                </div>
                <div class="p-2">                
                    <button type="button" class="btn btn-outline-success" @click="download">
                        <i class="bi bi-download"></i>&nbsp;&nbsp;All My Products (CSV)
                    </button>
                    <span v-if="isWaiting">Waiting...</span>
                </div>
            </div>
            <div class="container m-3 p-3">
                <h3>All Products</h3>
                <un-admin></un-admin>
            </div>
        </div>
    </div>`,
    data() {
        return {
            userRole: localStorage.getItem('role'),
            token: localStorage.getItem('auth-token'),
            id: localStorage.getItem('id'),
            isWaiting: false
        }
    },
    methods:{
        goDashboard(){
            this.$router.push({ name: 'Dash' })
        },
        async download(){
            this.isWaiting = true
            const res = await fetch('/products/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': this.token
                },body: JSON.stringify({ id: this.id })
            })
            const data = await res.json()
            if(res.ok){
                const taskId = data.task_id
                const intvl = setInterval(async () => {
                    const csv_res = await fetch(`/get-csv/${taskId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': this.token
                        }
                    })
                    if(csv_res.ok){
                        this.isWaiting = false;
                        clearInterval(intvl)
                        window.location.href = `/get-csv/${taskId}`
                    }
                }, 1000)
            }
            else{
                alert(data.message)
            }
        }
    },
    components: {
        NavBar,
        Customer,
        UnAdmin
    },
}