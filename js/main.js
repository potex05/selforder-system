//js/main.js

function loadMainScreen() {
  const main = document.querySelector(".main");
  const header = document.querySelector(".header");

  header.textContent = "メニューブックから番号を入力してください";

  main.innerHTML = `
    <div class="logo">
    <img src="image/logo.jpg" alt="ロゴ" id="logoimg">
    </div>
    <input type="number" id="inputField" class="input-field" readonly>

    <div class="keypad">
      <button class="key">1</button>
      <button class="key">2</button>
      <button class="key">3</button>
      <button class="key">4</button>
      <button class="key">5</button>
      <button class="key">6</button>
      <button class="key">7</button>
      <button class="key">8</button>
      <button class="key">9</button>
      <button class="key">0</button>
      <button class="key delete">削除</button>
    </div>
`;


// 追加：confirmItems をグローバルに確実に保持（注文履歴）
if (!window.confirmItems) {
  window.confirmItems = [];
}


const inputField = document.getElementById('inputField');
const keys = document.querySelectorAll('.key');

keys.forEach(key => {
  key.addEventListener('click', () => {
    const value = key.textContent;

    if (value === '削除') {
      inputField.value = inputField.value.slice(0, -1);
    } else {
      if (inputField.value.length < 4) {
        inputField.value += value;
      }
    }

    // ここで input イベントを手動発火（readonlyでも反応するように）
    inputField.dispatchEvent(new Event('input', { bubbles: true }));
  });
 });

  // ← 追加：input イベントを再バインド
  if (typeof setupMenuInputHandler === "function") {
    setupMenuInputHandler();
  }


  //footerbtnに関する処理
  const footerButtons = document.querySelectorAll(".footer-btn");
  // 注文履歴ボタン（3番目）にイベントを追加
  if (footerButtons.length > 2) {
  footerButtons[2].addEventListener("click", showHistoryScreen);
  }
  if (footerButtons.length > 0) {
  footerButtons[0].addEventListener("click", loadMainScreen);
  }
   // footerButtons[4] にお会計確認画面遷移処理を追加
  if (footerButtons.length > 4) {
  footerButtons[4].addEventListener("click", showPaymentScreen);
  }
  if (footerButtons.length > 1) {
  footerButtons[1].addEventListener("click", showConfirmScreen);
  }

  // フッターボタンの状態をリセットして、最初のボタンを active にする
  footerButtons.forEach(btn => {
  btn.classList.remove("active", "disabled");
  btn.removeAttribute("disabled"); 
  });
  
  if (footerButtons.length > 0) {
    footerButtons[0].classList.add("active");
  }
  if (footerButtons.length > 4) {
    footerButtons[4].classList.add("disabled");
    footerButtons[4].setAttribute("disabled", "true");
  }
}

