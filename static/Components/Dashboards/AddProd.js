export default {
    template: `
    <div class="container d-flex justify-content-center">
        
        <form class="row g-3">
            <div class="col-md-6">
                <label for="prodname" class="form-label">Product Name</label>
                <input type="text" class="form-control" id="prodname" placeholder="Banana" v-model="this.newProd.product_name" required>
            </div>
            <div class="col-md-6">
                <label for="catname" class="form-label">Category</label>
                <select id="catname" class="form-select" v-model="this.newProd.product_category_id" placeholder="Choose...">
                    <option disabled>Choose...</option>
                    <option v-for="cat in categories" :value="cat.category_id">{{ cat.category_name }}</option>
                </select>
            </div>
            <div class="col-12">
                <label for="description" class="form-label">Description</label>
                <input type="text" class="form-control" id="description" placeholder="Fresh from farm" v-model="this.newProd.description">
            </div>
            <div class="col-md-4">
                <label for="inputprice" class="form-label">Price per unit</label>
                <input type="number" class="form-control" id="inputprice" placeholder="10.0" v-model="this.newProd.price_per_unit">
            </div>
            <div class="col-md-4">
                <label for="units" class="form-label">Units</label>
                <input type="text" class="form-control" id="units" placeholder="dozen" v-model="this.newProd.units">
            </div>
            <div class="col-md-4">
                <label for="inputZip" class="form-label">Stock</label>
                <input type="number" class="form-control" id="inputZip" placeholder="50.0" v-model="this.newProd.stock">
            </div>
            <div class="col-12">
                <label for="expiryDate" class="form-label">Expiry Date</label>
                <input type="date" class="form-control" id="expiryDate" v-model="this.newProd.expiry_date">
            </div>
            <div class="col-12 mt-2 mb-3">
                <button type="button" class="btn btn-outline-success" @click="saveProduct">Save Product Draft</button>
            </div>
        <div class="alert alert-success" role="alert" v-if="this.save_prod_info">{{ this.save_prod_info }}</div>
        <div class="alert alert-danger" role="alert" v-if="this.save_prod_error">{{ this.save_prod_error }}</div>
        </form>
        
    </div>`,
    data() {
        return {
            token: localStorage.getItem('auth-token'),
            categories: [],
            newProd: {
                product_name: null,
                description: null,
                price_per_unit: null,
                units: null,
                stock: null,
                expiry_date: null,
                product_category_id: null,
            },
            save_prod_info: null,
            save_prod_error: null,
            error: null
        }
    },
    methods: {
        async saveProduct() {
            const res = await fetch('/api/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token,
                },
                body: JSON.stringify(this.newProd)
            });
            const data = await res.json();
            if (res.ok) {
                this.save_prod_info = data.info;
            }
            else {
                this.save_prod_error = data.message;
            }
            if (this.save_prod_info) {
                this.newProd = {
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
                this.save_prod_info = null;
                this.save_prod_error = null;
            }, 7000)
        }
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