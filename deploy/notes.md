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
