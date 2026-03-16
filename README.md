# Smart Grocery Tracker
_T197 Capstone Project for George Brown College_
##### Group Members:
- 101496645 Kamel Baalbaki 
- 101499536 Libareo Barbour 
- 101498572 Thomas del Mundo 
- 101514070 Ellie Adhikari

## Summary
The purpose of this capstone project is to design and develop a full-stack web application that helps users manage and monitor their household food inventory more effectively.

The primary objective of the application is to reduce food waste and its environmental impact while helping individuals make more informed purchasing decisions. By allowing users to track available food items, monitor stock levels, and maintain an organized inventory, the system encourages responsible consumption and reduces the likelihood of unused or expired food.

## Features
The Grocery Tracker application provides the following key features:

__User Management__
- User Registration & Login: Secure authentication using JWT tokens and password hashing with bcrypt.
- Profile Management: View, update, or delete your account.
- Logout: Stateless logout to protect user sessions.

__Inventory Management__
- Food Inventory Tracking: Add, edit, and remove items from your inventory.
- Expiration Alerts: Monitor expiry dates to prevent food waste.
- Quantity Management: Keep track of remaining stock to avoid over-purchasing.

__Notifications__
- Email Alerts: Receive notifications for low stock or expiring items (via nodemailer).

__Full-Stack Architecture__
- Frontend: Built with React for responsive user interface and real-time updates.
- Backend: Node.js with Express for API endpoints and business logic.
- Database: MongoDB with Mongoose for efficient data storage and querying.
- Security: JWT authentication, input validation, and password hashing.
- Microservice-Ready: Designed with separate services (e.g., user-service, notification-service) for scalability.
  
## Technologies Used
This project was built using a full-stack JavaScript architecture and the following technologies:

__Frontend__
- React.js
- React Router
- Vite
- CSS3

__Backend__
- Node.js
- Express.js
- Redis + Insight

__Database__
- MongoDB
- Mongoose

__Authentication & Security__
- JSON Web Tokens (JWT)
- Bcryptjs

__Development Tools__
- Docker
- Postman
- Git
- Node Package Manager _`npm`_

## Key Backend Dependencies
* express – Backend web framework
* mongoose – MongoDB object modeling
* bcryptjs – Password hashing
* jsonwebtoken – Authentication tokens
* dotenv – Environment variable management
* cors – Cross-origin request handling
* nodemailer - Email notifications

_*This project uses a .env file to store sensitive configuration values such as API keys, authentication secrets, and service credentials. For security and privacy reasons, the .env file is not included in the GitHub repository and is listed in `.gitignore`._

# Setup Installation
### 1. Clone Repository
```
git clone https://github.com/KamelBaalbaki/grocery-tracker-system
```
Enter the project folder.

### 2. Install Dependencies
Each service (e.g., user-service, notification-service, frontend) has its own dependencies. Navigate to each folder and run:
```
npm install
```

### 3. Create Environment Variables
Create a .env file in each service that requires it and add the necessary keys. Example:
```
# user-service/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/grocery-tracker
JWT_SECRET=your_jwt_secret
```
```
# notification-service/.env
PORT=6000
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```
### 4. Run the Application
_*Make sure docker is already running._
```
docker compose up --build
```
This will start all services and their dependencies (like MongoDB) in containers.
