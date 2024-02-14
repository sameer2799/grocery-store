import UnloggedCustomer from './Components/uncustomer.js'

export default {
    props : ['data'],
    template: `
    <unlogged-customer></unlogged-customer>
    `,
    components: {
        UnloggedCustomer
    }
}