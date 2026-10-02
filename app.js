require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

//Body parsing middleware 
app.use(express.json());
app.use(cors());

let todos =  [
    { id: 1, task: "Learn node.js", completed: false},
    { id: 2, task: "Build CRUD API", completed: false},
];

app.get('/todos', (req, res) => {
    res.status(200).json(todos); //Send array as JSON
});

app.post('/todos', (req, res) => {
    const newTodo = { id: todos.length + 1, ...req.body}; // Auto-ID
    todos.push(newTodo);
    res.status(201).json(newTodo); //Echo back
});

// PATCH Update-Partial
app.patch('/todos/:id', (req, res) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id)); //Array Find
    if (!todo) return res.status(404).json({ message: 'Todo not found'});
    Object.assign(todo, req.body); //Merge e.g completed: True
    res.status(200).json(todo);
});

app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos=todos.filter((t) => t.id !== id); //Array.filter =nondestructive
    if (todos.length === initialLength)
        return res.status(404).json({error: 'Not found'});
    res.status(204).send(); //Silent success

});



//Get single Todo by id
app.get('/todos/:id', ( req, res) =>{
    const id = parseInt(req.params.id);
    const todo = todos.find(t=>t.id===id);
    if (!todo){
        return res.status(400).json ({error: 'Todo not found'});
    }
    res.status(200).json(todo);
})


//New todo with validation
app.post('/todos/auth', (req, res) => {
    if(!req.body.task){
        return res.status(406).json ({error:"Task field is required"});
    }
    const newTodo = { 
        id: todos.length + 1,
        task: req.body.task,
        completed: req.body.completed || false
    } ;
    todos.push(newTodo);
    res.status(206).json (newTodo);
});


const PORT = process.env.PORT

app.listen(PORT, () =>{
    console.log('Server is listening on Port ${PORT}');
});


