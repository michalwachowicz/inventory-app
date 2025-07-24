let openBtn = null;
let openPopup = null;

function focusFirstElement(container) {
  if (!container) return;

  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ];

  const focusable = container.querySelectorAll(focusableSelectors.join(","));
  if (focusable.length) focusable[0].focus();
}

function hidePopup(btn, popup) {
  document.body.style.overflow = "initial";
  popup.classList.add("hidden");
  btn.setAttribute("aria-expanded", false);

  openBtn = null;
  openPopup = null;
  btn.focus();
}

function hidePopupAndFocus(btn, popup) {
  if (btn) btn.focus();
  hidePopup(btn, popup);
}

function setupPopup(btnSelector, popupSelector, closeBtnSelector) {
  const btn = document.querySelector(btnSelector);
  const popup = document.querySelector(popupSelector);

  btn.addEventListener("click", () => {
    if (openPopup && openPopup !== popup) hidePopup(openBtn, openPopup);

    if (!popup.classList.contains("hidden")) {
      hidePopup(btn, popup);
      return;
    }

    document.body.style.overflow = "hidden";
    popup.classList.remove("hidden");
    btn.setAttribute("aria-expanded", true);

    openBtn = btn;
    openPopup = popup;

    const closeBtnElement = document.querySelector(closeBtnSelector);
    if (closeBtnElement) {
      closeBtnElement.addEventListener("click", () => {
        hidePopupAndFocus(openBtn, openPopup);
      });
    }

    focusFirstElement(popup);
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || !openPopup) return;
  hidePopupAndFocus(openBtn, openPopup);
});

document.addEventListener("click", (e) => {
  if (!openPopup) return;

  const content = openPopup.querySelector(".popup");
  const element = content || openPopup;

  if (openBtn.contains(e.target) || element.contains(e.target)) return;

  hidePopupAndFocus(openBtn, openPopup);
});
