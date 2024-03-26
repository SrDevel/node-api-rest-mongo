const exrpess = require('express');
const router = exrpess.Router();
const Book = require('../models/book.model')

// MIDDLEWARE
const getBook = async(req,res,next) => {
    let book;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json(
            {
                message: 'El ID del libro no es válido'
            }
        );
    }

    try {
        book = await Book.findById(id);
        if (!book){
            return res.status(404).json({
                message: 'Libro no encontrado'
            });
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    }
    res.book = book;
    next();
}


// Listar todos los libros
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        if (books.length === 0) {
            return res.status(204).json([]);
        }
        res.json(books);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Crear un libro
router.post("/", async (req, res) =>{
    const { title, author, genre, publication_date } = req.body;
    if (!title || !author || !genre || !publication_date){
        return res.status(400).json({message: "Todos los campos son requeridos"})
    } 
    try {
        const newBook = new Book({title, author, genre, publication_date});
        console.log(newBook);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

// Obtener un libro 
router.get('/:id', getBook, async(req, res) => {
    res.json(res.book);
});

// Actualizar un libro
router.put('/:id', getBook, async(req, res) => {
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Actualizar uno o varios campos de un libro
router.patch('/:id', getBook, async(req, res) => {

    if (!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date) {
        res.status(400).json({
            message: 'Al menos un campo es requerido para actualizar el libro: title, author, genre, publication_date'
        });
    }

    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.delete('/:id', getBook, async(req, res)=>{
    try {
        const book = res.book;
        await book.deleteOne({
            _id: book._id
        })

        res.json({
            message: `El libro ${book.title} fue eliminado correctamente`
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;