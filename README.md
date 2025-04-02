# Project Task Board

## Overview
Project Task Board is a personalized task management application that helps users manage multiple projects efficiently by allowing them to create tasks, track progress, and streamline their workflow.

## Features
- **Project Management**: Create, update, and delete projects.
- **Real-time Updates**: Get instant updates on task progress.
- **Dockerized Deployment**: Fully containerized setup with Docker and Docker Compose.

### Deployment & DevOps:
- Docker & Docker Compose

## Installation
### Prerequisites
- Docker & Docker Compose (If running with containers)

### Clone the Repository
```sh
 git clone https://github.com/RESTfulAyush/Project-task-board.git
 cd Project-task-board
```

### Running with Docker
```sh
 docker-compose up --build
```

## Docker Compose File Explanation
The `docker-compose.yml` file defines and configures services for the project.

### Services:
- **backend**:
  - Builds the backend service from the `./backend` directory.
  - Exposes port `9000` to be accessed from outside.
  - Connects to `project-task-network` for internal service communication.
  - Depends on `mongodb`, ensuring MongoDB starts before the backend.
  
- **frontend**:
  - Builds the frontend service from the `./frontend` directory.
  - Runs on port `3000`.
  - Uses `project-task-network` for internal communication.
  - Configured with `REACT_APP_API_URL` to communicate with the backend.
  
- **mongodb**:
  - Uses the `mongo:latest` Docker image.
  - Stores data in a named volume `mongo-data` to persist information.
  - Includes a health check to ensure MongoDB is ready before other services start.

### Networks:
- `project-task-network`: A custom bridge network for seamless service communication.

### Volumes:
- `mongo-data`: Persistent volume for MongoDB data storage.

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
