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
const db = firebase.firestore();
window.db = db;

// デバッグ用関数（register.js から使う）
window.checkFirebaseOrderDebug = function(barcode) {
  console.log("[checkFirebaseOrderDebug] チェック中のバーコード:", barcode);
  db.collection("orders").doc(barcode).get().then((doc) => {
    console.log("Firebase からの取得結果:", doc.exists, doc.data());
  }).catch((error) => {
    console.error("Firebase デバッグ取得エラー:", error);
  });
};
