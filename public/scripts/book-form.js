function setupTextarea() {
  const textarea = document.querySelector("#description");

  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });

  textarea.value = textarea.value.trim();
}

function setupBookFetcher() {
  const fetchButton = document.querySelector("#btn-book-fetch");

  fetchButton.addEventListener("click", async (e) => {
    const isbn = document.querySelector("#isbn").value.trim();

    if (!isbn) {
      alert("Please enter an ISBN.");
      return;
    }

    fetchButton.disabled = true;
    fetchButton.textContent = "Fetching...";

    try {
      const res = await fetch(`/api/book/${isbn}`);
      if (!res.ok) throw new Error("Failed to fetch book data.");

      const data = await res.json();

      document.querySelector("#title").value = data.title || "";
      document.querySelector("#author").value =
        data.author_id !== -1 ? data.author_id : "";
      document.querySelector("#year").value =
        data.publication_year !== -1 ? data.publication_year : "";
      document.querySelector("#pages").value =
        data.pages !== -1 ? data.pages : "";
      // TODO: Add cover image
    } catch (err) {
      alert("Failed to fetch book data.");
      console.error(err);
    } finally {
      fetchButton.disabled = false;
      fetchButton.textContent = "Fetch";
    }
  });
}

setupTextarea();
setupBookFetcher();
