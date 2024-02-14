export default {
    props : ['data'],
    template: `
    <div class="modal fade" id="sellermodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Approval</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Seller has been approved! Pleae ask the seller to login again to see the changes.
                Also reload the page to see the changes.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
            </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="catmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Approval</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Category has been approved! Pleae reload the page to see the changes.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
            </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="rejcatmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Rejection</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <span class="text-center fw-bold text-danger">Are You Sure you want to delete this category?</span>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" data-bs-dismiss="modal">No</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="rej_cat()">Yes</button>
            </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="delprodmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Delete</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div v-if="this.prodInfo" class="modal-body">
                <span class="text-center fw-bold text-success">{{ this.prodInfo }}</span>
            </div>
            <div v-else class="modal-body">
                <span class="text-center fw-bold text-danger">Are You Sure you want to delete this product?</span>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" data-bs-dismiss="modal">No</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="this.del_prod()">Yes</button>
            </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div v-if="this.error | this.caterror" class="d-flex justify-content-center">{{ this.error }}{{ this.caterror }}</div>
        <div v-else>
            <div class="container m-3">
                <div class="table-wrapper d-flex flex-wrap">
                    <div class="table-container table-responsive pe-5 flex-fill">
                        <table class="table caption-top table-striped table-hover align-middle">
                        <caption class="fs-3 fw-bold">Pending New Sellers Approvals</caption>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Active</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <div v-if="this.someError" class="fw-bold fst-italic">{{ this.someError }}</div>
                                <div v-else-if="sellers.length === 0" class="fw-bold fst-italic">All Approved!</div>
                                <tr v-else v-for="(seller,index) in sellers">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>{{ seller.username }}</td>
                                    <td>{{ seller.email }}</td>
                                    <td>{{ seller.active }}</td>
                                    <td>{{ seller.role }}</td>
                                    <td> <button class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#sellermodal" @click="apv_seller(seller.id)">Approve</button> </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="table-container table-responsive flex-fill">
                        <table class="table caption-top table-striped table-hover align-middle">
                            <caption class="fs-3 fw-bold">Pending New Categories Approvals</caption>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Category Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Approved</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <div v-if="this.catSomeError" class="fw-bold fst-italic">{{ this.catSomeError }}</div>
                                <div v-else-if="act_categories.length === 0" class="fw-bold fst-italic">All Approved!</div>
                                <tr v-else v-for="(category,index) in act_categories">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>{{ category.category_name }}</td>
                                    <td>{{ category.description }}</td>
                                    <td>{{ category.is_approved }}</td>
                                    <td>
                                        <div class="btn-group" role="group" aria-label="Basic outlined example">
                                            <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#catmodal" @click="apv_cat(category.category_id)">Approve</button>
                                            <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#rejcatmodal" @click="this.todelete=category.category_id">Reject</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
            <br>
            <div class="container mt-3">
                <div class="table-wrapper table-responsive">
                    <h2 class="text-center">Users List</h2>
                    <table class="table table-striped table-hover align-middle">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Role</th>
                            <th scope="col">Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        <div v-if="this.someError" class="fw-bold fst-italic">{{ this.someError }}</div>
                        <tr v-else v-for="(user,index) in users">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ user.username }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.role }}</td>
                            <td>{{ user.active }}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
            <br>
            <div class="container mt-3">
                <div class="table-wrapper table-responsive">
                    <h2 class="text-center">Categories List</h2>
                    <table class="table table-striped table-hover align-middle">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        <div v-if="this.catSomeError" class="fw-bold fst-italic">{{ this.catSomeError }}</div>
                        <tr v-else v-for="(category,index) in categories">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ category.category_name }}</td>
                            <td>{{ category.description }}</td>
                            <td>{{ category.is_approved }}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
            <br>
            <div class="container mt-3 mb-3">
                <div class="table-wrapper table-responsive">
                    <h2 class="text-center">Products List</h2>
                    <table class="table table-striped table-hover align-middle">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Price per unit</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Expiry Date</th>
                            <th scope="col">Seller</th>
                            <th scope="col">Category</th>
                            <th scope="col">Description</th>
                            <th scope="col">Availability</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <div v-if="this.prodSomeError" class="fw-bold fst-italic">{{ this.prodSomeError }}</div>
                        <tr v-else v-for="(p,index) in products">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ p.product_name }}</td>
                            <td>{{ p.price_per_unit }} per {{ p.units }}</td>
                            <td>{{ p.stock }}</td>
                            <td>{{ p.expiry_date }}</td>
                            <td>{{ p.seller_id }}</td>
                            <td>{{ p.product_category_id }}</td>
                            <td>{{ p.description }}</td>
                            <td>{{ p.is_available }}</td>
                            <td>
                                <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#delprodmodal" @click="this.todeleteprod=p.product_id">Delete Product</button>
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            token: localStorage.getItem('auth-token'),
            users: {},
            sellers: {},
            categories: {},
            act_categories: {},
            products: {},
            someError: null,
            error: null,
            catSomeError: null,
            caterror: null,
            todelete: null,
            prodSomeError: null,
            todeleteprod: null,
            prodInfo: null
        }
    },    
    methods: {
        async apv_seller(id) {
            const res = await fetch('/api/approve/seller', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                },
                body: JSON.stringify({ id: parseInt(id) })
            });
            const data = await res.json().catch((err) => { this.error = err });
            if (res.ok) {
                
            } else {
                this.someError = data.message;
            }
        },
        async apv_cat(id) {
            const res = await fetch('/api/approve/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                },
                body: JSON.stringify({ category_id: parseInt(id) })
            });
            const data = await res.json().catch((err) => { this.caterror = err });
            if (res.ok) {
                
            } else {
                this.catSomeError = data.message;
            }
        },
        async rej_cat() {
            if (this.todelete) {
                const res = await fetch('/api/category', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token
                    },
                    body: JSON.stringify({ id: parseInt(this.todelete) })
                });
                const data = await res.json().catch((err) => { this.caterror = err });
                if (res.ok) {
                    
                } else {
                    this.catSomeError = data.message;
                }
            }
            else {
            }
        },
        async allProds() {
            const res = await fetch('/api/product', {
                method : 'GET',
                headers: {
                        'Authentication-Token': this.token,
                    }
                });
            const data = await res.json();
            if (res.ok) {
                this.products = data;
            }
            else {
                this.prodSomeError = data.message;
            }
        },
        async del_prod() {
            if (this.todeleteprod) {
                const res = await fetch('/api/product', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token
                    },
                    body: JSON.stringify({ product_id: parseInt(this.todeleteprod) })
                });
                const data = await res.json().catch((err) => { this.prodSomeError = err });
                if (res.ok) {
                    this.prodInfo = data.info;
                } else {
                    this.prodSomeError = data.message;
                }
            }
            else {
                this.prodSomeError = "Please select a product to delete";
            }
        }
    },
    async mounted() {
            const res = await fetch('/api/user-list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                },
            });
                
            const data = await res.json().catch((err) => {this.error = err});
            if (res.ok) {
                this.users = data
                this.users = this.users.filter(user => user.role !== 'Admin');
                this.sellers = this.users.filter(user => user.role === 'Seller' && user.active === false);
                
            }
            else {
                this.someError = data.message
            }

            const res1 = await fetch('/api/category', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                },
            });
                
            const data1 = await res1.json().catch((err) => {this.caterror = err});
            if (res1.ok) {
                this.categories = data1
                this.act_categories = data1.filter(category => category.is_approved === false)
            }
            else {
                this.catSomeError = data1.info
            }
            this.allProds();  
    },
}