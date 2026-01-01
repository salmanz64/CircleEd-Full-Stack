@echo off
echo Setting up CircleEd Backend...

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo Please update .env with your database URL
)

REM Initialize database
echo Initializing database...
python -m app.db.init_db

REM Seed database
echo Seeding database...
python -m app.db.seed

echo Setup complete! Run 'python run.py' to start the server.
pause




