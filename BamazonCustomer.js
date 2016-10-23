var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "Bamazon"
})


connection.connect(function(err) {
    if (err) throw err;
    printStoreListings();
})

function printStoreListings(res) {
	connection.query("SELECT * FROM products", function(err, rows) {
    console.log("!!!ALL AVAILABLE PRODUCTS FOR SALE!!!");
        rows.forEach(function(row){
        console.log("\nProduct: " + row.product_name + "\nLocated in the " + row.department_name + " department." + "\nPrice: $" + row.price + "\nQuantity Left: " + row.stock_quantity);
        });    
    });
}

connection.end();