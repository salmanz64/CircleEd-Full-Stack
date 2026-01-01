#!/bin/bash

echo "Setting up CircleEd Backend..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please update .env with your database URL"
fi

# Initialize database
echo "Initializing database..."
python -m app.db.init_db

# Seed database
echo "Seeding database..."
python -m app.db.seed

echo "Setup complete! Run 'python run.py' to start the server."




