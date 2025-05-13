# 🐦 Second Bird Website – COSC203 Assignment 2

This was my second web project, created during my second year of Software Engineering. It includes:

- 🖼️ A frontend built using templating **views** (not Vue.js)
- 🌐 A Node.js backend server
- 🗄️ A MySQL database running inside a Docker container

This was my first time using Docker, and it taught me how to manage and run services locally in a containerized environment.

---

## 🚀 How to Run the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/FergusShort/Birds-Website-2.git
cd Birds-Website-2
```

### 2. Start the MySQL Container (via Docker)
Make sure Docker is installed and running on your machine. Then start the MySQL service:

docker compose up -d
This runs a MySQL container with the following configuration:

Database: ASGN2
User: cosc203
Password: password
Port: 3306


Your SQL files should be located in the ./sql/ folder:

source.sql – for creating the database tables
populate.sql – for inserting the initial data

You can run these SQL files using a MySQL client connected to the container.

### 3. Start the App
From the root of the project directory, install the dependencies and start the application:

npm install
npm run start
This will start both the backend server and frontend view rendering (depending on how your start script is configured).

Once running, you can access the app in your browser at:
http://localhost:3000


### ✅ Notes
Docker must be running before starting the application, as the MySQL database is containerized.
The app uses server-side rendering via templating views (e.g., EJS).
The backend is built with Node.js and fetches data from the MySQL container using SQL queries.
The frontend makes API calls to the backend for dynamic content loading.
If needed, you can stop the Docker container with:
docker compose down
