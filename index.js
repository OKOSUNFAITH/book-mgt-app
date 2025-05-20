const express = require ('express')
const app = express()
;

const PORT = 3000;

const books = [
    {id: 1, title:'the old woman', desc:'kids', author:'John'},
    {id: 2, title:'Storm', desc:'Adults', author:'Jane'},
    {id: 3, title:'hello', desc:'teens', author:'Doe'},
    {id: 4, title:'sunrise', desc:'kids', author:'Smith'},
]
const users = [];
 

app.use(express.json());

app.get('/books/', (req, res)=>{
    res.send(books);
    
})

app.get('/books/:id', (req, res)=>{
    console.log(req.params.id);

    const book = books.filter((book)=> book.id == req.params.id);

    res.json(book)
})

app.post('/books/', (req, res) => {
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        desc: req.body.desc
    }
    books.push(newBook);
    res.json(newBook);
    
})

app.put('/books/:id', (req, res) => {
    const book = books.find((book) => book.id == req.params.id);
    if(!book){
        return res.status(404).send("Book not found");
      }
 
      book.title = req.body.title;
      book.desc = req.body.desc;
      res.json(book);
    });

    app.delete('/books/:id', (req, res)=> {
        const book = books.find((book) => book.id == req.params.id);
        if(!book){
            return res.status(404).send("Book not found");
          }
     
          const index = books.indexOf(book);
          books.splice(index, 1);
          res.json(book);
    })

app.post('/sign-up', (req, res) => {
    const { username, email, password } = req.body;
    const users = users.find(u => u.username === username);
    if (users) {
        return res.status(400).json({ message: 'User already exists' });
    }
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
       

    res.status(201).json({ message: 'User created', user: { username } });
}
);



app.listen(PORT, ()=>{
    console.log(`app listening at http://localhost:${PORT}`);
}) 