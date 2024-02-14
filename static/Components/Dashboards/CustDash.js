export default {
    props : ['data'],
    template: `<div>
        <div class="modal fade" id="checkout" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">Checkout</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Enter address</label>
                            <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="Home, UP" required v-model="address">
                        </div>
                        <div class="mb-3">
                            <span class="fw-bold">Amount to Pay = {{ this.total }}</span>
                        </div>
                        <div class="mb-3">
                            <label for="payname" class="form-label">Select Payment Method</label>
                            <select id="payname" class="form-select" v-model="payment_method">
                                <option disabled>Choose...</option>
                                <option value="Card">Card</option>
                                <option value="Net Banking">Net Banking</option>
                                <option value="PayPal">PayPal</option>
                                <option value="UPI">UPI</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                                <option value="Cryptocurrency">Cryptocurrency (e.g., Bitcoin, Ethereum)</option>
                                <option value="Mobile Wallets">Mobile Wallets (e.g., Samsung Pay, Alipay)</option>
                                <option value="Gift Card">Gift Card</option>
                            </select>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center mb-3">
                        <div role="alert" class="alert-success">
                            {{ this.order_info }}
                        </div>
                        <div role="alert" class="alert-danger">
                            {{ this.order_error }}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="this.checkout()">Place order</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-3 row">
        <div class="col-12">
            <div class="jumbotron jumbotron-fluid">
                <div class="container">
                    <h1 class="display-5">Checkout your Cart!</h1>
                </div>
            </div>
        </div>
        </div>
        
        <div class="container mb-5">
        <div v-if="this.dummy_products.length === 0">
            <h5 class="m-3">Add something to your cart!</h5>
        </div>
        <div v-else>
            <div class="table-responsive">
                <table class="table table-striped table-hover align-middle">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Product</th>
                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Product Amount</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p, index in this.dummy_products">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ p.name }}</td>
                            <td>{{ p.price }}</td>
                            <td>{{ p.q }}</td>
                            <td>{{ p.total }}</td>
                            <td><button type="button" class="btn btn-outline-danger" @click="removeItem(p.id)">Remove</button></td>
                        </tr>
                        
                    </tbody>
                    <tfoot>
                        <tr class="align-bottom">
                            <th scope="row"></th>
                            <td></td>
                            <td></td>
                            <td class="fw-bold">Total Amount</td>
                            <td class="fw-bold">{{ this.total }}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#checkout">Checkout</button>
            </div>
        </div>
        </div>
        <div class="d-flex justify-content-center">
            {{ this.error }}
            {{ this.info }}
        </div>
        
    </div>`,
    data() {
        return {
            token: localStorage.getItem('auth-token'),
            cart : [],
            dummy_products : [],
            total: 0,
            address: null,
            payment_method: null,
            error: null,
            info: null,
            order_info: null,
            order_error: null
        }
    },
    computed() {
        
    },
    methods: {
        async removeItem(id) {
            const res = await fetch(`/api/cart`, {
                method : 'DELETE',
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({product_id: id})
            });
            const data = await res.json();
            if (res.ok) {
                this.info = data.message;
            }
            else {
                this.error = data.message;
            }
            this.$router.go(0);
        },
        amtToPay() {
            return this.dummy_products.reduce((acc, curr) => acc + curr.total, 0);
        },
        refineData() {
            this.cart.forEach(item => {
                this.dummy_products.forEach(prod => {
                    if (item.carted_products === prod.id){
                        prod.q = item.quantity;
                        prod.total = prod.q * prod.price;
                    }
                })                
            })
            this.dummy_products = this.dummy_products.filter(prod => prod.q > 0);
        },
        async checkout() {
            const res = await fetch('/api/order', {
                method : 'POST',
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    total: this.total,
                    address: this.address,
                    pay_method: this.payment_method
                })
            });
            const data = await res.json();
            if (res.ok) {
                this.order_info = data.info;
                this.dummy_products = [];
                this.total = 0;
                this.pay_method = null;
                this.address = null;
            }
            else {
                this.order_error = data.message;
            }
            if (this.order_info || this.order_error) {
                setTimeout(() => {
                    this.order_info = null;
                    this.order_error = null;
                }, 5000);
            }
        },
        async fetchCart() {
            const res = await fetch('/api/cart', {
                method : 'GET',
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (res.ok) {
                this.cart = data;
            }
            else {
                this.error = data.message;
            }
        }
    },
    async mounted() {
        this.fetchCart();

        const res1 = await fetch('/api/product', {
            method : 'GET',
            headers: {
                'Authentication-Token': this.token,
            }
        });
        const data1 = await res1.json();
        if (res1.ok) {
            this.dummy_products = data1.map(prod => {
                return {
                    id: prod.product_id,
                    name: prod.product_name,
                    cat: prod.product_category_id,
                    price: prod.price_per_unit,
                    q: 0,
                    total: 0
                };
            });
        }
        else {
            this.error = data1.message;
        }
        this.refineData();
        this.total = this.amtToPay();
        if (this.error || this.info) {
            setTimeout(() => {
                this.error = null;
                this.info = null;
            }, 5000);
        }
    }
}