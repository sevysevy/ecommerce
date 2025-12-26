# Simple E-commerce Shopping Cart

A small Laravel + React e-commerce project with cart management, low stock notifications, and daily sales reports.

## Tech Stack

- **Backend:** Laravel 12  
- **Frontend:** React + Inertia.js  
- **Styling:** Tailwind CSS  
- **Database:** MySQL / SQLite  
- **Queue:** Database queue  
- **Version Control:** Git / GitHub

## Features

- Browse products and add them to a cart  
- Update cart quantities and remove items  
- Cart linked to authenticated users  
- Checkout with stock validation and transactional safety  
- **Low Stock Notification:** Sends an email to admin when product stock is low  
- **Daily Sales Report:** Scheduled job runs every day at 00:00 to email admin a summary of yesterday’s sales

## Setup

1. Clone the repo  
2. Install dependencies:
   ```bash
   composer install
   npm install
   ```
3. Copy .env.example to .env and set database , mail settings and ADMIN_EMAIL 
4. Run migrations & seeders:
   ```bash
   php artisan migrate:fresh --seed
   ```
5. To run the project locally with all services (server, queue, scheduler, frontend) for quick testing run:
   ```bash
   composer run dev
   ```

in production server you might want to setup Laravel scheduler to run every mins on your crontab

```bash
* * * * * cd /path-to-cloned-project && php artisan schedule:run >> /dev/null 2>&1
```

## Dumy test user

login: test@example.com
password: password