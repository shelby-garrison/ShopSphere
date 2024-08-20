const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");
const cartRouter = require("./routes/cartRouter");
const cartRouter2 = require("./routes/cartRouter2");
const db = require("./config/mongoose-connection");
const isLoggedIn = require("./middlewares/isLoggedIn");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('hgjvvujvujvh'));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(flash());
// app.use(express.static(path.join(__dirname, "public")));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
// app.use(express.static(__dirname + "public"));



app.use("/", indexRouter);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter2);


app.get("*",  async function (req, res) {
  res.render("404");
 }  
 );
const axiosInstance = axios.create({
  baseUrl: "https://external-api.bcon.global/api/v1" ,
  headers: {Authorization: `Bearer ${key}`}
})
 app.post("/create-checkout", isLoggedIn, async(req, res) => {
  try{
    const response = await axiosInstance.post("/address")
    res.json(response.data)
  } catch(error)
  {
    res.status(500).json({error: error.response.data.status})
  }
 })

app.get("/webhook", async(req,res) =>{
  const data = req.query;
  console.log(data)
})



const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
