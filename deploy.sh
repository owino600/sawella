#!/bin/bash

# Update system
echo "Updating system..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Nginx and Certbot
echo "Installing Nginx and Certbot..."
sudo apt-get install nginx -y
sudo apt-get install certbot python3-certbot-nginx -y

# Create website directory
echo "Creating website directory..."
sudo mkdir -p /var/www/sawela
sudo mkdir -p /var/www/sawela/static
sudo mkdir -p /var/www/sawela/backend

# Copy website files
echo "Copying website files..."
sudo cp -r static/* /var/www/sawela/static/

# Set proper permissions
echo "Setting permissions..."
sudo chown -R www-data:www-data /var/www/sawela
sudo chmod -R 755 /var/www/sawela

# Copy Nginx configuration
echo "Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/sawelalodges.com
sudo ln -s /etc/nginx/sites-available/sawelalodges.com /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# Restart Nginx
echo "Restarting Nginx..."
sudo systemctl restart nginx

# Get SSL certificate
echo "Setting up SSL certificate..."
sudo certbot --nginx -d sawelalodges.com -d www.sawelalodges.com --non-interactive --agree-tos --email your-email@example.com

# Configure firewall
echo "Configuring firewall..."
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp  # Allow HTTPS
sudo ufw allow 22/tcp
sudo ufw enable

echo "Deployment completed successfully!"
echo "Your website should now be accessible at:"
echo "https://192.168.1.239"
echo "https://sawelalodges.com"
echo "https://www.sawelalodges.com" 