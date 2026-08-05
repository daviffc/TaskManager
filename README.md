# Task Manager

## Overview

Task Manager is a full-stack web application designed to simplify task organization and productivity. The project is being developed using modern web technologies, following good software engineering practices and a scalable architecture.

Its goal is to provide users with an intuitive interface to create, organize, edit, and track daily tasks efficiently.

---

## Technologies

### Frontend

- React
- Next.js
- TypeScript
- Tailwind CSS
- HTML5

### Backend

- Node.js
- TypeScript

### Database

- PostgreSQL

### DevOps

- Docker
- Docker Compose

---

## Planned Features

- User authentication
- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- Task filtering
- Responsive interface
- Persistent data storage
- Secure API communication

---

## Architecture

The project follows a modern full-stack architecture:

```text
Frontend (Next.js + React)
            │
            ▼
 REST API (Node.js + TypeScript)
            │
            ▼
     PostgreSQL Database
```

The application is designed to separate concerns between presentation, business logic, and data persistence, making future maintenance and scalability easier.

---

## Project Structure

```text
task-manager-app/

├── app/
├── components/
├── services/
├── hooks/
├── lib/
├── public/
├── styles/
├── docker/
├── prisma/
└── ...
```

> The structure may evolve as new features are implemented.

---

## Prerequisites

Before running the project, make sure you have installed:

- Node.js 20+
- npm or yarn
- Docker
- Docker Compose
- PostgreSQL (optional if using Docker)

---

## Installation

Clone the repository:

```bash
git clone https://github.com/daviffc/TaskManager.git
```

Navigate to the project folder:

```bash
cd TaskManager/task-manager-app
```

Install dependencies:

```bash
npm install
```

---

## Running the Project

Start the development server:

```bash
npm run dev
```

If using Docker:

```bash
docker compose up --build
```

The application will be available at:

```
http://localhost:3000
```

---

## Concepts Applied

- TypeScript
- React
- Next.js
- Component-Based Architecture
- Responsive Design
- REST API
- PostgreSQL
- Docker
- Clean Code
- Separation of Concerns

---

## Future Improvements

- Task categories
- Priority levels
- Due dates
- Dark mode
- Search and filters
- Notifications
- Team collaboration
- Unit and integration testing
- CI/CD pipeline

---

## Author

Developed by **Davi Ferreira Coelho** as part of my learning journey in Full-Stack Development, focusing on modern web technologies, scalable architecture, and clean software design.

GitHub:
https://github.com/daviffc

---

## License

This project is open-source and intended for educational purposes. Feel free to study, modify, and improve it.
