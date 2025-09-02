# NETTUNE Backend

## Overview

This is the backend for the **NETTUNE Movie App**, built with **Node.js**, **Express.js**, and **MongoDB**.  
It provides RESTful APIs to manage users, movies, favourites, and supports automated movie scraping.
This backend service powers Nettune, a platform that automatically scrapes movies, stores their metadata 
(title, description, genres, ratings, images, and video URLs), and exposes them through a RESTful API.

## Features

### Automated Web Scraping
- **Cheerio** for fast static page scraping.
- **Puppeteer** for dynamic page rendering & video extraction.
- **p-limit** for concurrency control and efficient scraping.

### Movie Database
- Stores titles, genres, descriptions, ratings, poster images, and playable video links.
- Scraped movies are saved directly into MongoDB using **Mongoose**.

### REST API
- Fetch, search, and manage movies.
- Add/remove favourites (with duplicate prevention).
- Manage user accounts and authentication.

## Tech Stack

- **Node.js** – Backend runtime
- **Express.js** – RESTful API framework
- **MongoDB with Mongoose** – Database
- **JWT (JSON Web Token)** – Authentication
- **Cheerio** – HTML parsing
- **Puppeteer** – Browser automation
- **Axios** – HTTP requests
- **p-limit** – Concurrency management

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/nettune-backend.git
    ```

2. **Navigate to the project directory:**
    ```bash
    cd nettune-backend
    ```

3. **Install dependencies:**
    ```bash
    npm install
    ```

4. **Create a `.env` file in the root directory with:**
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

5. **Start the server:**
    ```bash
    npm run dev   # for development
    npm start     # for production
    ```

## API Endpoints

### User
- **POST** `/api/users/register` – Register a new user
- **POST** `/api/users/login` – Login user
- **PUT** `/api/users/update/:id` – Update user details

### Movies
- **GET** `/api/movies` – Get all movies
- **POST** `/api/movies` – Add a movie (Admin)
- **GET** `/api/movies/search?q=keyword` – Search movies by title/keyword

### Favourites
- **POST** `/api/favourites` – Add movie to favourites
- **GET** `/api/favourites/:userID` – Get user favourites
- **DELETE** `/api/favourites/:movieID` – Remove movie from favourites

## Contributing

Contributions are welcome!  
- Fork the repository  
- Create a feature branch  
- Submit a pull request  

## License

This project is licensed under the **MIT License**.
