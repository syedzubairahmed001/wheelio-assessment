## Getting Started

This guide will help you set up the project on your local machine for development and testing purposes.

#### App walk through
[Watch a quick loom of the app working demo here (~3mins)](https://www.loom.com/share/a33309d477fc4dfdb4634b25bdce7e57?sid=364947d5-a48a-4c60-9143-34488ab18b40)

### Front End Setup:

To get the front end running, follow these steps:

1. Install all the necessary dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

### Backend Setup:

Setting up the backend involves creating a virtual environment and running the server.

1. **Create and activate a virtual environment:**

   - Install `virtualenv` if it's not already installed:
   ```bash
   pip install virtualenv
   ```

   - Create a virtual environment. Replace `<version>` with your Python version (e.g., `python3.8`):

   ```bash
   python<version> -m venv env
   ```

   - Activate the virtual environment:

   ```bash
   source env/bin/activate
   ```

2. **Run the backend application:**

   - Set the MongoDB URL environment variable (replace `<your-string-here>` with your MongoDB connection string):
   ```bash
   export MONGODB_URL="<your-string-here>"
   ```

   - Start the Uvicorn server with live reloading:
   ```bash
   uvicorn app:app --reload
   ```
