export default {
    props : ['data'],
    template: `
    <div>
    <div class="modal fade" id="add_cat_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add New Category</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">Category Name</label>
                    <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Fruits" v-model="category_name">
                </div>
                <div class="mb-3">
                    <label for="exampleFormControlInput2" class="form-label">Description</label>
                    <input type="text" class="form-control" id="exampleFormControlInput2" placeholder="Fresh from farm" v-model="description">
                </div>
                    <span v-if="this.add_cat_done" class="fst-italic text-success">{{ add_cat_done}}<br><span class="text-danger">Don't submit duplicate requests otherwise all will be rejected!"</span></span>
                    <div v-if="this.add_cat_error" class="fst-italic text-danger"> {{ add_cat_error }} </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="add_category">Submit Request</button>
            </div>
            </div>
        </div>
    </div>
        
            <div v-if="this.error" class="d-flex justify-content-center">{{ this.error }}</div>
            <div v-else>
                <div class="container d-flex flex-wrap">
                    <div class="list-container ">
                        <div v-if="this.cat_error">
                            <span class="fst-italic">{{ this.cat_error }}</span><br><br>
                            <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#add_cat_modal">Add Category</button>
                        </div>
                        <div v-else-if="!this.categories">
                            <span class="fst-italic">No Approved Category Available!</span><br><br>
                            <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#add_cat_modal">Add Category</button>
                        </div>
                        <div v-else>
                            <ul class="list-group list-group-numbered">
                                <li class="list-group-item" v-for="category in this.categories">{{ category.category_name }}</li>
                                <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#add_cat_modal">Request a new Category</button>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        
    </div>`,
    data() {
        return {
            token: localStorage.getItem('auth-token'),
            categories: [],
            error: null,
            cat_error: null,
            category_name: null,
            description: null,
            add_cat_done: null,
            add_cat_error: null,
        }
    },
    methods:{
        async add_category(){
            const res = await fetch('/api/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                },
                body: JSON.stringify({
                    name: this.category_name,
                    description: this.description,
                })
            });
            const data = await res.json().catch((err) => {this.cat_error = err});
            if (res.ok) {
                this.add_cat_done = data.info;
            } else {
                this.add_cat_error = data.message;
            }
            if (this.add_cat_error || this.add_cat_done) {
                setTimeout(() => {
                    this.add_cat_error = null
                    this.add_cat_done = null
                }, 7000)
            }   
        }
    },
    components: {
    },
    async mounted() {
        const response = await fetch('/api/category', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': this.token
            },
        });
        
        const data = await response.json().catch((err) => {this.error = err});
        if (response.ok) {
            this.categories = data
            // console.log(this.categories)
        } else {
            this.cat_error = data.info;
        }
    }
}
