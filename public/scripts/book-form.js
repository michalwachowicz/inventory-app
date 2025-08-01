function setupTextarea() {
  const textarea = document.querySelector("#description");

  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });

  textarea.value = textarea.value.trim();
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

function setupBookFetcher() {
  const fetchButton = document.querySelector("#btn-book-fetch");
  if (!fetchButton) return;

  const isbnErrorElement = document.querySelector("#error-isbn");

  fetchButton.addEventListener("click", async () => {
    const isbn = document.querySelector("#isbn").value.trim();

    if (!isbn) {
      isbnErrorElement.textContent = "Please enter the ISBN before fetching";
      return;
    }

    fetchButton.disabled = true;
    fetchButton.textContent = "Fetching...";

    try {
      const res = await fetch(`/api/book/${isbn}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Unknown server error");

      document.querySelector("#title").value = data.title || "";
      document.querySelector("#author_id").value =
        data.author_id !== -1 ? data.author_id : "";
      document.querySelector("#publication_year").value =
        data.publication_year !== -1 ? data.publication_year : "";
      document.querySelector("#pages").value =
        data.pages !== -1 ? data.pages : "";
      document.querySelector("#cover").value = data.cover || "";
    } catch (err) {
      isbnErrorElement.textContent = err.message;
      console.error(err);
    } finally {
      fetchButton.disabled = false;
      fetchButton.textContent = "Fetch";
    }
  });
}

function setupTooltip() {
  const tooltip = document.getElementById("tooltip");
  const tooltipBtn = document.getElementById("tooltip-btn");
  const tooltipContent = document.getElementById("tooltip-desc");

  let isTriggerHovered = false;
  let isTooltipHovered = false;
  let hasBeenTriggered = false;

  function showTooltip() {
    tooltip.classList.add("tooltip--show");
  }

  function hideTooltip() {
    tooltip.classList.remove("tooltip--show");
    hasBeenTriggered = false;
  }

  function updateTooltipVisibility() {
    const activeEl = document.activeElement;
    const isFocusInside =
      tooltipBtn.contains(activeEl) || tooltipContent.contains(activeEl);

    if (
      (isTriggerHovered || isTooltipHovered || isFocusInside) &&
      hasBeenTriggered
    ) {
      showTooltip();
    } else {
      hideTooltip();
    }
  }

  tooltipBtn.addEventListener("mouseenter", () => {
    isTriggerHovered = true;
    hasBeenTriggered = true;
    updateTooltipVisibility();
  });

  tooltipBtn.addEventListener("mouseleave", () => {
    isTriggerHovered = false;
    setTimeout(updateTooltipVisibility, 100);
  });

  tooltipBtn.addEventListener("focusin", () => {
    hasBeenTriggered = true;
    updateTooltipVisibility();
  });

  tooltipBtn.addEventListener("focusout", () => {
    setTimeout(updateTooltipVisibility, 100);
  });

  tooltipContent.addEventListener("mouseenter", () => {
    if (!hasBeenTriggered) return;
    isTooltipHovered = true;
    updateTooltipVisibility();
  });

  tooltipContent.addEventListener("mouseleave", () => {
    isTooltipHovered = false;
    setTimeout(updateTooltipVisibility, 100);
  });

  tooltipContent.addEventListener("focusin", () => {
    showTooltip();
  });

  tooltipContent.addEventListener("focusout", () => {
    setTimeout(updateTooltipVisibility, 100);
  });
}

setupTextarea();
setupBookFetcher();
setupTooltip();
