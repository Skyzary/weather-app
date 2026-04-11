[English](README.md) | [Русский](README.ru.md) | [Українська](README.uk.md) | [Français](README.fr.md)

# 🌤️ Application Météo

Il s'agit d'une application météo moderne qui fournit des informations météorologiques en temps réel pour n'importe quelle ville. L'application est conçue avec une interface utilisateur épurée et intuitive, ainsi qu'une architecture robuste et évolutive.

## 📸 Captures d'écran

![Capture d'écran de l'application Météo](https://i.imgur.com/O93lNQT.jpeg)

## 🚀 Démo en ligne

Vous pouvez consulter une démo en direct de l'application hébergée sur Vercel :  
[https://weather-app-nine-bay-52.vercel.app/](https://weather-app-nine-bay-52.vercel.app/)

## ✨ Fonctionnalités

* **Météo actuelle :** Obtenez la température actuelle, l'humidité, la vitesse du vent et les conditions météorologiques pour n'importe quelle ville.
* **Arrière-plans dynamiques :** De superbes images synchronisées avec la météo grâce à l'API Unsplash.
* **Recherche :** Recherchez facilement n'importe quelle ville dans le monde.
* **Design responsive :** L'application s'adapte à tous les écrans et fonctionne sur tous les appareils.
* **Interface moderne :** Une interface attrayante avec des effets lumineux et des indicateurs de progression circulaires.
* **Internationalisation :** Supporte l'anglais, le français, le russe et l'ukrainien avec détection de géolocalisation.

---

## 🛠️ Stack Technologique

L'application est construite en utilisant les technologies suivantes :

| Technologie | Description |
| :--- | :--- |
| <img src="https://skillicons.dev/icons?i=react" width="20"> **React** | Une bibliothèque JavaScript pour créer des interfaces utilisateur. |
| <img src="https://skillicons.dev/icons?i=vite" width="20"> **Vite** | Un outil de développement frontend de nouvelle génération. |
| <img src="https://skillicons.dev/icons?i=ts" width="20"> **TypeScript** | Un sur-ensemble typé de JavaScript qui se compile en JavaScript classique. |
| <img src="https://raw.githubusercontent.com/pmndrs/zustand/main/docs/favicon.ico" width="18"> **Zustand** | Une solution de gestion d'état petite, rapide et évolutive pour React. |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg" width="20"> **ESLint** | Un outil d'analyse de code pour identifier des modèles dans JavaScript. |
| 🧩 **Bibliothèques** | **Axios**, **React Icons**, **React-glow**, **React Circular Progressbar**, **i18next** |

---

## ⚙️ Pour commencer

Pour obtenir une copie locale et la faire fonctionner, suivez ces étapes simples.

### 1. Prérequis

* **Node.js** (v18 ou supérieur)
* **npm**

### 2. Configuration de l'API

Cette application nécessite deux clés API pour fonctionner pleinement :

* **API OpenWeatherMap** (Données météo) :
    1.  Allez sur [OpenWeatherMap](https://openweathermap.org/api) et créez un compte.
    2.  Générez une nouvelle clé dans votre tableau de bord (l'activation peut prendre jusqu'à 2 heures).
* **API Unsplash** (Images d'arrière-plan) :
    1.  Allez sur le [Portail développeurs Unsplash](https://unsplash.com/developers).
    2.  Inscrivez-vous en tant que développeur et créez une **Nouvelle Application**.
    3.  Copiez votre **Access Key** depuis le tableau de bord.

### 3. Installation

1.  **Cloner le dépôt**
    ```sh
    git clone https://github.com/your_username/weather-app.git
    cd weather-app
    ```

2.  **Configurer les variables d'environnement** Créez un fichier `.env` à la racine et ajoutez vos clés :
    ```env
    VITE_WEATHER_API_KEY=votre_cle_meteo_ici
    VITE_UNSPLASH_ACCESS_KEY=votre_cle_unsplash_ici
    ```

3.  **Installer les paquets NPM**
    ```sh
    npm install
    ```

4.  **Démarrer le serveur de développement**
    ```sh
    npm run dev
    ```

---

## 📜 Scripts Disponibles

Dans le répertoire du projet, vous pouvez exécuter :

* `npm run dev`: Lance l'application en mode développement.
* `npm run build`: Compile l'application pour la production.
* `npm run lint`: Analyse les fichiers du projet.
* `npm run preview`: Sert la version compilée en local.

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.
