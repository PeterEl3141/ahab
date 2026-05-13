# Ahab's Dream – Personal Writing & Articles

Ahab's Dream is a full-stack writing platform / blog where I publish articles across different categories (books, music, general writing) and manage content through an internal editor. It has a public-facing site for readers and an admin area for creating and editing articles.

---

## Demo

- Live site: https://www.ahabsdream.com/



---

## Tech Stack

**Frontend**

- React
- JavaScript
- CSS
- Axios for API calls
- GSAP (for hero / scroll-based animations)
- Draggable.js (for drag-and-drop editor interactions)

**Backend**

- Node.js
- Express
- Prisma ORM
- PostgreSQL

**Auth**

- JSON Web Tokens (JWT)
- bcrypt

---

## Features

### Public site

- **Landing page with animated hero**  
  A GSAP-powered hero section with a ship-in-a-storm animation tied to scroll, introducing the site.

- **Article browsing**  
  Browse articles by category (e.g. books, music, blog). Each article has its own page with structured content.

- **Article view page**  
  Clean reading layout for articles, rendering content blocks from the editor (headings, paragraphs, images, etc.).

- **Comments**  
  Logged-in users can leave comments on articles.  

### Admin / editor

- **Authentication**  
  Admin login using JWT-based auth.

- **Article management**  
  Create, edit, and publish/unpublish articles. Articles are stored in PostgreSQL via Prisma.

- **Custom editor with drag-and-drop**  
  Internal article editor that uses Draggable.js to move content blocks around, making it easy to reorder sections before publishing.

---

## Project Structure

- `/frontend` – React frontend (public site + admin views)
- `/backend` – Express + Node.js backend with Prisma and PostgreSQL

---

## Getting Started

### Prerequisites

- Node.js (version X.Y.Z or higher)
- PostgreSQL running locally or in the cloud

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ahabs-dream.git
cd ahabs-dream


### 2. Install dependenceis

cd backend
npm install

in a new terminal for '/frontend':
npm install


### 3. Environment Variables.

.env variables for backend:

DATABASE_URL
FRONTEND_URL
JWT_SECRET
MAIL_FROM
RESEND_API_KEY


and .env variables for the frontend:

VITE_API_URL



### 4. Database Setup

cd backend
npx prisma migrate dev
npx prisma db seed

### 5. Starting the App

(in both frontend and backend terminals): npm run dev



## What I Learned

Using GSAP for scroll based animations in a react project.
Building a drag and drop editor using Draggable.js (this was a very steep learning curve).
Managing authentication and protected routes with JWT
