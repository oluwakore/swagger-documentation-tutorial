const express = require('express');
const router = express.Router()
const { nanoid } = require('nanoid')

const idLen = 10


/** 
 * @swagger
 * components:
 *  schemas:
 *    Book:
 *      type: object
 *      required:
 *        - title
 *        - author
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the book
 *        title:
 *          type: string
 *          description: The title of the book
 *        author:
 *          type: string
 *          description: The author of the book
 *      example:
 *        id: qFG34avbi0
 *        title: The Jabari of Masetryet
 *        author: Denalay Nondaal
 */


/** 
 * @swagger
 * tags:
 *  name: Books
 *  description: The Books Management API
 */



/**
 * @swagger
 * /books:
 *    get:
 *      summary: Returns the list of all the books in the database
 *      tags: [Books] 
 *      responses:
 *        200:
 *          description: The list of the books
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Book'
 * 
 */


router.get('/', (req, res) => {
  const books = req.app.db.get("books")

  res.send(books)
})


/**
 * @swagger
 * /books/{id}:
 *  get:
 *    summary: Returns a single book from the database by id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id 
 *    responses:
 *      200:
 *        description: The book details by id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book does not exist
 */


router.get('/:id', (req, res) => {
  
  const book = req.app.db.get("books").find({ id: req.params.id}).value()

  if (!book) {
    res.sendStatus(404)
  }

  res.send(book)

})


/**
 * @swagger
 * /books:
 *  post:
 *    summary: Create a new book
 *    tags: [Books]
 *    requestBody:
 *      required: true
 *      content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The book was created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      500:
 *        description: Error occurred
 */


router.post('/', (req, res) => {
  try{
     const book = {
      id: nanoid(idLen),
      ...req.body
     }

     req.app.db.get("books").push(book).write()
     res.status(200).send(book)
  } catch(err) {
    return res.status(500).send(err)
  }
})



/**
 * @swagger
 * /books/{id}:
 *  put:
 *    summary: Update a book details by id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of book to be updated
 *    requestBody:
 *      required: true
 *      content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      500:
 *        description: Unable to update book
 *      404:
 *      description: Error occured
 */



router.put('/:id', (req, res) => {


  // const book = req.app.db.get("books").find({ id: req.params.id}).value()

  // if (!book) {
  //   res.sendStatus(404)
  // }

  // res.send(book)


  try{
    
    
    req.app.db.get("books").find({ id: req.params.id}).assign(req.body).write()

    const book = req.app.db.get("books").find({ id: req.params.id}).value()



     
    res.send(book)
   
 } catch(err) {
   return res.status(500).send(err)
 }
})


/**
 * @swagger
 * /books/{id}:
 *  delete:
 *    summary: Remove a book by id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of book to be removed
 *    responses:
 *      200:
 *        description: The book was removed successfully
 *      500:
 *        description: Unable to remove the book
 */



router.delete('/:id', (req, res) => {

  req.app.db.get("books").remove({ id: req.params.id}).write()
  return res.sendStatus(200)
})


module.exports = router