// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyBeq08o2hPiM8RQmvVrei8cCCqtVfijiGs",
  authDomain: "selforder-system-01.firebaseapp.com",
  databaseURL: "https://selforder-system-01-default-rtdb.firebaseio.com",
  projectId: "selforder-system-01",
  storageBucket: "selforder-system-01.firebasestorage.app",
  messagingSenderId: "517977276669",
  appId: "1:517977276669:web:b44e39f4446947dab27e94",
  measurementId: "G-BZLNHSWMY8"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
