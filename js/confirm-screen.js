// js/confirm-screen.js

if (!Array.isArray(window.confirmItems)) {
  window.confirmItems = [];
}

function showConfirmScreen(code, quantity) {
  const item = menuData[code];
  const header = document.querySelector(".header");
  const main = document.querySelector(".main");
  const footerButtons = document.querySelectorAll(".footer-btn");

  // アイテム追加（既に同じcodeがある場合は数量だけ増やす）
  const existingItem = confirmItems.find(item => item.code === code);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    confirmItems.push({ code, quantity });
  }


  // ヘッダー変更
  header.textContent = 'ほかに注文があれば「追加」なければ「注文」';

  // footerCartのno-activeを明示的に解除
  const footerCart = document.getElementById("footerCart");
  if (footerCart) {
    footerCart.classList.remove("no-active");
  }

  // フッターボタン更新
  footerButtons.forEach(btn => {
  btn.classList.remove("active", "disabled");
  btn.removeAttribute("disabled");
  });
  footerButtons[1].classList.add("active"); // 「注文かご」ボタン
  footerButtons[0].classList.add("disabled"); // 「注文追加」ボタン
  footerButtons[4].classList.add("disabled"); // 「会計する」ボタン
  footerButtons[0].setAttribute("disabled", "true");
  footerButtons[4].setAttribute("disabled", "true");

  // 背景色切替用スタイルを一度だけ埋め込む（GitHub Pages 対応）
  if (!document.getElementById("alt-bg-style")) {
    const style = document.createElement("style");
    style.id = "alt-bg-style";
    style.textContent = `
      .item-view.alt-bg {
        background-color: #fff;
      }
    `;
    document.head.appendChild(style);
  }


  // 各アイテムの表示を生成
  let itemViewsHtml = `
    <div class="item-wrapper">
      ${confirmItems.map((itemEntry, idx) => {
        const entryItem = menuData[itemEntry.code];
        if (!entryItem) return ''; // 無効なcodeはスキップ
        const totalPrice = entryItem.price * itemEntry.quantity;
        const altBgClass = (idx % 2 === 1) ? 'alt-bg' : '';
        return `
          <div class="item-view ${altBgClass}">
            <div class="item-info">
              <div class="item-name">${entryItem.name}</div>
            </div>

            <div class="quantity-control">
              <button class="decreaseConfirmBtn"></button>
              <span class="confirmQuantityDisplay">${itemEntry.quantity}</span>
              <button class="increaseConfirmBtn"></button>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;

// スクロール処理（item-viewが4つ以上ならスクロール可能に）
setTimeout(() => {
  const wrapper = document.querySelector(".item-wrapper");
  const itemCount = wrapper?.querySelectorAll(".item-view").length || 0;
  if (itemCount >= 4) {
    /* wrapper.style.maxHeight = "415px"; */
    wrapper.style.overflowY = "auto";
    wrapper.style.marginBottom = "0.5rem"; // 下の合計金額とボタンと被らないように
  }
}, 0);

  // mainの高さをアドレスバー除去後の高さに固定（←追加）
  main.style.height = `${window.innerHeight}px`;

  // 確定画面HTMLテンプレート
  main.innerHTML = `
    <div class="confirm-view">
      ${itemViewsHtml}

      <div class="price-summary">
        <div class="totalItems-container">
          <span id="totalItems">${getTotalItems()}</span>点</div>
        <div class="totalPrice-container">合計<span id="totalPrice">${getTotalPrice()}</span>円(税込)</div>
      </div>

      <div class="action-buttons">
        <button id="addMoreBtn">追　加</button>
        <button id="finalOrderBtn">注　文</button>
      </div>
    </div>
  `;


  // 数量操作
  let currentQty = quantity;
  const qtyDisplay = document.getElementById("confirmQuantityDisplay");
  const priceDisplay = document.getElementById("totalPrice");
  const itemCount = document.getElementById("totalItems");

  document.querySelectorAll(".item-view").forEach((view, index) => {
    const decreaseBtn = view.querySelector(".decreaseConfirmBtn");
    const increaseBtn = view.querySelector(".increaseConfirmBtn");
    const qtyDisplay = view.querySelector(".confirmQuantityDisplay");

    let currentQty = confirmItems[index].quantity;
    const item = menuData[confirmItems[index].code];

    decreaseBtn.addEventListener("click", () => {
      if (currentQty > 1) {
        currentQty--;
        confirmItems[index].quantity = currentQty;
        qtyDisplay.textContent = currentQty;
        document.getElementById("totalItems").textContent = getTotalItems();
        document.getElementById("totalPrice").textContent = getTotalPrice();
      } else {
        // 確認UIが既に存在すれば追加しない
        const main = document.querySelector("main");
        if (main.querySelector(".confirmation")) return;

        const confirmation = document.createElement("div");
        confirmation.classList.add("confirmation");

        confirmation.innerHTML = `
          <p>このメニューを削除してよろしいですか？</p>
          <div class="confirmation-buttons">
            <button id="confirmDeleteNo">いいえ</button>
            <button id="confirmDeleteYes">はい</button>
          </div>
        `;

        confirmation.querySelector("#confirmDeleteNo").addEventListener("click", () => {
          confirmation.remove();
        });

        confirmation.querySelector("#confirmDeleteYes").addEventListener("click", () => {
          // confirmItemsから削除
          confirmItems.splice(index, 1);

          // 再描画
          showConfirmScreen(null, 0); // コード再表示（null可、数量0）

          confirmation.remove();
        });

        main.querySelector(".confirm-view").appendChild(confirmation);
      }
    });

    increaseBtn.addEventListener("click", () => {
      currentQty++;
      confirmItems[index].quantity = currentQty;
      qtyDisplay.textContent = currentQty;
      document.getElementById("totalItems").textContent = getTotalItems();
      document.getElementById("totalPrice").textContent = getTotalPrice();
    });
  });


  // 「追加」ボタン：画面だけ初期化、confirmItemsは保持
  document.getElementById("addMoreBtn").addEventListener("click", () => {
    if (typeof loadMainScreen === "function") loadMainScreen();
  });

// 「注文」ボタン：確認UIを表示
document.getElementById("finalOrderBtn").addEventListener("click", () => {
  const main = document.querySelector("main");

  // すでに確認UIがある場合は追加しない
  if (main.querySelector(".confirmation")) return;

  // confirmItems を orderHistory に保存（履歴用）
  if (confirmItems.length > 0) {
    orderHistory = orderHistory.concat(confirmItems.map(item => ({ ...item })));
  }


  if (confirmItems.length === 0) {
    const warning = document.createElement("div");
    warning.classList.add("confirmation");

    warning.innerHTML = `
      <p>商品を1点以上注文してください</p>
      <div class="confirmation-buttons">
        <button id="confirmEmptyOk">はい</button>
      </div>
    `;

    warning.querySelector("#confirmEmptyOk").addEventListener("click", () => {
      warning.remove();
    });

    main.querySelector(".confirm-view").appendChild(warning);
    return;
  }

  const confirmation = document.createElement("div");
  confirmation.classList.add("confirmation");

  confirmation.innerHTML = `
    <p>注文をキッチンへ送信しますか？</p>
    <div class="confirmation-buttons">
      <button id="confirmOrderNo">いいえ</button>
      <button id="confirmOrderYes">はい</button>
    </div>
  `;

  // 「いいえ」：確認UIだけ削除
  confirmation.querySelector("#confirmOrderNo").addEventListener("click", () => {
    confirmation.remove();
  });

  // 「はい」：注文確定処理 → 注文完了画面
  confirmation.querySelector("#confirmOrderYes").addEventListener("click", () => {
    confirmItems = [];
    if (typeof showThanksScreen === "function") showThanksScreen();
  });

  // main末尾に追加（.confirm-viewの下に）
  main.querySelector(".confirm-view").appendChild(confirmation);
});

}

// 合計点数
function getTotalItems() {
  return confirmItems.reduce((sum, i) => {
    const qty = Number(i.quantity);
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);
}

// 合計金額
function getTotalPrice() {
  // confirmItemsから削除済みメニューを排除
  confirmItems = confirmItems.filter(i => {
    const item = menuData[i.code];
    if (!item || typeof item.price !== 'number') {
      console.log(`メニューが削除されました: ${i.code}`);
      return false; // 配列から除外
    }
    return true;
  });

  return confirmItems.reduce((sum, i) => {
    const item = menuData[i.code];
    return sum + (item.price * i.quantity);
  }, 0);
}
