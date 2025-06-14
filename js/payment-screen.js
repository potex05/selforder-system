// js/payment-screen.js

function showPaymentScreen() {
  const header = document.querySelector(".header");
  const main = document.querySelector(".main");
  const footerButtons = document.querySelectorAll(".footer-btn");

  // ヘッダー変更
  header.textContent = 'お帰りの際は[お会計する]をタップ';

  // フッターのボタン状態リセットして5番目をactiveに
  footerButtons.forEach(btn => {
  btn.classList.remove("active", "disabled");
  btn.removeAttribute("disabled");
  });
  if (footerButtons.length > 4) {
    footerButtons[4].classList.add("active");
  }

  // orderHistoryから内容取得（historyItemsは使わない）
  const paymentItems = orderHistory.map(item => ({ ...item }));

  let paymentItemsHtml = `
    <div class="history-wrapper">
      <div class="history-header" id="historyHeader">
        <div style="flex: 1;">メニュー名</div>
        <div style="width: 80px; text-align: center;">数量</div>
        <div style="width: 80px; text-align: right;">価格</div>
      </div>
      ${paymentItems.map((entry, idx) => {
        const item = menuData[entry.code];
        if (!item) return '';
        const totalPrice = item.price * entry.quantity;
        const altBgClass = (idx % 2 === 1) ? 'alt-bg' : '';
        return `
          <div class="item-view ${altBgClass}" style="display: flex; align-items: center; background-color: #fff;">
            <div class="item-info" style="flex: 1;">
              <div class="item-name" style="font-size: calc(1.2em - 0.3em); margin-bottom: 0px;">${item.name}</div>
            </div>
            <div class="quantity-info" style="width: 80px; text-align: center;">${entry.quantity}</div>
            <div class="price-info" style="width: 80px; text-align: right;">${totalPrice}</div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  // 合計数・金額の計算
  const totalItems = paymentItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = paymentItems.reduce((sum, item) => {
    const menu = menuData[item.code];
    return sum + (menu ? menu.price * item.quantity : 0);
  }, 0);

  // mainを差し替え
  main.innerHTML = `
    <div class="history-view">
      ${paymentItemsHtml}

      <div class="price-summary">
        <div class="totalItems-container">
          <span id="paymentTotalItems">${totalItems}</span>点</div>
        <div class="totalPrice-container">
          合計<span id="paymentTotalPrice">${totalPrice}</span>円(税込)
        </div>
      </div>

      <div style="text-align: center; margin-top: 1.5rem;">
        <button id="finalizePaymentButton" class="finalize-payment-button">お会計する</button>
      </div>
    </div>
  `;

  // スクロール処理（履歴と同様）
  setTimeout(() => {
    const wrapper = document.querySelector(".history-wrapper");
    const itemCount = wrapper?.querySelectorAll(".item-view").length || 0;
    if (itemCount >= 4) {
      wrapper.style="padding-right: 0;"
      wrapper.style.maxHeight = "415px";
      wrapper.style.overflowY = "auto";
      wrapper.style.marginBottom = "1rem";
    }
  }, 0);

  // お会計ボタンの処理（仮：アラート）
  setTimeout(() => {
    const finalizeBtn = document.getElementById("finalizePaymentButton");
    if (finalizeBtn) {
      finalizeBtn.addEventListener("click", () => {
        // お会計確定画面へ遷移
        showFinalScreen();
      });
    }
  }, 0);
}
