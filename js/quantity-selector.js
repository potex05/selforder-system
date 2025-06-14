//js/quantity-selector.js

(function () {
var quantity = 1;

const quantityDisplay = document.getElementById("quantityDisplay");
const decreaseBtn = document.getElementById("decreaseBtn");
const increaseBtn = document.getElementById("increaseBtn");
const backBtn = document.getElementById("backBtn");
const addToCartBtn = document.getElementById("addToCartBtn");


// HTML上に一時的に渡されたコードを取得
const code = document.body.dataset.code; // ← 安全な方法で取得

// 要素が存在する場合のみイベント設定（安全性のため）
if (quantityDisplay && decreaseBtn && increaseBtn && backBtn && addToCartBtn && code) {
  // 数量変更
  decreaseBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      quantityDisplay.textContent = quantity;
    }
  });

  increaseBtn.addEventListener("click", () => {
    quantity++;
    quantityDisplay.textContent = quantity;
  });

  // もどる → 入力画面に戻す
  backBtn.addEventListener("click", () => {
      // ページをリロードせず、メニュー番号入力画面に戻す
      if (typeof loadMainScreen === "function") {
        loadMainScreen(); // メニュー番号入力画面を再描画
      }
    });
  

  // 注文かごへ追加
  document.getElementById("addToCartBtn").addEventListener("click", () => {

    const code = document.body.dataset.code;
    const quantity = parseInt(document.getElementById("quantityDisplay").textContent, 10);

    // confirm-screen.js がすでに読み込まれているか確認して二重読み込み回避
    if (typeof showConfirmScreen === "function") {
      showConfirmScreen(code, quantity);
    } else {
      const script = document.createElement("script");
      script.src = "js/confirm-screen.js";
      script.onload = () => {
        showConfirmScreen(code, quantity);
      };
      document.body.appendChild(script);
    }
  });
}
})();