// js/menu-handler.js

function setupMenuInputHandler() {

  const inputField = document.getElementById("inputField");
  const logoDiv = document.querySelector(".logo");
  const header = document.querySelector(".header");
  const main = document.querySelector(".main");

  // inputFieldが存在するかチェック
  if (!inputField) return; // 存在しなければ何もせず終了

  inputField.addEventListener("input", () => {
    const code = inputField.value;

    if (code.length === 4 && menuData.hasOwnProperty(code)) {
      // メニュー番号が存在 → 商品名表示と次へ

      logoDiv.innerHTML = `
        <div class="menu-name">${menuData[code].name}</div>
        <div class="next-button-wrapper">
          <button class="next-button">次に進む</button>
        </div>
      `;

      // 「次に進む」ボタン押下時の処理
      logoDiv.querySelector(".next-button").addEventListener("click", () => {
        // ヘッダー変更
        header.textContent = "数量を選択してください";

        // main領域を数量選択画面に置き換え
            const quantityHtml = `
              <div class="quantity-view">
                <div class="item-info">
                  <div id="itemName" class="item-name"></div>
                  <div id="itemPrice" class="item-price"></div>
                </div>

                <div class="quantity-control">
                  <button id="decreaseBtn"></button>
                  <span id="quantityDisplay">1</span>
                  <button id="increaseBtn"></button>
                </div>

                <div class="action-buttons" id="quantityButtons">
                  <button id="backBtn">もどる</button>
                  <button id="addToCartBtn">注文かごへ追加する</button>
                </div>
              </div>
  `          ;

            main.innerHTML = quantityHtml;

            // code を一時的に <body> に保存（安全に quantity-selector.js へ渡す）
            document.body.dataset.code = code; // ← この1行を追加

            // 数量画面のJSを動かす
            const script = document.createElement("script");
            script.src = "js/quantity-selector.js";
            document.body.appendChild(script);

            // 商品名・価格を表示
            const item = menuData[code];
            document.getElementById("itemName").textContent = item.name;
            document.getElementById("itemPrice").textContent = `${item.price}円`;
          });

    } else {
      // 存在しない or 入力途中 → 元のロゴ画像に戻す
      logoDiv.innerHTML = `<img src="image/logo.jpg" alt="ロゴ" id="logoimg">`;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof menuData !== "undefined") {
    setupMenuInputHandler();
  } else {
    // menuData が未定義なら script の読み込みを監視
    const checkInterval = setInterval(() => {
      if (typeof menuData !== "undefined") {
        clearInterval(checkInterval);
        setupMenuInputHandler();
      }
    }, 50);
  }
});


