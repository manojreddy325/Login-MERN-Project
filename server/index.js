const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const uri = "mongodb+srv://manojreddy:Smanu%40143@loginapp.hvwgvfw.mongodb.net/loginapp?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}

connect();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
      .then(user => {
          if (user) {
              if (password === user.password) {
                  res.send({ message: "Login Successful", user: user })
              } else {
                  res.send({ message: "Password didn't match" })
              }
          } else {
              res.send({ message: "User not registered" })
          }
      });
});

app.post("/signup", (req, res)=> {
  const { name, email, password} = req.body
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        res.send({ message: "User already registered" })
      } else {
        const newUser = new User({
          name,
          email,
          password
        })
        return newUser.save()
      }
    })
    .then(() => {
      res.send({ message: "Successfully registered, please login now." })
    })
    .catch(err => {
      res.send(err)
    })
}) 

app.listen(3006,() => {
  console.log("DB started at port 3006")
})