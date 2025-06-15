// js/history-screen.js

let historyItems = [];
let orderHistory = []; // ← 新たに履歴確定時に保存する配列を追加

function showHistoryScreen() {
  // orderHistory の内容を履歴用にコピー
  historyItems = orderHistory.map(item => ({ ...item }));

  const header = document.querySelector(".header");
  const main = document.querySelector(".main");
  main.style.height = `${window.innerHeight}px`;
  const footerButtons = document.querySelectorAll(".footer-btn");

  // ヘッダー変更
  header.textContent = '注文内容をご確認ください';

  // フッターのボタン状態リセットして3番目をactiveに
  footerButtons.forEach(btn => {
  btn.classList.remove("active", "disabled");
  btn.removeAttribute("disabled");
  });

  document.getElementById("footerCart")?.classList.add("no-active");
  document.getElementById("footerHistory")?.classList.add("active");
  
  if (footerButtons.length > 2) {
    footerButtons[2].classList.add("active");
  }

  // 履歴HTML生成
  let historyItemsHtml = `
    <div class="history-wrapper">
      <div class="history-header" id="historyHeader">
        <div style="flex: 1;">メニュー名</div>
        <div style="width: 80px; text-align: center;">数量</div>
        <div style="width: 80px; text-align: right;">価格</div>
      </div>
      ${historyItems.map((entry, idx) => {
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
  const totalItems = historyItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = historyItems.reduce((sum, item) => {
    const menu = menuData[item.code];
    return sum + (menu ? menu.price * item.quantity : 0);
  }, 0);

  // mainを差し替え
  main.innerHTML = `
    <div class="history-view">
      ${historyItemsHtml}

      <div class="history-note">注文の反映には数分かかることがございます</div>

      <div class="price-summary">
        <div class="totalItems-container">
          <span id="historyTotalItems">${totalItems}</span>点</div>
        <div class="totalPrice-container">
          合計<span id="historyTotalPrice">${totalPrice}</span>円(税込)
        </div>
      </div>
    </div>
  `;

  // スクロール処理
  setTimeout(() => {
    const wrapper = document.querySelector(".history-wrapper");
    const itemCount = wrapper?.querySelectorAll(".item-view").length || 0;
    if (itemCount >= 9) {
      wrapper.style.maxHeight = "415px";
      wrapper.style.overflowY = "auto";
     /* wrapper.style.marginBottom = "0.2rem"; */
    }
  }, 0);
}
