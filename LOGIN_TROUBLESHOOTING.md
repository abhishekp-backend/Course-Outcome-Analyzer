# 🔐 Login Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: "Invalid credentials" Error

**Possible Causes:**
1. User account doesn't exist in database
2. Password doesn't match
3. Email case sensitivity
4. Database was reset/cleared

**Solutions:**

#### Check if User Exists
1. **Create a new account** to verify registration works
2. If registration works but login doesn't, the user might not exist

#### Verify Email Format
- Make sure you're using the **exact same email** you registered with
- Email is case-insensitive, but double-check for typos
- Example: `test@example.com` (not `Test@Example.com`)

#### Verify Password
- Make sure you're using the **exact same password** you registered with
- Check for:
  - Extra spaces before/after
  - Caps Lock enabled
  - Special characters typed correctly

### Issue 2: Database Connection Issues

**Check MongoDB:**
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# If not running, start it:
Start-Service MongoDB
```

**Check Backend Logs:**
- Look at the terminal where backend is running
- Check for MongoDB connection errors
- Look for "MongoDB Connected" message

### Issue 3: User Data Not Persisting

**Possible Causes:**
1. MongoDB database was reset
2. Using in-memory database
3. Database connection string pointing to wrong database

**Solution:**
- Check `.env` file in Backend folder
- Verify `MONGODB_URI` is correct
- If using local MongoDB: `mongodb://localhost:27017/mern-auth`
- If using Atlas: Check your connection string

### Issue 4: Rate Limiting

**Symptom:** "Too many authentication attempts" error

**Solution:**
- Wait 15 minutes
- Or restart the backend server (resets rate limit)

---

## 🔍 Step-by-Step Debugging

### Step 1: Test Registration
1. Try creating a **new account** with:
   - Email: `test@example.com`
   - Username: `testuser123`
   - Password: `Test123` (must have uppercase, lowercase, and number)

2. If registration fails, check:
   - Backend server is running
   - MongoDB is running
   - Check browser console (F12) for errors

### Step 2: Test Login Immediately After Registration
1. After successful registration, try logging in
2. If this works, your credentials are correct
3. If this doesn't work, there's a login issue

### Step 3: Check Browser Console
1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Try to login
4. Look for error messages
5. Check **Network** tab for API response

### Step 4: Check Backend Logs
1. Look at the terminal where backend is running
2. Check for:
   - "Login successful" or "Login failed" messages
   - MongoDB connection errors
   - Any error messages

---

## 🧪 Quick Test

### Test Login API Directly

Open PowerShell and run:
```powershell
# Replace with your actual email and password
$body = @{
    email = "your-email@example.com"
    password = "YourPassword123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
```

**Expected Response:**
- Success: `{"token":"...","user":{...}}`
- Error: `{"success":false,"message":"Invalid credentials"}`

---

## ✅ Quick Fixes

### Fix 1: Create New Account
If you can't remember your credentials:
1. Go to signup page
2. Create a new account
3. Use that to login

### Fix 2: Reset Database (Development Only)
⚠️ **Warning:** This will delete all data!

```powershell
# Connect to MongoDB
mongosh mongodb://localhost:27017/mern-auth

# Delete all users (in MongoDB shell)
db.users.deleteMany({})

# Exit
exit
```

Then create a new account.

### Fix 3: Check Environment Variables
Make sure `.env` file exists in Backend folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-auth
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

---

## 📋 Checklist

- [ ] Backend server is running (port 5000)
- [ ] MongoDB is running
- [ ] `.env` file exists in Backend folder
- [ ] Using correct email (exact match)
- [ ] Using correct password (exact match)
- [ ] No rate limiting errors
- [ ] Browser console shows no errors
- [ ] Backend logs show no errors

---

## 🆘 Still Not Working?

1. **Check Browser Console:**
   - Press F12
   - Look at Console and Network tabs
   - Share any error messages

2. **Check Backend Terminal:**
   - Look for error messages
   - Check if MongoDB connection is successful

3. **Try Creating New Account:**
   - Use a different email
   - Make sure password meets requirements:
     - At least 6 characters
     - At least one uppercase letter
     - At least one lowercase letter
     - At least one number

4. **Verify MongoDB:**
   - Check if MongoDB service is running
   - Try connecting to MongoDB manually

---

**If you're still having issues, share:**
- The exact error message you see
- Browser console errors (F12 → Console)
- Backend terminal output
- Whether you can create a new account successfully

