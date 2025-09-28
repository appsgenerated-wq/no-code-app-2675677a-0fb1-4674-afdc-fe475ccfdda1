# Newton's Lunar Journal

Welcome to Newton's Lunar Journal, a conceptual web application built entirely on the Manifest backend platform. This app serves as a demonstration of key Manifest features, including user authentication, data modeling, access policies, and file uploads.

## Overview

Imagine Isaac Newton on the moon, logging his groundbreaking observations. This application allows users to:

- **Register and Log In**: Create a user account or use the provided demo credentials.
- **Create Discoveries**: Log new scientific or philosophical discoveries with a title, content, category, and an optional photograph.
- **View Discoveries**: Browse a public feed of all discoveries made by users.
- **Manage Your Own Discoveries**: Users can delete their own entries.

## Features Demonstrated

- **Backend-as-a-Service**: The entire backend is defined in a single `manifest.yml` file.
- **Authentication**: Powered by Manifest's `authenticable: true` property on the User entity.
- **CRUD Operations**: The React frontend uses the `@mnfst/sdk` to create, read, and delete `Discovery` records.
- **File Uploads**: The `lunarPhoto` field demonstrates Manifest's built-in image handling, including automatic thumbnail generation.
- **Role-Based Access Control**: Policies in `manifest.yml` ensure that users can only modify or delete their own posts, while an admin has full access.

## Getting Started

### Prerequisites

- Node.js and npm (or yarn)

### Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

Start the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Demo & Admin Access

- **Demo User**: Click the 'Login as Demo User' button on the landing page.
  - **Email**: `user@manifest.build`
  - **Password**: `password`
- **Admin Panel**: A link to the auto-generated admin panel is available on the landing page and dashboard. You can log in to manage all data and users.
  - **Admin Email**: `admin@manifest.build`
  - **Admin Password**: `admin`
