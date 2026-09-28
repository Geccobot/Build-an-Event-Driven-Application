# Dev Container Setup Guide

This environment provides everything you need to build and test activity/assignment using TypeScript inside a VS Code Dev Container.

---

## Prerequisites

- Install [Visual Studio Code](https://code.visualstudio.com/)

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop)

- VS Code extensions:
  
  - Dev Containers
  - ESLint (optional)
  - Prettier (optional)

----

### Installing the Dev Containers Extension

1. **Open VS Code**.

2. **Access the Extensions View**:
   
   - Click on the **Extensions** icon in the Activity Bar on the side of the window.
   
   - Or press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS).

3. **Search for the Extension**:
   
   - In the Extensions view search bar, type `Dev Containers`.

4. **Install the Extension**:
   
   - Locate **Dev Containers** by Microsoft in the search results.
   
   - Click the **Install** button.

----

### Installing the ESLint Extension

1. **Open VS Code**.

2. **Access the Extensions View**:
   
   - Click on the **Extensions** icon in the Activity Bar on the side of the window.
   
   - Or press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS).

3. **Search for the Extension**:
   
   - In the Extensions view search bar, type `ESLint`.

4. **Install the Extension**:
   
   - Locate **ESLint** by Microsoft in the search results.
   
   - Click the **Install** button.

---

### Installing the Prettier Extension

1. **Open VS Code**.

2. **Access the Extensions View**:
   
   - Click on the **Extensions** icon in the Activity Bar on the side of the window.
   
   - Or press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS).

3. **Search for the Extension**:
   
   - In the Extensions view search bar, type `Prettier`.

4. **Install the Extension**:
   
   - Locate **Prettier - Code formatter** by Prettier in the search results.
   
   - Click the **Install** button.

---

## 📁 Folder Structure

```
[assignment/activity] folder/

├── README.md
├── README-devcontainer.md
└── code/
    └── start/
        ├── package.json
        ├── tsconfig.json
        ├── .devcontainer/
        │   └── devcontainer.json
        ├── src/
        └── public/
```

---

### Steps to Set Up Your Development Environment with `.devcontainer`

1. **Ensure Docker Desktop is Running**  
   
   - Open Docker Desktop on your machine.
   - Verify that the Docker engine is running. You should see the Docker icon in your system tray or menu bar indicating that it's active.

2. **Open Your Project in VS Code**  
   
   - Launch Visual Studio Code.  
   - Use the **File > Open Folder** option to open your application folder.

3. **Reopen in Dev Container**  
   
   - VS Code will automatically detect the `.devcontainer` folder.  
   - A notification will appear at the bottom-right corner of the editor asking:  
     *"This folder contains a Dev Container configuration. Would you like to reopen it in a container?"*  
   - Click **"Reopen in Container"**.  
   - VS Code will now build the development container using the `devcontainer.json`.

4. **Wait for the Setup to Complete**  
   
   - Once the container is built, VS Code will automatically run any `postCreateCommand` specified in the `devcontainer.json` file.  
   - For example, it will execute `npm install` to install your project dependencies.

5. **Start Working on the Application**  
   
   - After the setup is complete, your development environment is ready.  

---

### Running the Application with Expo - After Finalizing Everything

1. **Start the Expo Development Server**
   
   ```bash
   npx expo start
   ```

2. **Choose a Platform to Run the App**
   
   - Use one of the following methods to run the app:
     - Press `i` to run on an iOS simulator.
     - Press `a` to run on an Android emulator.
     - Scan the QR code with the **Expo Go** app on your physical device.

3. **Test the Application**
   
   - Interact with the login screen to ensure animations, form validation, and reusable components are functioning as expected.