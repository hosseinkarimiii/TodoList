# Todo List API

This project is a simple API for managing a Todo list, built using Node.js, Express.js, and MongoDB.

## Features

- User Authentication with JWT
- CRUD operations for managing Todos (Create, Read, Update, Delete)
- Input validation using `express-validator`
- Proper error handling
- Mongoose for MongoDB database interactions

## Prerequisites

- Node.js
- MongoDB

## API Endpoints

- `POST /users/register`: Register a new user
- `POST /users/login`: User login
- `GET /todos`: Get the Todo list (requires authentication)
- `POST /todos`: Create a new Todo (requires authentication)
- `PATCH /todos/:id`: Update a Todo (requires authentication)
- `DELETE /todos/:id`: Delete a Todo (requires authentication)

## Usage

To use the API, you must send the JWT token in the `Authorization` header of your requests.
