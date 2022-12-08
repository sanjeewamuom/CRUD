var mysql = require("mysql2");
const express = require('express');
const app = express();
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
const router = express.Router();

app.use("/", router);

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const cors = require("cors");   // npm install cors --save
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}



const connection = mysql.createConnection({
    host: "localhost",
    password: "admin",
    user: "sanjeewa",
    database: "db1",
    multipleStatements: true
});

app.use(cors(corsOptions))  // cors

app.get("/", (req, res) => {
    connection.query(
        'SELECT * FROM cars ',
        function (err, results, fields) {
            res.send(results);

        }
    );

    connection.connect(function (error) {
        if (error) {
            throw error;
        }

    });
});


app.post('/update', urlencodedParser, function (req, res) {

    var data = {
        id: req.body.Id,
        brand: req.body.Brand,
        model: req.body.Model,
    };
    var ID1 = req.body.Id;

    console.log(data);

    var query = connection.query("UPDATE cars set ? WHERE id = ? ", [data, ID1], (err, result) => {
        if (err) {
            console.log(err);
            return next("Mysql post error when updating, check your query");
        }


    });

    connection.query(
        'SELECT * FROM cars WHERE id = ? ', [ID1],
        function (err, results, fields) {
            if (err) {
                console.log(err);
                return next("Mysql get function when updating error, check your query");
            }
            res.send(results);

        }
    );

});


app.post('/add', urlencodedParser, function (req, res) {

    var data = {
        id: req.body.Id,
        brand: req.body.Brand,
        model: req.body.Model,
    };
    var ID1 = req.body.Id;

    console.log(data);

    var query = connection.query("INSERT INTO cars set ?", data, (err, result) => {


        if (err) {
            console.log(err);
            return next("Mysql post error when adding, check your query");
        }

    });

    connection.query(
        'SELECT * FROM cars WHERE id = ? ', [ID1],
        function (err, results, fields) {
            if (err) {
                console.log(err);
                return next("Mysql get function when using get function for add op error, check your query");
            }
            res.send(results);

        }
    );


});


app.post('/delete', urlencodedParser, function (req, res) {

    
    var ID1 = req.body.Id;

    var query = connection.query("DELETE FROM cars WHERE ID = ?", ID1, (err, result) => {


        if (err) {
            console.log(err);
            return next("Mysql post delete op error, check your query");
        }

    });

    var query = connection.query("DELETE FROM new_cars; INSERT INTO new_cars SELECT * FROM cars; DELETE FROM cars; ALTER TABLE cars AUTO_INCREMENT = 1;INSERT INTO cars (brand, model) SELECT brand, model FROM new_cars;", (err, result) => {


        if (err) {
            console.log(err);
            return next("Mysql post delete op multiple queries error, check your query");
        }

    });

    connection.query(
        'SELECT * FROM cars ',
        function (err, results, fields) {
            if (err) {
                console.log(err);
                return next("Mysql get function when deleting error, check your query");
            }
            res.send(results);

        }
    );


});



app.listen(3000, () => {
    console.log("Started on port 3000")
});

module.exports = router;