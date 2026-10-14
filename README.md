# KopiKonek ☕

A modern, premium e-commerce web prototype for a specialty coffee and brewing equipment marketplace with multi-vendor split-cart logic.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)


---

## ✨ Features & Highlights

### 1. 🏠 Homepage & Catalog (`index.html`)
- **Design System & Theme**: Warm, organic, minimalist palette — Off-white/Cream (`#F9F8F6`), Deep Espresso (`#2C1E16`), Muted Terracotta (`#CC5500`), and Sage Green (`#7C9082`).
- **Typography**: Editorial serif headings (*Playfair Display*) paired with clean modern sans-serif (*Inter*).
- **Dual Product Logic**:
  - **Coffee Bean Cards**: Vendor badge, origin, roast level (*Light/Medium/Dark*), tasting notes, live roast date indicator, and direct *Add to Cart*.
  - **Equipment Cards**: Material, capacity, brand specs, and vendor location.
- **Product Detail Quick-View**: Interactive modal & spotlight section featuring:
  - Grind Size Selector (*Whole Bean, French Press, Medium/V60, Fine/Espresso*).
  - Freshness indicator with resting advice.
  - Interactive flavor profile sliders (*Acidity, Body, Sweetness*).
- **Multi-Vendor Slide-Out Cart (Split-Cart)**:
  - Items grouped per roastery/vendor package.
  - Separate per-vendor shipping fees and combined breakdown.
- **Partner Roasteries Showcase**: Featuring indie micro-roasters across the Indonesian archipelago (*Bandung, Yogyakarta, Aceh, Ubud, etc.*).
- **Interactive Brew Matchmaker**: Dynamic equipment and bean recommendations based on brewing method (*Espresso, Manual Brew, Cold Brew*).

### 2. 💳 High-Fidelity Checkout (`checkout.html`)
- Built with **React** & **Tailwind CSS**.
- **Shipping Address Form**: Clean, validated input fields.
- **Multi-Vendor Delivery Options**: Independent delivery service options per vendor (*Regular, Next Day, Same Day*).
- **Selectable Payment Methods**: Virtual Account (BCA, Mandiri, BNI), QRIS, and Credit Card with format validation.
- **Sticky Order Summary**: Live cost breakdown (Subtotal, Combined Multi-vendor Shipping, Platform Fee, Grand Total) protected by simulated Escrow processing.

---

## 🚀 Getting Started

Since this is a lightweight prototype using modern CDN scripts:

### Option A: Local Web Server (XAMPP / PHP)
1. Place the folder into `c:/xampp/htdocs/` (or your local web server root).
2. Start Apache via XAMPP Control Panel.
3. Open in your browser:
   ```
   http://localhost/projekAntigravity/index.html
   ```

### Option B: Quick Static Server / VS Code Live Server
You can also run any local HTTP server:
```bash
# Using Python
python -m http.server 3000

# Using Node.js npx serve
npx serve .
```
Then visit `http://localhost:3000`.

---

## 📁 Project Structure

```
├── index.html          # Main storefront & marketplace prototype
├── checkout.html       # High-fidelity React multi-vendor checkout page
├── assets/
│   ├── data.js         # Shared marketplace catalog, vendor registry & cart state
│   ├── app.js          # Storefront interactivity, quick-view & cart drawer
│   └── styles.css      # Custom animations, scroll reveals & typography styling
└── README.md           # Documentation
```

---

## ☕ License
Created with passion for coffee culture.
