# ShopSphere - Full-Stack E-Commerce Platform

ShopSphere is a full-stack e-commerce web application built using Java, Spring Boot, React, and MySQL. It provides a responsive shopping experience with product browsing, authentication, cart management, checkout, order tracking, and administration features.

## Features

### Customer Features
- User registration and login with JWT authentication
- Browse products and product categories
- Search, filter, and sort products
- View product details, images, and ratings
- Add products to cart and update quantities
- Checkout and place orders
- View order history and order status
- Submit product reviews

### Admin Features
- Admin authentication and protected dashboard
- Add, update, and manage products
- Manage product stock
- View customer orders
- Update order fulfillment status
- View store statistics

## Technology Stack

**Backend**
- Java 21
- Spring Boot 3.3.5
- Spring Security 6
- Spring Data JPA
- Hibernate
- JWT Authentication
- Maven

**Frontend**
- React 18
- Vite 5
- React Router DOM
- Context API
- Lucide React
- Responsive CSS

**Database**
- MySQL 8.0
- H2 Database for development and testing

## Project Structure

```text
ShopSphere-Ecommerce/
├── backend/
│   ├── .mvn/
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/shopsphere/
│           │   ├── common/
│           │   ├── config/
│           │   ├── controller/
│           │   ├── dto/
│           │   ├── model/
│           │   ├── repository/
│           │   ├── security/
│           │   └── service/
│           └── resources/
│               ├── application.yml
│               └── application-dev-h2.yml
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── styles/
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

Install the following:

- JDK 21
- Node.js and npm
- Git
- MySQL 8.0 (optional when using H2)

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd ShopSphere-Ecommerce
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual repository URL.

### 2. Configure the backend

Set these environment variables in PowerShell:

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/shopsphere_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="YOUR_MYSQL_PASSWORD"
$env:APP_JWT_SECRET="YOUR_SECURE_256_BIT_SECRET"
```

Use your own MySQL credentials and generate a secure JWT secret. Never commit real credentials to GitHub.

### 3. Run the backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend URL:

http://localhost:8080

### 4. Run the frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

http://localhost:5173

## Development Database (H2)

The project also includes an H2 in-memory database profile.

To run the backend with H2:

```powershell
cd backend
$env:APP_JWT_SECRET="YOUR_SECURE_256_BIT_SECRET"
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=dev-h2"
```

H2 Console:

http://localhost:8080/h2-console

JDBC URL: `jdbc:h2:mem:shopspheredb`

Username: `sa`

Password: Leave blank.

## Build and Verification

Backend:

```powershell
cd backend
.\mvnw.cmd clean test
```

Frontend:

```powershell
cd frontend
npm install
npm run build
```

## API Overview

The backend provides REST APIs under `/api/v1/`.

| Module | Endpoint |
|---|---|
| Authentication | `/api/v1/auth` |
| Products | `/api/v1/products` |
| Categories | `/api/v1/categories` |
| Cart | `/api/v1/cart` |
| Orders | `/api/v1/orders` |
| Reviews | `/api/v1/reviews` |
| Administration | `/api/v1/admin` |

Authentication-protected endpoints require a valid JWT token. Administrative endpoints require admin authorization.

## Payment Information

The checkout implementation supports mock payment methods such as Card, UPI, and Cash on Delivery. Mock payment functionality does not process real financial transactions.

## Security Notes

- Keep database passwords and JWT secrets outside source control.
- Never commit `.env` files or actual credentials.
- Change development demo credentials before deployment.
- Use HTTPS and production-grade security configuration when deploying.

## Project Status

The application has been launched locally, and the frontend production build has completed successfully. Core shopping workflows have also been manually tested.

## Future Improvements

- Automated backend and frontend tests
- Production deployment
- Real payment gateway integration
- Product image upload service
- Advanced analytics and reporting

---

**ShopSphere - Full-Stack E-Commerce Application**