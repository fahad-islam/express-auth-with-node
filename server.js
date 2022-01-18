const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();


app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())

app.use(morgan('dev'));
app.use(express.static("public"));
app.set("view engine", "ejs");


app.use("/", require("./routes/index"));
app.use("/login", require("./routes/login"));
app.use("/signup", require("./routes/signup"));
app.use("/refreshtoken", require("./routes/refreshToken"));



app.listen(8989, (err) => {
  if (err) throw err;
  mongoose.connect('mongodb://127.0.0.1:27017/auth').then(() => {
    console.log("server is running at PORT: 8989");
  }).catch(err => {
      console.log(`${err.message}`);
  })
});

