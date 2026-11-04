# Pritizen Backend

এটা Firebase Functions backend project.

## প্রাকশর্ত

Deploy করার আগে নিশ্চিত করুন:

- Node.js ইন্সটল আছে
- Firebase CLI ইন্সটল আছে
- Firebase Console-এ project তৈরি করা আছে
- Firebase CLI-তে login করা আছে

Firebase CLI না থাকলে ইন্সটল করুন:

```bash
npm install -g firebase-tools
```

Login করুন:

```bash
firebase login
```

## Project সেটআপ

Project root folder-এ গিয়ে:

```bash
firebase use --add
```

আপনার Firebase project নির্বাচন করুন।

## Dependency ইন্সটল

```bash
cd functions
npm install
```

## লোকাল রান

লোকাল environment-এ backend চালাতে:

```bash
cd functions
npm run serve
```

এটা Firebase Functions emulator চালু করবে।

## Build চেক

```bash
cd functions
npm run build
```

## Firebase-এ deploy

Project root থেকে:

```bash
firebase deploy
```

শুধু functions deploy করতে চাইলে:

```bash
firebase deploy --only functions
```

## গুরুত্বপূর্ণ নোট

- এই project-এ Firebase config আগেই আছে `firebase.json`-এ
- backend code `functions` folder-এ আছে
- predeploy build ও lint আগেই config করা আছে
- project region `asia-south1`-এ সেট করা আছে

## দরকারি কমান্ড

```bash
cd functions
npm run lint
npm run build
npm run serve
```

## Production deploy checklist

1. Firebase-এ login করুন:
   ```bash
   firebase login
   ```
2. Project select করুন:
   ```bash
   firebase use <your-project-id>
   ```
3. Deploy করুন:
   ```bash
   firebase deploy
   ```

## Quick deploy command

```bash
cd /var/www/html/pritizen-backend
firebase deploy --only functions
```

আপনি চাইলে next step-এ আমি এই README-কে আরও professional style-এ সাজিয়ে দিতে পারি।
