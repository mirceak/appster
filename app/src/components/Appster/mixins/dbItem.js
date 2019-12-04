import makesRequests from "./makesRequests";

export default {
    mixins:[
        makesRequests
    ],
    methods:{
        async index(){
            return await this.$axios
                .get(this.baseUrl + this.itemName)
        },
        async create(){
            return await this.$axios
                .get(this.baseUrl + this.itemName + '/create')
        },
        async show(){
            return await this.$axios
                .get(this.baseUrl + this.itemName + '/' + this.id)
        },
        async store(form){
            return await this.$axios
                .post(this.baseUrl + this.itemName, form)
        },
        async edit(id){
            return await this.$axios
                .get(this.baseUrl + this.itemName + id + "/edit")
        },
        async update(id, form){
            return this.$axios
                .put(this.baseUrl + this.itemName + '/' + id, form)
        },
        async destroy(id){
            return this.$axios
                .delete(this.baseUrl + this.itemName + id)
        }
    }
}
