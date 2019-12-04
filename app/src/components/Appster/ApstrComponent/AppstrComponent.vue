<template>
    <component
        v-if="readyToRender && (!custom_data || !custom_data.hide_parent)"
        v-bind:is="template"
        :model.sync="model"
        :data.sync="custom_data"
    >
    </component>
</template>

<script>
    import dbModel from "../mixins/dbModel";

    export default {
        name: "AppstrComponent",
        mixins:[
            dbModel
        ],
        mounted() {
          // console.log(this.custom_data)
        },
        data(){
            return{
                itemName: 'appster_component'
            }
        },
        computed: {
            //we check if can show the component
            readyToRender() {
                return this.valid_model;
            },
            //we get the template for rendering
            template() {
                return {
                    template: this.model.template,
                    mixins: [this.$moduleProxy(this.model.mixin)],
                };
            },
        },
    }
</script>

<style scoped>

</style>
