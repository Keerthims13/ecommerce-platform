# Database Setup Guide for Signup

## Summary of Changes

Your signup page is now connected to the database! Here's what has been updated:

### 1. **Frontend Changes** (Signup.js)
- ✅ Replaced `axios` with the configured `api` service
- ✅ Updated `handleSignup()` to call the backend `/auth/register` endpoint
- ✅ Now sends: `name`, `email`, and `password` to the backend
- ✅ Stores the token and user data returned from the server

### 2. **Backend Configuration**
Your backend is already set up to handle signup:
- ✅ Express server running on `http://localhost:5000`
- ✅ Auth routes configured at `/api/auth/register`
- ✅ MySQL connection pool configured in `src/config/db.js`
- ✅ Register controller with password hashing (bcryptjs)
- ✅ JWT token generation for authentication

### 3. **Environment Variables**
Your `.env` file is configured with:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Varijams@24
DB_NAME=ecommerce_db
JWT_SECRET=abc@123
```

## Setup Steps

### Step 1: Create the Database
Run this SQL script in your MySQL client (MySQL Workbench, PHPMyAdmin, etc.):

```bash
# Using MySQL Command Line
mysql -u root -p < database_schema.sql
```

Or copy the contents of `database_schema.sql` and execute in your MySQL GUI.

**What it creates:**
- Database: `accolade_ecommerce`
- Table: `users` (with name, email, password, role fields)

### Step 2: Verify Your Database Credentials
Make sure your MySQL is running and the credentials in `.env` are correct:
- **Host:** localhost
- **User:** root
- **Password:** Varijams@24
- **Database:** accolade_ecommerce (will be created by the script)

### Step 3: Start the Backend Server
```bash
cd backend
npm install  # Install dependencies if not done
npm run dev  # Or: node server.js
```

You should see: `✅ MySQL connected successfully`

### Step 4: Start the Frontend
```bash
cd frontend
npm install  # Install dependencies if not done
npm start
```

### Step 5: Test Signup
1. Navigate to the signup page
2. Fill in the form with:
   - Full Name
   - Email (must be unique)
   - Password (min 6 characters)
   - Confirm Password
   - Accept terms & conditions
3. Click "Create Account"

**Expected behavior:**
- ✅ New user stored in database
- ✅ Password hashed with bcryptjs
- ✅ Success message displayed
- ✅ Redirected to home page

## Troubleshooting

### Database Connection Error
**Error:** "ECONNREFUSED" or "Connection refused"
- ✅ Make sure MySQL is running
- ✅ Check DB credentials in `.env`
- ✅ Verify database exists

### Email Already Exists
**Error:** "Email already registered"
- ✅ This is expected if you're testing with the same email
- ✅ Use a different email address

### Password Hashing Error
**Error:** "bcryptjs not found"
- ✅ Run: `npm install` in the backend folder

### CORS Error
**Error:** "Access to XMLHttpRequest blocked by CORS"
- ✅ Your backend already has CORS enabled
- ✅ Make sure backend is running on `http://localhost:5000`

## Database Schema

### Users Table
```
id (INT, PRIMARY KEY, AUTO_INCREMENT)
name (VARCHAR 100, NOT NULL)
email (VARCHAR 100, NOT NULL, UNIQUE)
password (VARCHAR 255, NOT NULL) - hashed with bcryptjs
role (ENUM: 'user' or 'admin', DEFAULT: 'user')
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

## Next Steps

After signup is working, you can:
1. Update the Login page (uses same backend API)
2. Implement password reset functionality
3. Add user profile management
4. Create product database integration
5. Build shopping cart and orders system

---

**Note:** All API calls are now connected to your MySQL database. Your user data is being persisted!
