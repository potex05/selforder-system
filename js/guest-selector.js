// js/guest-selector.js

function loadGuestSelector() {
  const header = document.querySelector("header");
  const main = document.querySelector("main");
  main.classList.add("guest-main"); // ← この1行を追加


  //  フッターボタンの状態をリセットして、footerButtons[0] に disabled を付ける
  const footerButtons = document.querySelectorAll(".footer-btn");
  footerButtons.forEach(btn => {
    btn.classList.remove("active", "disabled");
    btn.removeAttribute("disabled");
  });
  if (footerButtons.length > 0) {
    footerButtons[0].classList.add("disabled");
    footerButtons[0].setAttribute("disabled", "true");
  }
  if (footerButtons.length > 1) {
    footerButtons[1].classList.add("disabled");
    footerButtons[1].setAttribute("disabled", "true");
  }
  if (footerButtons.length > 2) {
    footerButtons[2].classList.add("disabled");
    footerButtons[2].setAttribute("disabled", "true");
  }
  if (footerButtons.length > 3) {
    footerButtons[3].classList.add("disabled");
    footerButtons[3].setAttribute("disabled", "true");
  }
  if (footerButtons.length > 4) {
    footerButtons[4].classList.add("disabled");
    footerButtons[4].setAttribute("disabled", "true");
  }

  // ヘッダー更新
  header.textContent = "何名様(全員)でご利用ですか？";

  // メインHTMLを動的に組み立て
  main.innerHTML = `
    <div class="guest-selector">
      <div class="keypad-row">
        <button class="guest-key" data-value="1">1人</button>
        <button class="guest-key" data-value="2">2人</button>
        <button class="guest-key" data-value="3">3人</button>
      </div>
      <div class="keypad-row">
        <button class="guest-key" data-value="4">4人</button>
        <button class="guest-key" data-value="5">5人</button>
        <button class="guest-key" data-value="6">6人</button>
      </div>
      <div class="keypad-row">
        <button class="guest-key" data-value="7">7人</button>
        <button class="guest-key" data-value="8">8人</button>
        <button class="guest-key" data-value="9+">9人<br>以上</button>
      </div>
    </div>
  `;

  // イベントバインド
  main.querySelectorAll(".guest-key").forEach(button => {
    button.addEventListener("click", () => {
      const val = button.dataset.value;
      const confirmation = document.createElement("div");
      confirmation.classList.add("confirmation");

      if (val === "9+") {
        confirmation.innerHTML = `
          <div class="custom-input">
            <label>何名様でご利用ですか？</label>
            <input type="number" id="customGuestCount" placeholder="1~999" min="1" max="999" />
          </div>
          <div class="confirmation-buttons">
            <button id="cancelCustom">いいえ</button>
            <button id="confirmCustom">はい</button>
          </div>
        `;

        confirmation.querySelector("#confirmCustom").addEventListener("click", () => {
          const inputVal = parseInt(document.getElementById("customGuestCount").value, 10);
          if (inputVal >= 1 && inputVal <= 999) {
            confirmGuest(inputVal);
          }
        });

        confirmation.querySelector("#cancelCustom").addEventListener("click", () => {
          confirmation.remove();
        });
      } else {
        confirmation.innerHTML = `
          <p>${val}名様でご利用ですね？</p>
          <div class="confirmation-buttons">
            <button id="confirmNo">いいえ</button>
            <button id="confirmYes">はい</button>
          </div>
        `;

        confirmation.querySelector("#confirmYes").addEventListener("click", () => {
          confirmGuest(val.replace("人", ""));
        });

        confirmation.querySelector("#confirmNo").addEventListener("click", () => {
          confirmation.remove();
        });
      }

      // guest-selector に追加
      main.querySelector(".guest-selector").appendChild(confirmation);
    });
  });
}

function confirmGuest(guestCount) {
  console.log(`${guestCount}名で確認されました`);
  loadMainScreen();
}
