# YubeEarn

A platform connecting YouTube creators with Ghanaian earners. Creators pay ₵100 for real viewers, earners watch videos and earn ₵85, platform earns ₵15 commission.

![YubeEarn Screenshot](public/Screenshot%20(968).png)

## 🚀 Features

* **Real Viewers**: Creators get verified YouTube watch hours (not bot views)
* **Easy Earning**: Earners watch videos and claim rewards instantly
* **Fast Withdrawals**: Bank transfers or mobile money (1-2 days)
* **Fraud Prevention**: Multi-layer detection with IP monitoring
* **Mobile-First**: Optimized for 90% mobile users in Ghana
* **Secure Payments**: Paystack integration for all transactions

## 💸 Business Model

```
Creator pays ₵100 → Earner gets ₵85 → Platform gets ₵15
```

- Creators: Get 4,000 watch hours in 2-3 months
- Earners: Make ₵17 per minute (₵85 per 5-min video)
- Platform: Sustainable ₵15 commission per transaction

## 🛠 Technologies Used

* **Frontend:**
  * Next.js 16
  * TypeScript
  * Tailwind CSS + Shadcn/UI
  * React Server Components

* **Backend:**
  * Firebase Authentication
  * Firebase Firestore (NoSQL)
  * Server Actions
  * Paystack API

* **Deployment:**
  * Vercel
  * Firebase
  * GitHub

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
pnpm
Firebase project
Paystack account
```

### Installation

1. Clone repository:
```bash
git clone https://github.com/Bensolve/yubeearn.git
cd yubeearn
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
PAYSTACK_SECRET_KEY=...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=...
```

4. Run development server:
```bash
pnpm dev
```

5. Open `http://localhost:3000`

### Test Credentials
```
Email: test@firebase.com
Password: password123
```




## 🚀 Deployment

Deploy to Vercel:

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy!

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'feat: Add feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards
- TypeScript (no `any` types)
- Shadcn/UI components
- Mobile-first Tailwind
- Proper error handling

## 📄 License

MIT License - see LICENSE file

## 🙏 Acknowledgments

- Firebase for auth & database
- Paystack for payments
- Shadcn/UI for components
- Next.js & Tailwind CSS

---

**Built with ❤️ for creators and earners in Ghana**

⭐ Star this repo if you find it helpful!
