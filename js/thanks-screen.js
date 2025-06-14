// js/thanks-screen.js

function showThanksScreen() {
  const header = document.querySelector(".header");
  const main = document.querySelector(".main");

  // ヘッダー更新
  header.textContent = 'ご注文ありがとうございます';

  // メイン内容を注文完了画面に差し替え
  main.innerHTML = `
    <div class="thanks-message">
      <p>お水・おしぼりはドリンクカウンターにてセルフサービスでお取りください。</p>
      <p>ドリンクバー注文のお客様はドリンクカウンターでドリンクをお取りください。</p>
    </div>
  `;

  // フッターボタンの状態をリセットして、footerButtons[1]を disabled にする
  const footerButtons = document.querySelectorAll(".footer-btn");
  footerButtons.forEach(btn => {
    btn.classList.remove("active", "disabled");
    btn.removeAttribute("disabled");
  });
  if (footerButtons.length > 1) {
    footerButtons[1].classList.add("disabled");
    footerButtons[1].setAttribute("disabled", "true");
  }
}