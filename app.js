const expres = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = expres();
const PORT = 3000;

const databaseURL = 'mongodb+srv://jcordero004:3Xcommunicado!@restaurant-management-s.itkzy.mongodb.net/?retryWrites=true&w=majority'

//this is to create our Database connection
mongoose.connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Mongodb connected...."))
    .catch(err => console.log("Mongodb Connection error..."))


app.use(expres.json());

//Getting all the data in database
app.get('/users', async (req, res) => {
    const users = await User.find(); //select * from
    res.json(users);
})

//getting data by ID
app.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id) // this req.params.id is the :id in the url
    res.json(user);
})

app.put('/user/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, 
            { new: true, runValidators: true });
        if(!updatedUser) {
            return res.status(404).json({ message: "Item not Found" })
        }
    
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})


//Creating data into the database
app.post('/user', async (req, res) => {
    try {
        const newUser = new User(req.body); //creating of new user request
        await newUser.save(); //saving it in the database
        res.status(201).json(newUser); //this is the respond of created user
    } catch (err) {
        console.log("I have an error", err);
    }
})

//Delete a user in database
app.delete('/user/:id', async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User is deleted", deletedUser });
})



app.listen(PORT, () => {
    console.log("I am running...")
})