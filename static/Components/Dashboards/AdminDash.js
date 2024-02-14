import UserList from "./UserList.js"

export default {
    props : ['data'],
    template: `
    <div>
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
        <user-list></user-list>
    </div>`,
    data() {
        return {
            userRole: localStorage.getItem('role'),
        }
    },
    methods:{
        goHome(){
            this.$router.push({ name: 'Home' })
        }
    },
    components: {
        UserList
    }
}