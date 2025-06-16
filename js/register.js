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

  let orderDetailsDiv = document.getElementById('orderDetails');
  if (!orderDetailsDiv) {
    orderDetailsDiv = document.createElement('div');
    orderDetailsDiv.id = 'orderDetails';
    orderDetailsDiv.className = 'order-details';
    document.querySelector('main').appendChild(orderDetailsDiv);
  }
  orderDetailsDiv.innerHTML = '';

  const scanHeading = document.querySelector('.scan-instruction');
  const scanImage = document.querySelector('.scan-image');

  // スキャン見出し・画像を非表示にする
  if (scanHeading) scanHeading.style.display = 'none';
  if (scanImage) scanImage.style.display = 'none';

  // すでに「注文明細」見出しがあるか確認してなければ作成
  if (!document.getElementById('orderHeading')) {
    const orderHeading = document.createElement('h2');
    orderHeading.id = 'orderHeading';
    orderHeading.textContent = '注文明細';
    document.querySelector('main').insertBefore(orderHeading, orderDetailsDiv);
  }

  if (!orderData) {
    orderDetailsDiv.innerHTML = `<p>注文データが見つかりませんでした。</p>`;
    return;
  }

  const order = JSON.parse(orderData);

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

  // ヘッダーを「ご利用ありがとうございました。」に変更
  const header = document.querySelector('header.header');
  if (header) {
    header.textContent = 'ご利用ありがとうございました。';
  }
}
