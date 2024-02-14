import CatList from "./CatList.js"
import AddProd from "./AddProd.js"
import ProdAction from "./ProdAction.js"

export default {
    props : ['data'],
    template: `
    <div>
        <div class="modal fade" id="addProductModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">New Product</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                        <div class="modal-body">
                            <add-prod></add-prod>
                        </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="this.$router.go(0)" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="container mt-4">
            <div class="row">
                <div class="col-md-9 d-flex justify-content-center order-2 order-md-1">
                    <prod-action v-bind:data="this.products" v-bind:msg="this.error"></prod-action>
                </div>
                <div class="col-md-3 d-flex justify-content-center align-items-top order-1 order-md-2">
                    <div class="accordion" id="accordionPanelsStayOpenExample">
                        <div class="accordion-item">
                        <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                <span class="me-1">Categories Available</span>
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                            <div class="accordion-body">
                                <cat-list></cat-list>                    
                            </div>
                        </div>
                        </div>
                        <div class="accordion-item">
                        <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                <span class="me-1">Add Product</span>
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                            <div class="accordion-body">
                                <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#addProductModal">Add New Product</button>
                            </div>
                        </div>
                        </div>
                    </div>                
                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            token: localStorage.getItem('auth-token'),
            userRole: localStorage.getItem('role'),
            products: [],
            error: null
        }
    },
    methods:{
        goHome(){
            this.$router.push({ name: 'Home' })
        }
    },
    components: {
        CatList,
        AddProd,
        ProdAction
    },
    async mounted() {
        const res = await fetch('/api/product', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': this.token,
            }
        })
        
        const data = await res.json().catch(err => console.log(err))
        if (res.ok) {
            this.products = data;
        }
        else {
            this.error = data.message;
        }
        
    }
}