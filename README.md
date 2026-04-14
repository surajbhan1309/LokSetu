# SUVIDHA - Unified Civic Services Smart Kiosk

A touch-based, multilingual, self-service kiosk interface for accessing civic utility services (Electricity, Gas, Water, Waste Management).

## 🎯 Features

### Citizen Kiosk
- **Multilingual Support**: English, Hindi, and Assamese with easy language switching
- **Touch-Optimized UI**: Large buttons (≥48px), clear icons, minimal text
- **Authentication**: Mobile OTP verification + Demo login
- **Service Access**: 
  - Register complaints
  - Submit service requests
  - Track request status
  - **Pay Bills**: Integrated payment gateway with UPI & QR support
- **Receipt Generation**: Downloadable PDF receipts with QR codes

### Admin Dashboard
- **Request Management**: View and filter all requests
- **Status Updates**: Update request status in real-time
- **Department Filtering**: Filter by Electricity, Gas, Water, Waste

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone or navigate to the project folder**
   ```bash
   cd suvidha-kiosk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
suvidha-kiosk/
├── src/
│   ├── admin/              # Admin dashboard screens
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── i18n/               # Internationalization (locales)
│   ├── screens/            # Kiosk screens
│   ├── services/           # API services
│   ├── utils/              # Utilities (constants, validation)
│   ├── App.jsx             # Main app with routing
│   └── index.css           # Global styles
├── backend/                # API Backend
├── public/                 # Static assets
└── package.json            # Dependencies
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#0056e0) - Main brand color
- **Electricity**: Amber (#f59e0b)
- **Gas**: Blue (#3b82f6)
- **Water**: Teal (#14b8a6)
- **Waste**: Green (#10b981)

## 🛠️ Technologies

- **Frontend Framework**: React 18.3
- **Build Tool**: Vite 7.3
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM 7.1
- **Internationalization**: i18next
- **Utilities**: Axios, jsPDF, qrcode.react

## ❤️ Support the Project

If you find this project helpful for community development, consider sponsoring the author!

[![GitHub Sponsor](https://img.shields.io/badge/Sponsor-syazy--bit-pink?style=for-the-badge&logo=github-sponsors)](https://github.com/sponsors/syazy-bit)

---

**Built with ❤️ for a Digital India**
