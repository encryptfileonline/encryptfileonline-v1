# encryptfile.online
A modern, minimal, and secure browser-based tool for client-side file encryption and decryption.
[cloudflarebutton]
encryptfile.online is an ultra-modern, minimalist web application designed for secure, client-side file encryption and decryption. Built with a strong focus on user experience and visual elegance, it allows users to encrypt files directly in their browser using the robust WebCrypto API (AES-256-GCM) and a strong key derivation function. The core philosophy is 'zero-trust,' meaning no files, passphrases, or keys ever leave the user's device.
## ✨ Key Features
-   **Secure Client-Side Encryption**: All encryption and decryption happens directly in your browser using the WebCrypto API (AES-256-GCM).
-   **Zero-Trust Architecture**: Your files, passphrases, and keys never leave your device. No data is ever sent to a server.
-   **Strong Key Derivation**: User passphrases are converted into secure encryption keys using a standard, robust key derivation function (PBKDF2).
-   **Intuitive Interface**: A clean, minimalist drag-and-drop UI makes a complex process feel effortless.
-   **Instant Downloads**: Encrypted (`.enc`) or decrypted files are available for immediate download after processing.
-   **Light & Dark Mode**: A beautiful, calming interface that adapts to your system's theme.
-   **Fully Responsive**: Flawless experience across all device sizes, from mobile to desktop.
## 🛠️ Technology Stack
-   **Frontend**: React, Vite
-   **UI Components**: shadcn/ui
-   **Styling**: Tailwind CSS
-   **State Management**: Zustand
-   **Animation**: Framer Motion
-   **Icons**: Lucide React
-   **Client-Side Cryptography**: WebCrypto API
-   **Deployment**: Cloudflare Workers
## 🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites
You need to have [Bun](https://bun.sh/) installed on your machine.
### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/encryptfile-online.git
    cd encryptfile-online
    ```
2.  Install the dependencies:
    ```bash
    bun install
    ```
### Running Locally
To start the development server, run the following command:
```bash
bun run dev
```
The application will be available at `http://localhost:3000`.
## 💻 Development
This project is built with a modern frontend stack. Here are some key points for developers:
-   **Project Structure**:
    -   `src/`: Contains all the React frontend code, including pages, components, hooks, and utility functions.
    -   `worker/`: Contains the Cloudflare Worker code for serving the static application.
-   **Components**: We heavily leverage `shadcn/ui` for our component library. Components are located in `src/components/ui` and should be imported from there.
-   **Styling**: All styling is done using Tailwind CSS utility classes. Custom theme configurations can be found in `tailwind.config.js`.
-   **State Management**: Global application state is managed with Zustand. Store logic is designed to be simple and atomic.
## ☁️ Deployment
This application is designed to be deployed as a static site served by Cloudflare Workers.
To deploy the application, simply run:
```bash
bun run deploy
```
This command will build the application and deploy it to your Cloudflare account using Wrangler.
Alternatively, you can deploy your own version with a single click.
[cloudflarebutton]
## 🔒 Security Notice
-   **Client-Side Only**: encryptfile.online operates entirely within your browser. Your files and passphrases are never uploaded to any server.
-   **Passphrase Security**: You are solely responsible for your passphrase. If you forget it, there is **no way to recover it** or decrypt your files. Choose a strong, memorable passphrase.
## 📄 License
This project is licensed under the MIT License.