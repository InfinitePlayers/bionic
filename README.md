# Bionic Brand HD Toolkit V1.2

A high-fidelity web application designed for the rapid generation of brand-compliant assets. This tool strictly follows the **Bionic Brand Identity Tool Kit V1.0** specifications for holding devices, typography, and color systems.

## 🚀 Features

- **HD 1920x1080 Export**: Native canvas rendering for pixel-perfect social and presentation assets.
- **Brand Compliant Math**: Automatically handles the 1.5° rotation, 1/4 CAP offset, and -0.04em letter-spacing rules.
- **Zero-Install Architecture**: Uses browser-native ESM and Import Maps. No `npm install` required for development.
- **Holding Device Logic**: Switch between "Overlapping" and "Standard" box architectures with custom stacking priority.
- **Dynamic Palette**: Support for Main Promo (Orange/Navy), Secondary (Navy/Orange), Product Focus (Blue/Navy), and Editorial (Grey/White) themes.

## ⚠️ Deployment Instructions (Crucial)

If you see a blank screen or code errors after deploying to GitHub:

1. Go to your Repository **Settings**.
2. Click **Pages** in the left sidebar.
3. Under **Build and deployment** > **Source**, select **GitHub Actions** from the dropdown menu (it might currently say "Deploy from a branch").
4. This will trigger the workflow defined in `.github/workflows/deploy.yml` which properly builds the React app.

## 🛠 Usage

1. **Clone the repo**: `git clone https://github.com/your-username/bionic-brand-hd-toolkit.git`
2. **Run a local server**: Because it uses ES Modules, you need a basic local server.
   - Using VS Code? Right-click `index.html` and select **"Open with Live Server"**.
   - Using Python? Run `python -m http.server` in the root folder.
3. **Export**: Use the **"EXPORT 1920x1080 MASTER"** button to download a high-quality PNG.

## 📏 Specifications Adhered

- **Typography**: Poppins 900 (Black).
- **Tracking**: -0.04em (Simulated in Export Engine).
- **Rotation**: ±1.5° per Identity Rule #11.
- **Padding**: 1/2 CAP Height (Identity Rule #6).
- **Architecture**: Overlapping holding devices using the "Bionic Shift" logic.

## 📄 License

MIT © 2024 Bionic HQ