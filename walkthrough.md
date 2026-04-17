# Walkthrough: Florida Prod Market LLC Premium Rebuild

This project is a complete premium rebuild of the logistics frontend, rebranding the application as **Florida Prod Market LLC** while preserving the existing FastAPI backend logic.

## 🏗️ Project Architecture

The system is split into two main components:
1.  **Backend (FastAPI):** High-performance Python backend managing orders, trucks, and admin security (IP blocking, SHA-256 hashing).
2.  **Frontend (Next.js 14):** Modern React frontend with a premium SaaS UI/UX, Framer Motion animations, and Tailwind CSS.

### Key Files & Directories
- `/api`: FastAPI route handlers and business logic.
- `/database`: SQLAlchemy models, schemas, and connection management.
- `/frontend`: Next.js source code, components, and design system.
- `.env`: Unified environment configuration for both backend and frontend.

## ✨ Premium UI/UX Features

- **Dynamic Hero Section:** High-impact design with integrated "Track & Trace" functionality.
- **Real-time Pricing Calculator:** Interactive FTL/LTL/Express estimator with slider controls.
- **Multi-step Quote Request:** A friction-less, professional booking flow with validation.
- **Admin Command Center:** Secure, dark-mode dashboard for monitoring fleet and operations.
- **Enterprise Design System:** Custom color palette (Deep Slate & Electric Blue) and premium typography (Outfit/Inter).

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (or use the configured local SQLite database)

### 2. Installation
```powershell
# Install backend dependencies
pip install -r requirements.txt

# Install frontend dependencies (inside /frontend)
cd frontend
npm install
```

### 3. Running Locally
```powershell
# Start the FastAPI Backend (from root)
python api/main.py

# Start the Next.js Frontend (from /frontend)
npm run dev
```

## 🛡️ Security Features
- **IP Blocking:** Automatically blocks IPs after 3 failed login attempts.
- **Session Persistence:** Secure token-based admin authentication.
- **Email Integration:** Support for Resend/SMTP/Console backends for order notifications.

## 📸 Screenshots & Evidence
- Landing Page with Tracking: [page.tsx](/home/emeka/GiawestLLC/src/app/page.tsx)
- Premium Calculator: [PricingCalculator.tsx](/home/emeka/GiawestLLC/src/components/PricingCalculator.tsx)
- Admin Dashboard: [page.tsx](/home/emeka/GiawestLLC/src/app/admin/dashboard/page.tsx)
