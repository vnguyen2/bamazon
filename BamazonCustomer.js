var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "BamazonDB"
})

connection.connect(function(err) {
    if (err) throw err;
	console.log("You are connected.");
    bamazonShopping(); 
})

var printBamazonShop = function(){
    console.log("\n!!!ALL AVAILABLE PRODUCTS FOR SALE AT BAMAZON!!!");
    connection.query('SELECT * FROM products', function(err, res){
		var table = new Table({
			head: ['Item ID', 'Product Name', 'Department Name', 'Item Price', 'Quantity'],
			colWidths: [10, 45, 35, 12, 10]
		});
		for (var i = 0; i < res.length; i++) {
			table.push([res[i].itemID, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		}
		console.log(table.toString());   
    });
}

var restart = function(){
	inquirer.prompt([
		{
			type: "confirm",
			name: "restart",
			message: "Would you like to purchase anything else?"
		}
	]).then(function(userChoice){
		if (userChoice.restart){
			bamazonShopping();
		}else{
			console.log("Thank you! Please come again.");
            connection.end();
		}
	})
}

var bamazonShopping = function() {
    printBamazonShop();
	connection.query('SELECT * FROM products', function(err, res) {
		inquirer.prompt([{
			name: 'item',
			type: 'input',
			message: 'Which item would you like to purchase? (Enter the Item ID)'
		},
		{
			name: 'quantity',
			type: 'input',
			message: 'How many would you like to purchase?'
		}]).then(function(answer) {
			var itemID = answer.item;
            //index is -1 of the itemID since list starts at 1 and array is 0
			var chosenItem = res[itemID-1];
            var productName = chosenItem.product_name;
            var itemPrice = chosenItem.price;
			var newQuantity = chosenItem.stock_quantity - answer.quantity;

			if (parseInt(newQuantity) >= 0) {
				connection.query('UPDATE products SET ? WHERE itemID = ?', [{ stock_quantity: newQuantity }, itemID]);
                console.log("\n=====================================================");
                console.log("Your purchase of " + productName + " was successful.");
                console.log("Your total was: $" + itemPrice);
                console.log("=====================================================");
                restart();
			} else {
                console.log("===========================");
				console.log('Sorry! We are out of stock.');
                console.log("===========================");
			    restart();
			}
		})
	})
}




