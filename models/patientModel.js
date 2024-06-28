const mongoose =require("mongoose");

const patientSchema =new mongoose.Schema({
    mentalHealth : {
        type : String,
        require:true,
    },
    
    yourAddress:{
        type : String,
        require : true,
        minlenght : 20,
    },

    job:{
        type : String,
        require : true,
    },

    phone :{
        type: Number,
        require : true,
    },


},{timestamps:true});


module.exports = mongoose.model("patient", patientSchema);