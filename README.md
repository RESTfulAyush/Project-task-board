# Project Task Board

## Overview
Project Task Board is a personalized task management application built using the MERN stack (MongoDB, Express.js, React, and Node.js). This application helps users manage multiple projects efficiently by allowing them to create tasks, track progress, and streamline their workflow.

## Features
- **Project Management**: Create, update, and delete projects.
- **Task Updation with Drag and Drop**: Easily update task status by dragging and dropping tasks between different stages.
- **Dockerized Deployment**: Fully containerized setup with Docker and Docker Compose.

## Tech Stack
### Frontend:
- React.js
- Tailwind CSS

### Backend:
- Node.js
- Express.js
- MongoDB

### Deployment & DevOps:
- Docker & Docker Compose

## Installation
### Prerequisites
- Node.js (Latest LTS version recommended)
- MongoDB (Local or Cloud-based like MongoDB Atlas)
- Docker & Docker Compose (If running with containers)

### Clone the Repository
```sh
 git clone https://github.com/RESTfulAyush/Project-task-board.git
 cd Project-task-board
```

### Backend Setup
```sh
 cd backend
 npm install
 npm run dev  # Runs the server
```

### Frontend Setup
```sh
 cd frontend
 npm install
 npm run dev  # Runs the React frontend
```

### Running with Docker
```sh
 docker-compose up --build
```

## Project Structure
```
PROJECT-TASK-BOARD/
│── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── Dockerfile
│
│── frontend/
│   ├── public/
│   ├── src/
│   ├── tailwind.config.js
│   ├── Dockerfile
│
│── docker-compose.yml
│── .gitignore
```
