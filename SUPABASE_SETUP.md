# 🚀 Supabase Setup Guide for Crew Lounge

This guide walks you through connecting Crew Lounge to Supabase for persistent data storage.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Project name**: `crew-lounge`
   - **Database password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** and wait ~2 minutes

## Step 2: Get Your Database Connection String

1. In Supabase Dashboard, go to **Settings** (gear icon)
2. Click **Database** in the sidebar
3. Scroll to **Connection string** section
4. Select **URI** tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your database password from Step 1

## Step 3: Configure Your Environment

1. Create the environment file:

   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

2. Edit `apps/api/.env` and paste your connection string:
   ```env
   DATABASE_URL=postgresql://postgres:YourActualPassword@db.abcd1234.supabase.co:5432/postgres
   NODE_ENV=development
   PORT=3001
   JWT_SECRET=your-secret-key
   ```

## Step 4: Start the Backend

```bash
# Install dependencies (if not done)
npm install

# Start the API server
npm run dev:api
```

The API will:

- Connect to Supabase
- Auto-create tables (via TypeORM synchronize)
- Start listening on `http://localhost:3001`

## Step 5: Verify Connection

1. Check the terminal for successful connection message
2. In Supabase Dashboard, go to **Table Editor**
3. You should see tables created: `user`, `playbook`, `poi`, `product`, etc.

## 🎉 Done!

Your Crew Lounge app is now connected to Supabase. Data will persist across sessions and can be accessed from anywhere.

---

## Troubleshooting

### "SSL connection is required"

The database config already includes SSL. Make sure you're using `DATABASE_URL`.

### "Password authentication failed"

Double-check your password in the connection string. Special characters may need URL encoding.

### "Connection refused"

1. Check your Supabase project is active (Dashboard should work)
2. Verify the connection string is correct
3. Ensure no firewall blocking port 5432

---

## Next Steps

- [ ] Set up Supabase Auth for user authentication
- [ ] Add Row Level Security (RLS) policies
- [ ] Set up database backups (Supabase Pro)
