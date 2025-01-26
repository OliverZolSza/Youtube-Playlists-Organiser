FROM php:8.0-apache

WORKDIR /var/www/html

RUN mkdir -p playlists

RUN mkdir -p export

COPY . .

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
