#!/usr/bin/env python
import os
import sys
import django
from django.core.management import call_command

# Configurer l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.base')
django.setup()

def run_migrations():
    print("Applying migrations...")
    call_command('makemigrations', 'exam_scheduler')
    call_command('migrate')

def create_superuser():
    from django.contrib.auth.models import User

    # Vérifier si un superutilisateur existe déjà
    if not User.objects.filter(is_superuser=True).exists():
        print("Creating superuser...")
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        print("Superuser created.")

def run_server():
    print("Starting Django development server...")
    call_command('runserver', '0.0.0.0:8000')

if __name__ == '__main__':
    run_migrations()
    create_superuser()
    run_server()