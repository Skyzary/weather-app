# 🌤️ Weather App

This is a modern weather application that provides real-time weather information for any city. The application is built with a focus on a clean, intuitive user interface and a robust, scalable architecture.

## 📸 Screenshots

![Weather App Screenshot](https://i.imgur.com/O93lNQT.jpeg)

## 🚀 Live Demo

You can view a live demo of the application hosted on Vercel:  
[https://weather-app-nine-bay-52.vercel.app/](https://weather-app-nine-bay-52.vercel.app/)

## ✨ Features

* **Current Weather:** Get the current temperature, humidity, wind speed, and weather conditions for any city.
* **Dynamic Backgrounds:** Beautiful images synced with the weather thanks to Unsplash API.
* **Search:** Easily search for any city in the world.
* **Responsive Design:** The application is fully responsive and works on all devices.
* **Modern UI:** A beautiful interface featuring glow effects and circular progress indicators.

---

## 🛠️ Tech Stack

The application is built using the following technologies:
Technology | Description |
| :--- | :--- |
| <img src="https://skillicons.dev/icons?i=react" width="20"> **React** | A JavaScript library for building user interfaces. |
| <img src="https://skillicons.dev/icons?i=vite" width="20"> **Vite** | Next-generation frontend tooling for a faster development experience. |
| <img src="https://skillicons.dev/icons?i=ts" width="20"> **TypeScript** | A typed superset of JavaScript that compiles to plain JavaScript. |
| <img src="https://raw.githubusercontent.com/pmndrs/zustand/main/docs/favicon.ico" width="18"> **Zustand** | A small, fast, and scalable state-management solution for React. |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg" width="20"> **ESLint** | A pluggable linter tool for identifying patterns in JavaScript. |
| 🧩 **Libraries** | **Axios**, **React Icons**, **React-glow**, **React Circular Progressbar** |

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### 1. Prerequisites

* **Node.js** (v18 or higher)
* **npm**

### 2. API Setup

This application requires two API keys to function fully:

* **OpenWeatherMap API** (Weather data):
    1.  Go to [OpenWeatherMap](https://openweathermap.org/api) and create an account.
    2.  Generate a new key in your dashboard (activation may take up to 2 hours).
* **Unsplash API** (Background images):
    1.  Go to the [Unsplash Developers portal](https://unsplash.com/developers).
    2.  Register as a developer and create a **New Application**.
    3.  Copy your **Access Key** from the dashboard.

### 3. Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/your_username/weather-app.git](https://github.com/your_username/weather-app.git)
    cd weather-app
    ```

2.  **Set up environment variables** Create a `.env` file in the root directory and add your keys:
    ```env
    VITE_WEATHER_API_KEY=your_weather_key_here
    VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key_here
    ```

3.  **Install NPM packages**
    ```sh
    npm install
    ```

4.  **Start the development server**
    ```sh
    npm run dev
    ```

---

## 📜 Available Scripts

In the project directory, you can run:

* `npm run dev`: Runs the app in development mode.
* `npm run build`: Builds the app for production.
* `npm run lint`: Lints the project files.
* `npm run preview`: Serves the production build locally.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
