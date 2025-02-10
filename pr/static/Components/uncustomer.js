export default {
    template: `
    <div class="container-fluid">
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
    <div class="m-3 p-3">
        <div v-if="this.products.length !== 0">
        <div class="row row-cols-1 row-cols-md-3 g-4">
            <div class="col" v-for="prod in this.products">
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

                        <form class="row g-2">
                            <div class="col-auto">
                                <label for="inputPassword2" class="visually-hidden">Quantity</label>
                                <input type="number" class="form-control" id="inputPassword2" placeholder="1">
                            </div>
                            <div class="col-auto">
                                <router-link to="/login"><button type="button" class="btn btn-outline-primary mb-3">Add to Cart</button></router-link>
                            </div>
                        </form>
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
    </div>
    </div>`,
    data() {
        return {
            products: [],
            error: null,
        }
    },    
    async mounted() {
        const res = await fetch('/api/unlog', {
            method : 'GET'
            });
        const data = await res.json();
        if (res.ok) {
            this.products = data;
        }
        else {
            this.error = data.message;
        }
    }
}