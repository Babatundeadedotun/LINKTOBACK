const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 8500
const mongoose = require('mongoose')
const URL = process.env.URI
const cors = require('cors')
const bodyParser = require('body-parser')
const {MongoClient} = require('mongodb')
const dbName = "test"


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

        mongoose.connect(URL)
            .then(() => {
                console.log('Connected to Database')
            })
            .catch((err) => {
                console.log(err)
            })


    let userSchema = mongoose.Schema({
        item: {type: String, required: [true, "Name is required"]},
        model: {type: String, required: [true, "Model is required"]},
        price: {type: String, required: [true, "Price is required"]}
    })

    let userModel = mongoose.model('users', userSchema)

       app.post("/submit", (req, res) => {
            console.log(req.body)
            const form = new userModel(req.body)
            form.save()
       })
       
       app.get("/data", async (req, res) => {
        try {
            const user = await userModel.find();
            res.json(user);
        } 
        catch (error) {
            console.error("Error fetching", error);
            res.status(500).send("Server Error");
        }
        })

        app.delete("/data/:id", async (req, res) => {
            try {
                const { id } = req.params;
                const deleteItem = await userModel.findByIdAndDelete(id);
                if (!deleteItem) {
                    return res.status(404).json({ message: "Item not found" });
                }
                res.status(200).json({ message: "Item deleted successfully" });
            } catch (error) {
                console.error("Error deleting item", error);
                res.status(500).json({message: "Error deleting item"});
            }
            
        })

        app.put("/data/:id", async (req, res) => {
            try {
                const { id } = req.params;
                const { item, model, price } = req.body;
                const updatedItem = await userModel.findByIdAndUpdate(id, { item, model, price }, { new: true });
                if (!updateItem) {
                    return res.status(404).json({ message: "Item not found" });
                }
                res.status(200).json(updatedItem);
            } catch(error) {
                console.error("Error updating item", error);
                res.status(500).json({message: "Error updating item"});
            }
        })



    //    app.get("/submit", (req,res) => {
    //     res.send("Form Submitted")
    //     // res.send(req.body)
    //    })

      // app.get("/cars", (req, res) => {
        //     res.send(cars)
        // })

      // const cars = [
//     {
//         name: 'BMW',
//         model: 'X5',
//         price: 89000
//     },
//     {
//         name: 'Mercedes',
//         model: 'C63se',
//         price: 120000
//     },
//     {
//         name: 'Audi',
//         model: 'A4',
//         price: 80000
//     },
//     {
//         name: 'ROlls-Royce',
//         model: "Cullinan",
//         price: 800000
//     },
//     {
//         name: 'Lamborghini',
//         model: 'Aventador',
//         price: 500000
//     }
// ] 

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})