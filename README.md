🐦 Second Bird Website – COSC203 Assignment 2
This was my second web project, created during my second year of Software Engineering. It includes:

🖼️ A Vue.js frontend with Vue Router

🌐 A Node.js backend server

🗄️ A MySQL database running inside a Docker container

This was my first time using Docker, and it taught me how to manage and run services locally in a containerized environment.

🚀 How to Run the Project Locally
1. Clone the Repository
git clone https://github.com/FergusShort/Birds-Website-2.git
cd Birds-Website-2


3. Start the MySQL Container
Make sure Docker is running, then start the MySQL service:

docker compose up -d
This runs a MySQL container with:

Database: ASGN2
User: cosc203
Password: password
Port: 3306

Your SQL files should be in the ./sql/ folder:
source.sql (for creating tables)
populate.sql (for inserting initial data)


3. Start the App
From the root of the project, run:

npm install
npm run start
This will start both the server and frontend (depending on how your start script is configured). The app will be accessible at:

http://localhost:3000

✅ Notes
Docker must be running before starting the app.
The app uses Vue Router for navigation and communicates with the backend server via API calls.
Backend fetches data from the MySQL containerized database.

