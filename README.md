# Smart Grocery Tracker
_T197 Capstone Project for George Brown College_
## Group Members:
- 101496645 Kamel Baalbaki 
- 101499536 Libareo Barbour 
- 101498572 Thomas del Mundo 
- 101514070 Ellie Adhikari

## Summary
The purpose of this capstone project is to design and develop a full-stack web application that helps users manage and monitor their household food inventory more effectively.

The primary objective of the application is to reduce food waste and its environmental impact while helping individuals make more informed purchasing decisions. By allowing users to track available food items, monitor stock levels, and maintain an organized inventory, the system encourages responsible consumption and reduces the likelihood of unused or expired food.

## Features
The Grocery Tracker application provides the following key features:

### User Management
- User Registration & Login: Secure authentication using JWT tokens and password hashing with bcrypt.
- Email Verification: Users must verify their emails in order to log in.
- Profile Management: View, update, or delete your account.
- Logout: Stateless logout to protect user sessions.

### Inventory Management
- Food Inventory Tracking: Add, edit, and remove items from your inventory.
- Expiration Alerts: Monitor expiry dates to prevent food waste.
- Quantity Management: Keep track of remaining stock to avoid over-purchasing.

### Notifications & Reminders
- Email Alerts: Receive notifications for low stock or expiring items (via nodemailer).

### Recipe Suggestions 
- Recipe API: Suggests a list of recipes based on the current inventory stock.

### Eco Insights
- Summary: Tracks user progress on food and money saved, wasted, etc., and suggested tips.


### Full-Stack Architecture
- Frontend: Built with React for responsive user interface and real-time updates.
- Backend: Node.js with Express for API endpoints and business logic.
- Database: MongoDB with Mongoose for efficient data storage and querying.
- Security: JWT authentication, input validation, and password hashing.
- Microservice-Ready: Designed with separate services (e.g., user-service, notification-service) for scalability.
  
## Technologies Used
This project was built using a full-stack JavaScript architecture and the following technologies:

### Frontend 
- React.js
- React Router
- Vite
- CSS3

### Backend
- [Node.js](https://nodejs.org/en)
- Express.js
- Redis + Insight

### Database
- [MongoDB](https://www.mongodb.com/)
- Mongoose

### Authentication & Security
- JSON Web Tokens (JWT)
- Bcryptjs

### Development Tools
- [Docker](https://www.docker.com/)
- [Postman](https://www.postman.com/)
- Git
- Node Package Manager _`npm`_

## Key Backend Dependencies
* __express__ – Backend web framework
* __mongoose__ – MongoDB object modeling
* __bcryptjs__ – Password hashing
* __jsonwebtoken__ – Authentication tokens
* __dotenv__ – Environment variable management
* __cors__ – Cross-origin request handling
* __nodemailer__ - Email notifications
> [!IMPORTANT]
> For security and privacy reasons, the `.env` file is not included in the GitHub repository and is listed in `.gitignore`.

# Setup Installation
## 1. Clone Repository
```
git clone https://github.com/KamelBaalbaki/grocery-tracker-system
```
Enter the project folder.

## 2. Install Dependencies
Each service (e.g., `user-service`, `notification-service`, frontend) has its own dependencies (`node_modules`). Navigate to each folder and install:

| Service | Install Command |
|---|---|
| `api-gateway` | `npm install cors dotenv express http-proxy-middleware jsonwebtoken` |
| `item-service` | `npm install cors dotenv express jsonwebtoken mongoose redis` |
| `notification-service` | `npm install cors dotenv express jsonwebtoken mongoose nodemailer redis socket.io` |
| `recipe-service` | `npm install axios cors dotenv express jsonwebtoken` |
| `reminder-service` | `npm install agenda cors dotenv express jsonwebtoken mongoose redis` |
| `user-service` | `npm install bcryptjs cors dotenv express express-validator jsonwebtoken mongoose nodemailer` |

> [!TIP]
> You may check the `package.json` file to find the necessary dependencies for each micro-service.

## 3. Create Environment Variables
Each service contains a `.env.example` file. Rename each one to `.env` and fill in your respective sensitive configuration.

| Service | Key Variables |
|---|---|
| `api-gateway` | `JWT_SECRET` |
| `item-service` | `MONGO_URI`, `JWT_SECRET` |
| `notification-service` | `MONGO_URI`, `GMAIL_EMAIL`, `GMAIL_PASSWORD`, `JWT_SECRET` |
| `recipe-service` | `SPOONACULAR_API_KEY` |
| `reminder-service` | `MONGO_URI`, `JWT_SECRET` |
| `user-service` | `MONGO_URI`, `JWT_SECRET` |

> [!IMPORTANT]
> `GMAIL_PASSWORD` should be a Gmail App Password, not your actual Gmail password. Generate one at Google Account → Security → 2-Step Verification → App Passwords.

> [!NOTE]
> The `.env` file is not included in the repository and is listed in `.gitignore` for security reasons.

## 4. Run the Application
> [!IMPORTANT]
> Make sure Docker Desktop is already running before executing the command below.

> [!NOTE]
> This project uses Redis as a caching layer. It is automatically started as a container via Docker Compose — no separate installation is required.


```
docker compose up --build
```
This will start all services and their dependencies in containers, including MongoDB and Redis.
