#!/bin/bash
# setup_env.sh
# Create virtual environment, activate it and install dependencies.

echo "Cleaning up root lockfile..."
rm -f package-lock.json

echo "Creating virtual environment 'venv'..."
python3 -m venv venv

echo "Installing requirements from requirements.txt..."
./venv/bin/pip install -r requirements.txt

echo "Done! You can now activate the environment in your fish shell with:"
echo "source venv/bin/activate.fish"
