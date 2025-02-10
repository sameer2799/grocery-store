export default {
    props : ['data'],
    template: `
    <div class="row">
        <div class="col-12">
            <div class="jumbotron jumbotron-fluid">
                <div class="container">
                    <h1 class="display-4">Welcome to the Farmer's Market!</h1>
                    <p class="lead">We provide the best quality products at the best prices!</p>
                </div>
            </div>
        </div>
    </div>
    <div class="m-5">

        <div class='d-flex justify-content-center'>
            <form class="p-5 bg-light">
                <h3 class="text-center mb-5">Login</h3>
                <div class="mb-3">
                    <label for="user-email" class="form-label">Email address</label>
                    <input type="email" class="form-control" autocomplete="new-password" id="user-email" placeholder="abc@example.com" aria-describedby="emailHelp" required v-model="cred.email">
                    
                </div>
                <div class="mb-3">
                    <label for="user-password" class="form-label">Password</label>
                    <input type="password" class="form-control" autocomplete="new-password" id="user-password" v-model="cred.password" required>
                </div>
                <div class="mb-3 text-warning">
                    {{ this.info }}
                </div>
                <div class="mb-3 text-danger">
                    {{ this.error }}
                </div>
                <div class="mb-3 d-flex justify-content-center">
                    <button type="button" class="btn btn-outline-primary" @click="login">Login</button>
                </div>
                <div class="mb-3 d-flex justify-content-center">
                    <div>Don't have an account?</div>
                </div>
                <div class="mb-3 d-flex justify-content-center">
                    <router-link to="Register"><button type="button" class="btn btn-outline-success">Register Here!</button></router-link>
                </div>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            cred: {
                email : null,
                password: null,
            },
            info: null,
            error : null
        }
    },
    methods: {
        async login(){
            if (this.cred.email && this.cred.password){
                const res = await fetch('/user-login',{
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify(this.cred),
                })
                const data = await res.json().catch(err => this.error = err);
    
                if (res.ok) {    
                    if (data.token) {
                        localStorage.setItem('auth-token', data.token)
                        localStorage.setItem('role', data.role)
                        localStorage.setItem('id', data.id)
                    }
                    this.$router.push({name: 'Home'})
                }
                else {
                    this.info = data.info;
                    this.error = data.message;
                }
            }
            else{
                this.error = 'Please enter valid credentials'
            }
            
        }
    },
}