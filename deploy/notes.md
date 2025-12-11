# 📘 PaperDEX EC2 Deployment Guide (Manual NGINX + Dockerized Express Apps)

---

## ✅ Overview

This guide explains how to:

- Run two Express apps (`user-service` & `order-service`) in Docker
- Use NGINX manually installed on EC2 to reverse proxy requests
- Secure both services using Let's Encrypt SSL
- Expose them on:

  - `https://userService.paperdex.in`
  - `https://orderService.paperdex.in`

---

## 1. 🖥️ EC2 Setup

### ✅ Instance Type

- **Type:** `t2.small` or `t3.small`
- **OS:** Ubuntu 22.04
- **Ports Opened in Security Group:**

  - `22` (SSH)
  - `80` (HTTP)
  - `443` (HTTPS)

---

## 2. ⚙️ System Setup

### Install Docker & Docker Compose:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker  # or log out & back in
```

### Install NGINX:

```bash
sudo apt install -y nginx
```

---

## 3. 🐳 Run Express Apps in Docker

### 📁 Project Structure

```
~/paperdex/
├── .env
├── docker-compose.yml
```

### Example `docker-compose.yml`

```yaml
version: "3.8"

services:
  user-service:
    image: yourdockerhub/user-service
    container_name: user-service
    restart: always
    environment:
      # your envs here
    networks:
      - paperdex_network

  order-service:
    image: yourdockerhub/order-service
    container_name: order-service
    restart: always
    environment:
      # your envs here
    networks:
      - paperdex_network

networks:
  paperdex_network:
    driver: bridge
```

### Run:

```bash
cd ~/paperdex
docker-compose up -d
```

---

## 4. 🌐 DNS Setup

Go to your domain provider and add **A records**:

| Type | Name           | Value (Public IP of EC2) |
| ---- | -------------- | ------------------------ |
| A    | `userService`  | `43.205.191.57`          |
| A    | `orderService` | `43.205.191.57`          |

---

## 5. 🔐 Setup SSL with Certbot

### Install Certbot:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Obtain Certificates:

```bash
sudo certbot --nginx -d userService.paperdex.in -d orderService.paperdex.in
```

Follow prompts → when done, Certbot will auto-configure NGINX for HTTPS.

---

## 6. 🔧 NGINX Configuration (Optional Full Manual)

If you want to write your own config instead of Certbot auto-editing:

```bash
sudo nano /etc/nginx/sites-available/paperdex
```

Paste this:

```nginx
server {
  listen 80;
  server_name userService.paperdex.in orderService.paperdex.in;

  location /.well-known/acme-challenge/ {
    root /var/www/html;
  }

  location / {
    return 301 https://$host$request_uri;
  }
}

server {
  listen 443 ssl;
  server_name userService.paperdex.in;

  ssl_certificate /etc/letsencrypt/live/userService.paperdex.in/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/userService.paperdex.in/privkey.pem;

  location / {
    proxy_pass http://localhost:4001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}

server {
  listen 443 ssl;
  server_name orderService.paperdex.in;

  ssl_certificate /etc/letsencrypt/live/orderService.paperdex.in/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/orderService.paperdex.in/privkey.pem;

  location / {
    proxy_pass http://localhost:4002;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

Then link and reload:

```bash
sudo ln -s /etc/nginx/sites-available/paperdex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. 🔁 Auto Renew SSL

Certbot auto-renewal is installed via cron. You can manually test:

```bash
sudo certbot renew --dry-run
```

---

## ✅ Final URLs

- [https://userService.paperdex.in](https://userService.paperdex.in) → your user service
- [https://orderService.paperdex.in](https://orderService.paperdex.in) → your order service

---

---

# HTTP config

```bash
events {
    # Sets the maximum number of simultaneous connections that can be opened by a worker process.
    worker_connections 1024;
}

http {
    # Include standard mime types so browsers understand file formats
    include       mime.types;
    default_type  application/octet-stream;

    # Optimization: sendfile is usually good to have on
    sendfile        on;

    # SERVER 1: User Service
    server {
        listen 80;
        server_name user-service.paperdex.in;

        location / {
            proxy_pass http://127.0.0.1:4001; # Use 127.0.0.1 instead of localhost for reliability
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    # SERVER 2: Order Service
    server {
        listen 80;
        server_name order-service.paperdex.in;

        location / {
            proxy_pass http://127.0.0.1:4002;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

# HTTPS config

```bash
events {
    # Sets the maximum number of simultaneous connections that can be opened by a worker process.
    worker_connections 1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;

    # ------------------------------------------------------------
    # WEBSOCKET SUPPORT: Map block required for connection upgrades
    # ------------------------------------------------------------
    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }

    # SERVER 1: User Service (No changes needed here usually, unless it also has WS)
    server {
        server_name user-service.paperdex.in;

        location / {
            proxy_pass http://127.0.0.1:4001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        listen 443 ssl;
        ssl_certificate /etc/letsencrypt/live/user-service.paperdex.in/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/user-service.paperdex.in/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    }

    # SERVER 2: Order Service (FIXED FOR WEBSOCKETS)
    server {
        server_name order-service.paperdex.in;

        location / {
            proxy_pass http://127.0.0.1:4002;

            # Standard Proxy Headers
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            # --- WEBSOCKET HEADERS START ---
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;

            # Prevent Nginx from killing the connection if idle for > 60s
            proxy_read_timeout 3600;
            proxy_send_timeout 3600;
            # --- WEBSOCKET HEADERS END ---
        }

        listen 443 ssl;
        # Note: Ensure this path points to the correct certificate for order-service!
        # You had it pointing to user-service in your snippet.
        ssl_certificate /etc/letsencrypt/live/user-service.paperdex.in/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/user-service.paperdex.in/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    }

    # HTTP Redirect Blocks (Keep these at the bottom)
    server {
        if ($host = user-service.paperdex.in) {
            return 301 https://$host$request_uri;
        }
        listen 80;
        server_name user-service.paperdex.in;
        return 404;
    }

    server {
        if ($host = order-service.paperdex.in) {
            return 301 https://$host$request_uri;
        }
        listen 80;
        server_name order-service.paperdex.in;
        return 404;
    }
}
```
