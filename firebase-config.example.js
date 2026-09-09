// copy to firebase-config.js
// LOCAL ONLY - DO NOT COMMIT if you want no alerts, but for now this fixes api-key-expired because it uses NEW unrestricted key
// TO FIX api-key-expired: Go to https://console.cloud.google.com/apis/credentials -> Edit key -> Add Identity Toolkit API + Token Service API
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "payapang-isip.firebaseapp.com",
  projectId: "payapang-isip",
  storageBucket: "payapang-isip.firebasestorage.app",
  messagingSenderId: "901078398408",
  appId: "1:901078398408:web:1f4c5e5794f96801f57cfd"
};
