//js/register.js

document.getElementById('loadOrder').addEventListener('click', loadOrderByBarcode);
document.getElementById('barcodeInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') loadOrderByBarcode();
});

// ページ全体でバーコードスキャンを受け付ける
let globalBarcode = '';
document.addEventListener('keydown', function (e) {
  if (document.activeElement.tagName === 'INPUT') return; // 入力欄に入力中は無視

  if (e.key >= '0' && e.key <= '9') {
    globalBarcode += e.key;
  } else if (e.key === 'Enter' && globalBarcode) {
    document.getElementById('barcodeInput').value = globalBarcode;
    loadOrderByBarcode();
    globalBarcode = '';
  } else {
    globalBarcode = ''; // 数字以外が来たらリセット
  }
});

console.log("現在のlocalStorageの中身：", JSON.stringify(localStorage, null, 2));

function loadOrderByBarcode() {
  const barcode = document.getElementById('barcodeInput').value.trim();
  if (!barcode) return;

  let orderData = localStorage.getItem(`order_${barcode}`);
  if (!orderData) {
    orderData = localStorage.getItem(`/order_${barcode}`); // fallback（パス差異対応）
  }
  if (!orderData) {
  // 全localStorageを走査して該当キーを探す（保険中の保険）
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.endsWith(barcode)) {
      orderData = localStorage.getItem(key);
      console.warn(`backup読み込み成功: ${key}`);
      break;
    }
  }
}
  // Firebase fallback
  if (!orderData) {
     console.log("[loadOrderByBarcode] 入力バーコード:", barcode);
    window.checkFirebaseOrderDebug?.(barcode); // デバッグログを追加（存在確認付き）
    
    db.collection("orders").doc(barcode).get().then((doc) => {
      if (doc.exists) {
        const firebaseOrder = doc.data().order;
        localStorage.setItem(`order_${barcode}`, JSON.stringify(firebaseOrder)); // localStorageにキャッシュ
        renderOrder(firebaseOrder); // 描画
      } else {
        let orderDetailsDiv = document.getElementById('orderDetails');
        if (!orderDetailsDiv) {
          orderDetailsDiv = document.createElement('div');
          orderDetailsDiv.id = 'orderDetails';
          orderDetailsDiv.className = 'order-details';
          document.querySelector('main').appendChild(orderDetailsDiv);
        }
        orderDetailsDiv.innerHTML = `<p>注文データが見つかりませんでした。（Firebaseも空）</p>`;

      }
    }).catch((error) => {
      console.error("Firebase 読み込みエラー:", error);
    });
    return; // 非同期処理なので return しておく
  }

  renderOrder(JSON.parse(orderData)); // 既存処理を関数化（後述）
}

function renderOrder(order) {
}
