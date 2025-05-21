const express = require ('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

const PORT = 3000;
app.use(express.json());

const books = [];
const users = [];
const JWT_SECRET="secret" ;



app.get('/books/', (req, res)=>{
    res.send(books);
    
})

app.get('/books/:id', (req, res)=>{
    console.log(req.params.id);

    const book = books.find((book)=> book.id == parseInt(req.params.id));
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book)
})

app.post('/books/', (req, res) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } 
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.find(user => user.email === decoded.email);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;

    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        desc: req.body.desc,
        author: req.user.username
    };
    books.push(newBook);
    res.json(newBook);
    
})

app.put('/books/:id', (req, res) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } 
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.find(user => user.email === decoded.email);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;

    const book = books.find((book) => book.id == parseInt(req.params.id));
    if(!book){
        return res.status(404).json("Book not found");

      }
      if(book.author !== req.user.username){
        return res.status(403).json("You are not authorized to update this book");
      }
 
      book.title = req.body.title;
      book.desc = req.body.desc;
      book.author = req.user.username;

      res.json(book);
    });

    app.delete('/books/:id', (req, res)=> {
        const book = books.find((book) => book.id == req.params.id);
        if(!book){
            return res.status(404).send("Book not found");
          }
            if(book.author !== req.user.username){
                return res.status(403).json({ message: "You are not authorized to delete this book" });
            }
     
          const index = books.indexOf(book);
          books.splice(index, 1);
          res.json(book);
    })

    app.post('/books/register', async(req, res) => {
    const { username, email, password } = req.body;
    const userExist = users.find(user => user.email === email);
    if (userExist) {
        return res.status(400).json({ message: 'User already exists' });
    }
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { username, email, password: hashedPassword };
    users.push(newUser);
  
    // const token = jwt.sign(
    //     { email: newUser.email,  username: newUser.username },
    //     JWT_SECRET,
    //     { expiresIn: '1h' }
    // );
    res.status(201).json({message: 'user created successfully',
        user: { username: newUser.username, email: newUser.email },
        // token: token
    });
}
)

 
 app.post('/books/sign-in', async(req, res) => {
    const {  email, password } = req.body;
    const userExist = users.find(user => user.email === email);
    if (!userExist) {
        return res.status(400).json({ message: 'User does not exist' });
    }
    const ispasswordValid = await bcrypt.compare(password, userExist.password);
    if (!ispasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    const token = jwt.sign(
        { email: userExist.email, username: userExist.username },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'User signed in successfully', 
         token ,
         user: { username: userExist.username, email: userExist.email } });
 });



app.listen(PORT, ()=>{
    console.log(`app listening at http://localhost:${PORT}`);
}) 