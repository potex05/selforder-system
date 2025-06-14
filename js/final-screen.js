// js/final-screen.js

function showFinalScreen() {
  const header = document.querySelector(".header");
  const main = document.querySelector(".main");
  const footer = document.querySelector("footer");

  // ヘッダー変更
  header.textContent = 'この画面をレジでお知らせください';

  // フッター書き換え（copyright のみ）
  footer.innerHTML = `<div class="copyright">© 2025 selforder-system</div>`;

  // ランダム卓番（01〜99）
  const tableNumber = String(Math.floor(Math.random() * 99 + 1)).padStart(2, '0');

  // Code128バーコード生成
  const barcodeValue = Date.now().toString(); // タイムスタンプをバーコード値に
  localStorage.setItem(`order_${barcodeValue}`, JSON.stringify(orderHistory));


  // テンプレートHTML（mainに置き換え）
  main.innerHTML = `
    <div class="final-screen">
      <div class="table-number-container">
        <span class="table-number">${tableNumber}</span>
      </div>

      <div class="final-logo">
        <img src="image/logo.jpg" alt="ロゴ" class="final-logo-img">
      </div>

      <div class="barcode-area">
        <img src="https://barcode.tec-it.com/barcode.ashx?data=${barcodeValue}&code=Code128&multiplebarcodes=false&translate-esc=false&hidehrt=true" alt="バーコード" class="barcode-img">
        <div class="barcode-number">${barcodeValue}</div>
      </div>

      <div class="receipt-button-container">
        <button id="showReceiptButton" class="receipt-button">明細を表示する</button>
      </div>

      <div class="final-screen-note">※この画面は、お会計後、自動的に閉じます。</div>
    </div>
  `;

  // 明細表示ボタン → ポップアップ的に history-view 表示
  document.getElementById("showReceiptButton").addEventListener("click", () => {
    const receiptView = document.createElement("div");
    receiptView.className = "history-view";
    receiptView.style = `
      position: fixed;
      top: 10%;
      left: 5%;
      width: 90%;
      max-height: 80%;
      background: #fff;
      border: 2px solid #ccc;
      padding: 1rem;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
    `;

    // 明細生成処理（history-screen.js 相当）
    const historyItemsHtml = orderHistory.map((entry, idx) => {
      const item = menuData[entry.code];
      if (!item) return '';
      const totalPrice = item.price * entry.quantity;
      const altBgClass = idx % 2 === 1 ? 'alt-bg' : '';
      return `
        <div class="item-view ${altBgClass}" style="display: flex; align-items: center; background-color: #fff;">
          <div class="item-info" style="flex: 1;">
            <div class="item-name" style="font-size: calc(1.2em - 0.3em); margin-bottom: 0px;">${item.name}</div>
          </div>
          <div class="quantity-info" style="width: 80px; text-align: center;">${entry.quantity}</div>
          <div class="price-info" style="width: 80px; text-align: right;">${totalPrice}</div>
        </div>
      `;
    }).join('');

    const totalItems = orderHistory.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = orderHistory.reduce((sum, i) => {
      const item = menuData[i.code];
      return sum + (item ? item.price * i.quantity : 0);
    }, 0);

    receiptView.innerHTML = `
      <div class="history-header" id="historyHeader" style="width: 100%;">
        <div style="flex: 1;">メニュー名</div>
        <div style="width: 80px; text-align: center;">数量</div>
        <div style="width: 80px; text-align: right;">価格</div>
      </div>
      ${historyItemsHtml}
      <div class="price-summary" style="font-size: 20px;">
        <div class="totalItems-container"><span>${totalItems}</span>点</div>
        <div class="totalPrice-container">合計<span>${totalPrice}</span>円(税込)</div>
      </div>
      <div style="margin-top: 1rem;">
        <button id="closeReceiptView" style="padding: 0.3rem 0.8rem;">閉じる</button>
      </div>
    `;

    document.body.appendChild(receiptView);

    document.getElementById("closeReceiptView").addEventListener("click", () => {
      document.body.removeChild(receiptView);
    });
  });
}
