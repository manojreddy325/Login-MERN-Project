const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.send({ message: "User not registered" });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.send({ message: "Password didn't match" });
      return;
    }
    res.send({ message: "Login Successful", user: user });
  } catch (error) {
    res.send({ message: "An error occurred while logging in." });
  }
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        res.send({ message: 'User already registered' });
      } else {
        // Hashing the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            res.send({ message: 'Error while hashing password' });
          } else {
            const newUser = new User({
              name,
              email,
              password: hashedPassword, // Saving the hashed password
            });
            newUser.save()
              .then(() => {
                res.send({ message: 'Successfully registered, please login now.' });
              })
              .catch((err) => {
                res.send({ message: 'Error while saving user to database' });
              });
          }
        });
      }
    })
    .catch(err => {
      res.send({ message: 'Error while checking if user exists in database' });
    });
});


app.listen(3006,() => {
  console.log("DB started at port 3006")
})