# Frontend – MyInterior-AI

This directory contains the **React.js** frontend for the AI Interior Designer project. The frontend provides an intuitive user interface for creating interior designs based on uploaded sketches and user-selected prompts.

---

## Key Components

### 1. `App.js`

This file is the entry point for the frontend:
- Configures **React Router** for navigation between the `StartScreen` and `MainScreen`.
- Ensures seamless transitions between components.

### 2. `StartScreen.js`

The landing page:
- Displays the **project logo**, a welcoming message, and a "Get Started" button.
- Uses **Framer Motion** for smooth animations during page transitions.
- Includes the **AnimatedGemini.js** background animation.

### 3. `MainScreen.js`

The primary interface for designing interiors:
- Allows users to:
  - Upload a **sketch image**.
  - Select **positive** and **negative prompts** (rooms, styles, colors, etc.).
  - View a **preview** of the uploaded sketch.
  - Generate and display the **designed interior**.
- Uses **React state hooks** to manage user input and loading states.
- Communicates with the backend via **Axios** to fetch generated designs.

### 4. `AnimatedGemini.js`

A visually appealing background:
- Creates **wave animations** using **SVGs** and **Framer Motion**.
- Adds an aesthetic touch to the `StartScreen`.

### 5. Stylesheets (`*.css`)

Contains styles for individual components:
- **App.css**: Global resets and base styles.
- **StartScreen.css**: Styles for the landing page.
- **MainScreen.css**: Layout and styling for the design interface.

---

## Environment Variables

Set the following in the frontend’s `.env` file (required for communication with the backend):

```
REACT_APP_BACKEND_URL=http://localhost:8000
```
---

## How It Works

1. **Landing Page**:
   - The user is greeted with a welcoming message and an animated background.
   - Clicking "Get Started" transitions to the main interface.

2. **Main Interface**:
   - Users upload a sketch, select prompts, and click "Generate Design."
   - The app sends a request to the backend for image generation.
   - The generated design is displayed alongside the original sketch.

3. **Example Workflow**:
   - Users can load a pre-configured example with predefined prompts and a sample sketch.

---

## Key Features

- **Responsive Design**: Works seamlessly across desktop and mobile screens.
- **Interactive Prompts**: Chips for selecting rooms, styles, and other properties.
- **Image Upload**: Resize and preview uploaded sketches.
- **Error Handling**: Displays meaningful error messages when backend calls fail.

---

## Deployment

### Build for Production

Run the following command:

```
npm run build
```

- Outputs a production-ready build in the `build/` directory.

### Deploy to Server

- Upload the contents of the `build/` directory to your web server.

---

## Example Request to Backend

When the user clicks "Generate Design," the following request is sent to the backend:

```
POST /api/generate
Content-Type: multipart/form-data

{
  positivePrompt: "Scandinavian style, white, natural light",
  negativePrompt: "blurry, cartoon, sketch",
  image: <uploaded sketch file>
}
```

---

## Technologies Used

- **React.js**: Component-based frontend framework.
- **Framer Motion**: Smooth animations and transitions.
- **Axios**: HTTP client for API calls.
- **CSS3**: Styling for responsive and interactive UI.

---

## Notes & Recommendations

- **Environment Variables**: Use `.env` to configure backend URLs for different environments.
- **Responsive Layout**: Ensure a consistent experience on all screen sizes.
- **Error Logging**: Enhance debugging by logging errors from the backend.
