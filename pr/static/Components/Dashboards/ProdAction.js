export default {
    props: {
        'data': Object,
        'msg': String
        },
    template: `
    <div>
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Message</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div v-if="this.success" class="alert alert-success" role="alert">{{ this.success }}</div>
                <div v-if="this.error" class="alert alert-danger" role="alert">{{ this.error }}</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="this.$router.go(0)" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="exampleModal3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Message</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div v-if="this.success" class="alert alert-success" role="alert">{{ this.success }}</div>
                <div v-else class="text-danger">Are you sure you want to delete?</div>
                <div v-if="this.error" class="alert alert-danger" role="alert">{{ this.error }}</div>
                <div v-else class="text-danger">Are you sure you want to delete?</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="this.$router.go(0)" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" @click="this.deleteProduct()">Yes</button>
            </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="exampleModal2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Edit Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="d-flex justify-content-center">
                        <span class="text-info bg-light mb-2"> Editing a product will unpublish it. You will have to publish it again.</span>
                    </div>
                    <form class="row g-3">
                        <div class="col-md-6">
                            <label for="prodname" class="form-label">Product Name</label>
                            <input type="text" class="form-control" id="prodname" placeholder="Banana" v-model="this.editProd.product_name" required>
                        </div>
                        <div class="col-md-6">
                            <label for="catname" class="form-label">Category</label>
                            <select id="catname" class="form-select" v-model="this.editProd.product_category_id" placeholder="Choose...">
                                <option disabled>Choose...</option>
                                <option v-for="cat in categories" :value="cat.category_id">{{ cat.category_name }}</option>
                            </select>
                        </div>
                        <div class="col-12">
                            <label for="description" class="form-label">Description</label>
                            <input type="text" class="form-control" id="description" placeholder="Fresh from farm" v-model="this.editProd.description">
                        </div>
                        <div class="col-md-4">
                            <label for="inputprice" class="form-label">Price per unit</label>
                            <input type="number" class="form-control" id="inputprice" placeholder="10.0" v-model="this.editProd.price_per_unit">
                        </div>
                        <div class="col-md-4">
                            <label for="units" class="form-label">Units</label>
                            <input type="text" class="form-control" id="units" placeholder="dozen" v-model="this.editProd.units">
                        </div>
                        <div class="col-md-4">
                            <label for="inputZip" class="form-label">Stock</label>
                            <input type="number" class="form-control" id="inputZip" placeholder="50.0" v-model="this.editProd.stock">
                        </div>
                        <div class="col-12">
                            <label for="expiryDate" class="form-label">Expiry Date</label>
                            <input type="date" class="form-control" id="expiryDate" v-model="this.editProd.expiry_date">
                        </div>
                            <div class="alert alert-success" role="alert" v-if="this.success">{{ this.success }}</div>
                            <div class="alert alert-danger" role="alert" v-if="this.error">{{ this.error }}</div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="this.$router.go(0)">Close</button>
                    <button type="button" class="btn btn-primary" @click="this.editProduct()">Confirm Edit</button>
                </div>
            </div>
        </div>
    </div>
        <div>
            <h1 class="m-3">All Your Product Listings</h1>
        </div>
        <div v-if="this.data.length !== 0" class="d-flex flex-wrap mb-3">
                        <div v-for="i in data" class="card p-0 m-3">
                            <div class="card-header">
                                <span class="fw-bold">{{ i.product_name }}</span>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">&#8377;{{ i.price_per_unit }} per {{ i.units }} </h5>
                                <p class="card-text">{{ i.description }}</p>
                                <p class="card-text">Belongs to category = <span class="fw-bold">{{ i.product_category_id }}</span></p>
                                <p class="card-text">Expiry Date = {{ i.expiry_date }}</p>
                                <p class="card-text">Stock = {{ i.stock }}</p>
                                <h4 v-if="!i.is_available" class="card-text text-danger">This product is not Published.</h4>
                            </div>
                            <div class="card-footer text-end">
                                <button @click="publishProduct(i.product_id)" type="button" class="btn btn-outline-primary m-2" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="bi bi-send-check-fill"></i>&nbsp;Publish Product</button>
                                <button @click="this.editProd.product_id=i.product_id" type="button" class="btn btn-outline-warning m-2" data-bs-toggle="modal" data-bs-target="#exampleModal2"><i class="bi bi-pen"></i>&nbsp;Edit Product</button>
                                <button @click="this.todel=i.product_id" type="button" class="btn btn-outline-danger m-2" data-bs-toggle="modal" data-bs-target="#exampleModal3"><i class="bi bi-trash3-fill"></i>&nbsp;Delete product</button>
                            </div>
                        </div>
        </div>
        <div v-else>
            <h3 class="m-3">{{ this.msg }} There is an option for it in the sidebar!</h3>
        </div>
    </div>
    `,
    data() {
        return {
            token: localStorage.getItem('auth-token'),
            categories: [],
            editProd: {
                product_id: null,
                product_name: null,
                description: null,
                price_per_unit: null,
                units: null,
                stock: null,
                expiry_date: null,
                product_category_id: null
            },
            todel: null,
            error: null,
            success: null
        }
    },
    methods: {
        async editProduct(){
            const res = await fetch('/api/product', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token,
                },
                body: JSON.stringify(this.editProd)
            });
            const data = await res.json();
            if (res.ok) {
                this.success = data.info;
            }
            else {
                this.error = data.message;
            }
            if (this.success) {
                this.editProd = {
                    product_name: null,
                    description: null,
                    price_per_unit: null,
                    units: null,
                    stock: null,
                    expiry_date: null,
                    product_category_id: null,
                }
            }
            setTimeout(() => {
                this.success = null;
                this.error = null;
            }, 7000)
        },
        async deleteProduct() {
            try {
                const res = await fetch('/api/product', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token
                    },
                    body: JSON.stringify({
                        product_id: this.todel
                    })
                })
                const data = await res.json()
                if (res.ok) {
                    this.error = null
                    this.success = data.info
                } else {
                    this.success = null
                    this.error = data.message
                    if (this.error || this.success) {
                        setTimeout(() => {
                            this.error = null;
                            this.success = null;
                        }, 10000)
                    }
                }
            } catch (err) {
                console.log(err)
            }
        },
        async publishProduct(id) {
            try {
                const res = await fetch('/api/publish/product', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token
                    },
                    body: JSON.stringify({
                        product_id: id
                    })
                })
                const data = await res.json()
                if (res.ok) {
                    this.error = null
                    this.success = data.info
                } else {
                    this.success = null
                    this.error = data.message
                }
                if (this.error || this.success) {
                    setTimeout(() => {
                        this.error = null;
                        this.success = null;
                    }, 10000)
                }
            } catch (err) {
                console.log(err)
            }
        },
    },
    async mounted() {
        const res = await fetch('/api/category', {
            method : 'GET',
            headers: {
                    'Authentication-Token': this.token,
                }
            });
        const data = await res.json();
        if (res.ok) {
            this.categories = data;
        }
        else {
            this.error = data.message;
        }
    }
}