const deleteDialog = document.querySelector("#delete-dialog");
const formElement = deleteDialog.querySelector("form");
const passwordElement = deleteDialog.querySelector("#del_secret_password");

let deleteSuccessRoute = "";

function setupDeleteDialog(action, deleteRoute, title, description) {
  const titleElement = deleteDialog.querySelector(".dialog__title");
  const descriptionElement = deleteDialog.querySelector(".dialog__description");

  formElement.action = action;
  titleElement.textContent = title;
  descriptionElement.textContent = description;
  deleteSuccessRoute = deleteRoute;
}

formElement.addEventListener("submit", async (e) => {
  e.preventDefault();

  const action = e.target.action;

  try {
    const res = await fetch(action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret_password: passwordElement.value }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Unknown server error");

    window.location.replace(deleteSuccessRoute);
  } catch (error) {
    console.error(error);
    document.querySelector("#del_secret_password_error").textContent =
      error.message;
  }
});
