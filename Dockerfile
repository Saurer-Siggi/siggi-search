# Use an official Python runtime as the base image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the backend code to the working directory
COPY . .

# Expose the port on which the backend app will run
EXPOSE 8000

# Run the backend app using Uvicorn
CMD ["fastapi", "run", "main.py", "--port", "8000"]