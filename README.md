NETTUNE – Movie App Backend

This is the backend for the NETTUNE Movie App, built with Node.js, Express.js, and MongoDB. It provides APIs to manage users, movies, and their favourites, as well as searching for movies.

Features

User Authentication: Register, login, and manage users.

Update User: Users can update their information.

Movie Management: Add and manage movies.

Search Movies: Search movies by title or keyword.

Favourites: Add movies to favourites (with duplicate prevention).

Technologies Used

Node.js

Express.js

MongoDB with Mongoose

JWT for authentication

bcrypt for password hashing

Getting Started

Clone the repository:

git clone <your-repository-link>


Install dependencies:

npm install


Create a .env file:

MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=5000


Start the development server:

npm run dev

API Endpoints
User

POST /api/users/register – Register a new user

POST /api/users/login – Login user

PUT /api/users/update/:id – Update user data

Movies

GET /api/movies – Get all movies

POST /api/movies – Add a movie

GET /api/movies/search?q=keyword – Search movies

Favourites

POST /api/favourites – Add a movie to favourites

GET /api/favourites/:userID – Get user favourites

License

This project is licensed under the MIT License.
