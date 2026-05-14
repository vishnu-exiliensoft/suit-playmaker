# Suit Customization Application

A React-based 3D suit customization application with Three.js integration. Features real-time 3D model rendering, interactive customization panels, and responsive design for suit jacket and trouser customization.

## Features

- **3D Model Rendering**: Real-time 3D suit visualization using Three.js and React Three Fiber
- **Interactive Customization**: Sidebar panels for customizing various suit components
- **Product Types**: Support for Two Piece Suit, Suit Jacket, and Suit Trouser
- **Customization Options**:
  - Button styles (1-6 buttons with different closing styles)
  - Lapel styles (Peak, Notch, Round, Shawl)
  - Jacket pockets (Straight, Slanted, Patched with ticket pockets)
  - Trouser pockets (Back and front pocket styles)
  - Beltloop styles (None, Single, Double, Modern)
  - Sleeve styles (Half, Full, French Round, French Angel)
  - Fabric selection for whole suit
- **Responsive Design**: Mobile-friendly interface with smooth animations
- **State Management**: Local storage persistence for user selections
- **Performance Monitoring**: Web Vitals integration for performance tracking

## Technology Stack

- **Frontend**: React 19, React Three Fiber, Three.js
- **Styling**: CSS3 with animations and responsive design
- **State Management**: React Hooks with localStorage persistence
- **API**: Axios for HTTP requests
- **Animation**: GSAP for smooth transitions
- **Testing**: Jest and React Testing Library

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Project Structure

```
src/
├── components/           # React components
│   ├── beltloop/         # Beltloop customization
│   ├── button/           # Button style options
│   ├── collar/           # Collar options
│   ├── fabric/           # Fabric selection
│   ├── jacketPocket/     # Jacket pocket styles
│   ├── lapel/            # Lapel styles
│   ├── pocket/           # Trouser pocket styles
│   ├── product/          # Product type selection
│   ├── shirtback/        # Shirt back styles
│   └── sleeve/           # Sleeve styles
├── api/                  # API configuration
├── App.js               # Main application component
├── App.css              # Main application styles
├── Sidebar.js           # Sidebar navigation
├── index.js             # Application entry point
└── index.css            # Global styles
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
