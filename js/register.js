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
  let orderDetailsDiv = document.getElementById('orderDetails');
  if (!orderDetailsDiv) {
    orderDetailsDiv = document.createElement('div');
    orderDetailsDiv.id = 'orderDetails';
    orderDetailsDiv.className = 'order-details';
    document.querySelector('main').appendChild(orderDetailsDiv);
  }
  orderDetailsDiv.innerHTML = ''; // 一旦クリア

  // スキャン案内などを非表示に（そのまま残しても問題ないがUI整えるため）
  const scanHeading = document.querySelector('.scan-instruction');
  const scanImage = document.querySelector('.scan-image');
  if (scanHeading) scanHeading.style.display = 'none';
  if (scanImage) scanImage.style.display = 'none';

  // 注文明細見出しがなければ追加
  if (!document.getElementById('orderHeading')) {
    const orderHeading = document.createElement('h2');
    orderHeading.id = 'orderHeading';
    orderHeading.textContent = '注文明細';
    document.querySelector('main').insertBefore(orderHeading, orderDetailsDiv);
  }

  // 万一 null や undefined が渡ってきた場合
  if (!order || !Array.isArray(order)) {
    orderDetailsDiv.innerHTML = `<p>注文データが見つかりませんでした。</p>`;
    return;
  }

  let html = `
    <div class="item-header">
      <div class="menu-title">メニュー名</div>
      <div class="quantity-title">数量</div>
      <div class="price-title">価格</div>
    </div>
  `;

  let total = 0;

  order.forEach(entry => {
    const item = menuData[entry.code];
    if (!item) return;
    const price = item.price * entry.quantity;
    total += price;
    html += `
      <div class="item">
        <div class="item-info">
          <div class="item-name">${item.name}</div>
        </div>
        <div class="entry-quantity">${entry.quantity}</div>
        <div class="price-info">${price}</div>
      </div>
    `;
  });

  html += `<div class="total">合計：${total}円（税込）</div>`;
  orderDetailsDiv.innerHTML = html;

  // ヘッダー変更（自然なレジらしさ）
  const header = document.querySelector('header.header');
  if (header) {
    header.textContent = 'ご利用ありがとうございました。';
  }
}
