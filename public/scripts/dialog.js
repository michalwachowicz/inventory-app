const dialogs = [];

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
  if (focusable.length) {
    focusable[0].focus();
  }
}

function hideDialog(btn, dialog) {
  dialog.classList.add("hidden");
  btn.focus();
}

function setupDialog(btnSelector, dialogSelector) {
  const btn = document.querySelector(btnSelector);
  const dialog = document.querySelector(dialogSelector);
  const backdrop = dialog.querySelector(".dialog__backdrop");

  dialogs.push(dialog);

  btn.addEventListener("click", () => {
    dialogs.forEach((d) => d.classList.add("hidden"));

    dialog.classList.remove("hidden");
    focusFirstElement(dialog);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    hideDialog(btn, dialog);
  });

  backdrop.addEventListener("click", () => {
    hideDialog(btn, dialog);
  });
}
