# OSI Inventory — Production Frontend

## 1. Configure Supabase
Edit `js/config.js` and put your Supabase project URL and publishable/anon key there.

## 2. Database
Run the SQL schema/policies supplied for this project in Supabase SQL Editor before using the app.

## 3. Deploy
This is a static frontend. Put the folder in GitHub and deploy it on Render as a **Static Site**.
- Build command: leave empty
- Publish directory: `.`
- No Node server is required.

## 4. Important
Never put a Supabase service-role/secret key in `config.js`. Only the publishable/anon key belongs in browser code.

## Included
Authentication, dashboard, inventory CRUD, categories, borrowing requests, borrowing/returns, cash funds, finance ledger, reports, activity log, admin role management, profile editing and password changes.
