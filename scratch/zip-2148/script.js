const header = document.querySelector("[data-header]");
const filters = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll("[data-category]");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 40);
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;

    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    cards.forEach((card) => {
      const visible = category === "all" || card.dataset.category === category;
      card.classList.toggle("hidden", !visible);
    });
  });
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
