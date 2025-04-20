

# ShopSphere

An e-commerce platform for managing products, user authentication, and shopping cart functionality. Built using **Node.js**, **Express.js**, **MongoDB**, and **JWT** for authentication, with a modern and responsive UI using **Tailwind CSS**.

## ✨ Features

- **Secure User Authentication:** Users can sign up, log in, and securely manage their sessions with JWT tokens and bcrypt for password hashing.
- **Email Verification:** Users must verify their email address during registration through DNS lookups to ensure validity.
- **Admin CRUD Operations:** Admins can create, read, update, and delete products, while regular users can view products and make purchases.
- **Dynamic Cart System:** Users can add, update, or remove items in the cart in real-time.
- **Role-based Access Control (RBAC):** Only admins have access to product management and other sensitive areas.

## 🔧 Tech Stack

- **Frontend:** Tailwind CSS for styling, EJS for server-side rendering
- **Backend:** Node.js, Express.js
- **Authentication:** JWT tokens for session management, bcrypt for password hashing
- **Database:** MongoDB (via Mongoose)
- **Email Verification:** DNS lookups during user registration
- **Security:** Password encryption, email validation

---

## 🚀 Getting Started

Follow the steps below to run the app locally.

### 1. Clone the Repository

```bash
git clone https://github.com/shelby-garrison/ShopSphere.git
cd ShopSphere
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following:

```env
JWT_KEY=your_jwt_key
NODE_ENV=your_node_env
EXPRESS_SESSION_SECRET=your_express_session_secret
BASE_URL=http://localhost:3000
PORT=3000
MONGODB_URI= your_mongodb_uri
```

### 4. Set Up the Database

This app uses MongoDB with Mongoose to store user and product data. To get started:

Run MongoDB locally using MongoDB Compass or through the MongoDB command-line tools. If you prefer a GUI, MongoDB Compass is a good option for managing your local MongoDB instance.

OR connect to a cloud instance using MongoDB Atlas, which provides a fully managed cloud database service for MongoDB. You'll need to create a MongoDB Atlas account and set up a cluster, then update the connection string in your .env file.



---

### 5. Start the App

```bash
node app.js
```

The app will run at [http://localhost:3000](http://localhost:3000).

---

## 🛡 Security Notes

- **JWT Authentication:** Used for managing user sessions. Tokens are issued during login and must be passed in subsequent requests.
- **Password Hashing:** Passwords are hashed using **bcrypt** before storage to ensure security.
- **Email Validation:** During registration, a DNS lookup is performed to verify the validity of the user’s email address.
- **Role-based Access Control (RBAC):** Only users with admin privileges can manage products.

---

