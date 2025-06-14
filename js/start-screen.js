//js/start-screen.js

let originalFooterHTML;

document.addEventListener("DOMContentLoaded", () => {
  // 初期描画前の要素取得
  const header = document.querySelector("header");
  const main = document.querySelector("main");
  const footer = document.querySelector("footer");


  // 最初だけ元のfooterを保存（上書き防止）
  if (!originalFooterHTML) {
    originalFooterHTML = footer.innerHTML;
  }


  // ヘッダー書き換え
  header.textContent = "いらっしゃいませ";
  // メインはスタート画面から
  main.innerHTML = `
    <div class="start-screen">
      <div class="language">
        <img src="image/earth.svg" alt="地球アイコン" class="earth-icon" />
        <div class="language-text">Language</div>
      </div>

      <div class="start-logo">
        <img src="image/logo-top.jpg" alt="ロゴ" class="start-logo-img" />
      </div>

      <div class="start-button-wrapper">
        <button id="startOrderBtn" class="start-order-btn">注文を始める</button>
      </div>
    </div>
  `;

  // フッター書き換え（copyright のみ）
  footer.innerHTML = `<div class="copyright">© 2025 selforder-system</div>`;

  // 「注文を始める」ボタン処理
  document.getElementById("startOrderBtn").addEventListener("click", () => {
    // 元の footer に戻す（←ここが重要！）
    footer.innerHTML = originalFooterHTML;

    // メイン画面の初期化
    if (typeof loadGuestSelector === "function") {
      loadGuestSelector();
    } else if (typeof loadMainScreen === "function") {
      loadMainScreen(); // fallback
    }
  });
});