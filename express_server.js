const express = require("express");
const app = express();
const PORT = 3001; // default port 8080

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "123",
  },
};
var cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));


app.set("view engine", "ejs")

const urlDatabase = {
  "b2xVn2": "https://www.lighthouselabs.ca",
  "9sm5xK": "https://www.google.com", 
};
app.post("/urls", (req, res) => {
  // console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  
  const templateVars = {  
    user: users[req.cookies["user_id"]],
  urls: urlDatabase};

  res.render("urls_index", templateVars); // Respond with 'Ok' (we will replace this)
});
app.post("/urls/:id", (req, res) => {
   urlDatabase[req.params.id] = req.body.longURL
  const templateVars = {  
    user: users[req.cookies["user_id"]],
  urls: urlDatabase};

  res.render("urls_index", templateVars); // Respond with 'Ok' (we will replace this)
});

app.post("/login", (req, res) => {


  const { email,  password} = req.body
  const userLogin = getUserEmail(email)
  if(userLogin){
    if(users[userLogin].password == password){
      res.cookie('user_id', userLogin);
      const templateVars = {  
        user: users[userLogin],
        urls: urlDatabase};
      
       res.render("urls_index",templateVars); 
    }else{
      res.json("403 Invalid credentials")
    }
   
   }else{
    res.json("403 Invalid credentials")
 
   }

});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  const templateVars = {  
   user: null,
   urls: urlDatabase};
 
  res.render("urls_index",templateVars); // Respond with 'Ok' (we will replace this)
 });



 app.get("/urls", (req, res) => {
   
  const userLogged = getUserEmail(users[ req.cookies["user_id"]]?.email);
  if(userLogged){
    const templateVars = { 
      user: users[req.cookies["user_id"]],
  
    urls: urlDatabase};
    res.render("urls_index", templateVars);
  }else{
   
    res.send("<h3>You should be logged to do this action.</h3>");
  }
 
});

app.get("/register", (req, res) => {

  const userLogged = getUserEmail(users[ req.cookies["user_id"]]?.email);
  if(userLogged){
    const templateVars = { 
      user: users[userLogged] ,
    urls: urlDatabase};
    res.redirect("/urls")
  }else{
    const templateVars = { 
      user: null ,
    urls: urlDatabase};
    res.render("form.ejs", templateVars);
  }
  
});

app.get("/login", (req, res) => {
  const userLogged = getUserEmail(users[ req.cookies["user_id"]]?.email);
  if(userLogged){
    const templateVars = { 
      user: users[userLogged] ,
    urls: urlDatabase};
    res.redirect("/urls")
  }else{
    const templateVars = { 
      user: null ,
    urls: urlDatabase};
    res.render("login.ejs", templateVars);
  }

})
app.post("/register", (req, res) => {

  const { password, email } = req.body
  const randomId = generateRandomString()
  const newUser = {
    [randomId]: {
    id: randomId,
    email: email,
    password: password,
  }}

  if(email == "" || email == null || password == "" || password == null){
    res.json("400 All fields are required")

 }
  if(getUserEmail(email) ){
    res.json("400 User exist")
  }
  Object.assign(users, newUser)
  res.cookie('user_id', randomId);
  const templateVars = { 
    user: users[randomId],
  urls: urlDatabase};
  res.render("urls_index", templateVars);

});

app.get("/u/:id", (req, res) => {
 
  const longURL = urlDatabase[req.params.id]
  if (longURL) {
    res.redirect(longURL);

  }else{
    res.send("<h1>This URLs doesn't exists.")
  }
}); 
app.get("/urls/new", (req, res) => {

  const userLogged = getUserEmail(users[ req.cookies["user_id"]]?.email);
  if(userLogged){
    const templateVars = { 
      user: users[req.cookies["user_id"]],
       id: req.params.id, longURL: urlDatabase[req.params.id] };
    res.render("urls_new", templateVars);
  }else{
    const templateVars = { 
      user: null ,
    urls: urlDatabase};
    res.render("login.ejs", templateVars);
  }
 
 
}); 
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    user: users[req.cookies["user_id"]],
     id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
}); 


  app.get("/", (req, res) => {
    res.send("Hello!");
  });
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



const generateRandomString = function (){
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  var length = 10
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
 }
 return result;
}

const getUserEmail = (email) =>{
  return Object.keys(users).find(key => users[key].email == email);
}

