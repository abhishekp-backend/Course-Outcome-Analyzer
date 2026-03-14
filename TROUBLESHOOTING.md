# 🔧 Troubleshooting Guide - Preview Not Showing

## ✅ Current Status
- **Backend Server**: ✅ Running on http://localhost:5000
- **Frontend Server**: ✅ Running on http://localhost:5173
- **Backend API**: ✅ Responding (HTTP 200)
- **Frontend**: ✅ Responding (HTTP 200)

---

## 🚀 Quick Access

### Option 1: Direct Browser Access
1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Type in the address bar: `http://localhost:5173`
3. Press Enter

### Option 2: Test Backend First
1. Open: `http://localhost:5000/api/health`
2. You should see: `{"success":true,"message":"Server is running",...}`
3. If this works, backend is fine
4. Then try: `http://localhost:5173`

---

## 🔍 Common Issues & Solutions

### Issue 1: Blank Page / White Screen

**Possible Causes:**
- JavaScript errors in browser console
- React app not loading
- MongoDB connection issue

**Solutions:**
1. **Open Browser Developer Tools** (F12)
2. **Check Console Tab** for errors
3. **Check Network Tab** - look for failed requests (red)
4. **Try Hard Refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Issue 2: "Cannot GET /" or 404 Error

**Solution:**
- Make sure you're accessing `http://localhost:5173` (not port 5000)
- Frontend runs on port 5173
- Backend runs on port 5000

### Issue 3: MongoDB Connection Error

**Symptoms:**
- Backend might be running but API calls fail
- Console shows MongoDB connection errors

**Solutions:**
1. **Check if MongoDB is running:**
   ```powershell
   # Check MongoDB service
   Get-Service MongoDB
   ```

2. **Start MongoDB if needed:**
   ```powershell
   # Start MongoDB service
   Start-Service MongoDB
   ```

3. **Or use MongoDB Atlas** (cloud):
   - Update `.env` file with Atlas connection string
   - Format: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname`

### Issue 4: Port Already in Use

**Symptoms:**
- Server fails to start
- "Port 5000/5173 already in use" error

**Solutions:**
1. **Find process using port:**
   ```powershell
   netstat -ano | findstr :5000
   netstat -ano | findstr :5173
   ```

2. **Kill the process:**
   ```powershell
   taskkill /PID <process_id> /F
   ```

3. **Or change ports** in:
   - Backend: `.env` file (PORT=5000)
   - Frontend: `vite.config.js` (server.port)

### Issue 5: CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- API calls fail from frontend

**Solution:**
- Check `Backend/.env` file has:
  ```
  ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
  ```

### Issue 6: Page Loads But Shows Errors

**Check Browser Console:**
1. Press F12 to open Developer Tools
2. Go to **Console** tab
3. Look for red error messages
4. Common errors:
   - `Failed to fetch` → Backend not running or CORS issue
   - `Cannot read property...` → JavaScript error in code
   - `Network Error` → Backend connection issue

---

## 🧪 Step-by-Step Verification

### Step 1: Verify Backend
```powershell
# Test backend health endpoint
Invoke-WebRequest -Uri "http://localhost:5000/api/health"
```
**Expected:** JSON response with `"success": true`

### Step 2: Verify Frontend
```powershell
# Test frontend
Invoke-WebRequest -Uri "http://localhost:5173"
```
**Expected:** HTML content with React app

### Step 3: Check Browser
1. Open browser
2. Go to `http://localhost:5173`
3. Open Developer Tools (F12)
4. Check Console for errors
5. Check Network tab for failed requests

### Step 4: Verify MongoDB
```powershell
# Check if MongoDB is accessible
# If using local MongoDB:
mongosh mongodb://localhost:27017
```

---

## 🔄 Restart Servers

If nothing works, restart both servers:

### Stop All Node Processes:
```powershell
Get-Process node | Stop-Process -Force
```

### Start Backend:
```powershell
cd "C:\College Project\College Project\Backend"
npm run dev
```

### Start Frontend (in new terminal):
```powershell
cd "C:\College Project\College Project\CO - PO"
npm run dev
```

---

## 📋 Checklist

- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 5173)
- [ ] MongoDB is running (if using local)
- [ ] `.env` file exists in Backend folder
- [ ] No port conflicts
- [ ] Browser can access `http://localhost:5173`
- [ ] No errors in browser console (F12)
- [ ] Network requests are successful (check Network tab)

---

## 🆘 Still Not Working?

1. **Check Server Logs:**
   - Look at the terminal where you ran `npm run dev`
   - Check for error messages

2. **Check Browser Console:**
   - Press F12
   - Look at Console and Network tabs

3. **Verify File Structure:**
   - Ensure all files are in correct locations
   - Check `node_modules` are installed

4. **Try Different Browser:**
   - Sometimes browser cache causes issues
   - Try incognito/private mode

5. **Check Firewall:**
   - Windows Firewall might be blocking ports
   - Allow Node.js through firewall

---

## 📞 Quick Test Commands

```powershell
# Test backend
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:5173

# Check ports
netstat -ano | findstr ":5000 :5173"

# Check Node processes
Get-Process node
```

---

**If you're still having issues, share:**
1. Browser console errors (F12 → Console)
2. Server terminal output
3. What you see when accessing http://localhost:5173

