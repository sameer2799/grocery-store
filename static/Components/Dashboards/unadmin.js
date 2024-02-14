export default {
    template: `
    <div class="container">
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
                                    <input type="number" class="form-control" id="inputPassword2" placeholder="1" disabled>
                                </div>
                                <div class="col-auto">
                                    <a><button type="button" class="btn btn-outline-secondary mb-3" disabled>Add to Cart</button></a>
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