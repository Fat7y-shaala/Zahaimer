const fs = require('fs'); 

//  require('colors');

const dotenv = require('dotenv');

const Product = require ('../../models/productModel');

const dbconnection =require ('../../config/database');

dotenv.config({path : '../../config.env'});


dbconnection();

const products =JSON.parse(fs.readFileSync('./products.json'));


const insertData = async()=> {
     try{
         await Product.create (products);
         console.log ('data inserted');
         process.exit();
     }catch(error){
       console.log (error);
     }
};


const destroyData = async()=> {
    try{
        await Product.deleteMany();
        console.log ('data destroyed');
        process.exit();
    }catch(error){
      console.log (error);
    }
};

// node seeder.js

if (process.argv[2] === "-i"){
    insertData();
}else if (process.argv[2] === "-d"){
    destroyData();
}