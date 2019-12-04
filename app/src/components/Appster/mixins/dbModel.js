import dbItem from "./dbItem";

export default {
    data(){
        return {
            _modelLoaded: false,
            _modelsLoaded: false,
            _model: {},
            _models: []
        }
    },
    props:{
        custom_data: Object,
        id: String
    },
    mixins:[
        dbItem
    ],
    computed:{
        model: {
            get(){
                if (!this._modelLoaded){
                    this._modelLoaded = true;
                    var _this = this;
                    this.show().then((model)=>{
                        _this.model = {...model.data};
                    });
                }
                return this._data._model;
            },
            set(value){
                this._data._model = value;
            }
        },
        models: {
            get(){
                if (!this._modelsLoaded){
                    this._modelsLoaded = true;
                    var _this = this;
                    this.index().then((models)=>{
                        _this.models = [...models.data];
                    });
                }
                return this._data._models;
            },
            set(value){
                this._data._models = value;
            }
        },
        valid_model(){
            //if we have the template ready the model should be considered valid at this point
            return this.model && this.model.template;
        }
    },
}
