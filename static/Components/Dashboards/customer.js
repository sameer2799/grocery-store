export default {
    props : ['data'],
    template: `
    <div class="m-3 p-3">
        <div v-if="this.dummy_products.length !== 0">
        <div class="row row-cols-1 row-cols-md-3 g-4">
            <div class="col" v-for="prod in this.dummy_products">
                <div class="card h-100">
                <div v-if="prod.is_featured" class="card-header">
                    Featured!
                </div>
                <div class="card-body">
                    <h5 class="card-title">{{ prod.product_name }}</h5>
                    <p class="card-text text-muted">{{ prod.product_category_id }}</p>
                    <div class="card-body m-0 p-0 text-end">
                        <p class="card-text">&#8377;{{ prod.price_per_unit }} per {{ prod.units }}</p>
                    </div>
                    <p class="card-text">{{ prod.description }}</p>
                    <p class="card-text">Expiry Date: {{ prod.expiry_date }}</p>
                    <p class="card-text">Select Quantity: </p>
                    <div v-if="prod.stock !== 0 && isNotExpired(prod.expiry_date)">
                        <form class="row g-2">
                            <div class="col-auto">
                                <label for="inputPassword2" class="visually-hidden">Quantity</label>
                                <input type="number" class="form-control" id="inputPassword2" placeholder="0" v-model="prod.quantity">
                            </div>
                            <div class="col-auto">
                                <button type="button" class="btn btn-outline-primary mb-3" @click="addToCart(prod.product_id,prod.quantity)"><i class="bi bi-basket2"></i>&nbsp;Add to Cart</button>
                            </div>
                        </form>
                    </div>
                    <div v-else>
                        <form class="row g-2">
                            <div class="col-auto">
                                <label for="inputPassword2" class="visually-hidden">Quantity</label>
                                <input type="number" class="form-control" id="inputPassword2" placeholder="0" disabled>
                            </div>
                            <div class="col-auto">
                                <button type="button" class="btn btn-outline-secondary mb-3" disabled><i class="bi bi-basket2"></i>&nbsp;Add to Cart</button>
                            </div>
                        </form>
                    </div>
                    <div class="card-body m-0 p-0 text-end">
                        <p class="card-text text-muted">Seller: {{ prod.seller_id }}</p>
                    </div>
                </div>
                <div class="card-footer text-muted">
                    Stock Left : {{ prod.stock }}
                </div>
                </div>
            </div>
        </div>
        </div>
        <div v-else>
            <h3 class="m-3">There are no products to show!</h3>
        </div>
    </div>`,
    data() {
        return {
            token: localStorage.getItem('auth-token'),
            dummy_products: [],
            cart: [],
            error: null,
            info: null
        }
    },
    methods: {
        isNotExpired(date) {
            const today = new Date();
            const expiry = new Date(date);
            return today < expiry;
        },
        addToCart(id, quant) {
            this.cart.push({ product_id : id, quantity : quant});
            this.saveToCart();
        },
        async saveToCart() {
            
            const res = await fetch('/add-to-cart', {
                method : 'POST',
                headers: {
                        'Authentication-Token': this.token,
                        'Content-Type': 'application/json'
                    },
                body: JSON.stringify(this.cart)
                });
            const data = await res.json();
            if (res.ok) {
                this.info = data.info;
            }
            else {
                this.error = data.message;
            }
        },        
    },
    async mounted() {
        const res = await fetch('/api/product', {
            method : 'GET',
            headers: {
                    'Authentication-Token': this.token,
                }
            });
        const data = await res.json();
        if (res.ok) {
            this.dummy_products = data.map(prod => {
                return {
                    ...prod,
                    quantity: 0
                };
            });
        }
        else {
            this.error = data.message;
        }
    }   
}