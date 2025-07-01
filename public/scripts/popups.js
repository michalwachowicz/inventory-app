const popupBtns = [];
const popups = [];

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
  popup.classList.add("hidden");
  btn.setAttribute("aria-expanded", false);
  btn.focus();
}

function setupPopup(btnSelector, popupSelector) {
  const btn = document.querySelector(btnSelector);
  const popup = document.querySelector(popupSelector);
  const content = popup.querySelector(".popup");

  popupBtns.push(btn);
  popups.push(popup);

  btn.addEventListener("click", () => {
    popupBtns.forEach((p) => p.setAttribute("aria-expanded", false));
    popups.forEach((p) => p.classList.add("hidden"));

    popup.classList.remove("hidden");
    btn.setAttribute("aria-expanded", true);

    focusFirstElement(popup);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    hidePopup(btn, popup);
  });

  popup.addEventListener("click", (e) => {
    if (content.contains(e.target)) return;
    hidePopup(btn, popup);
  });
}
