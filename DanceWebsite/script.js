// Mobile menu toggle
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  toggle.setAttribute("aria-expanded", isOpen);
});

// Close the mobile menu after a link is tapped
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

// Contact form: show a friendly thank-you (no backend yet)
const form = document.getElementById("contact-form");
const success = document.getElementById("form-success");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  success.hidden = false;
  form.reset();
});

// Free workshop popup: opens after the visitor has been on the page for 10 seconds.
// It shows once per browser session, and not again after the visitor signs up.
const popup = document.getElementById("workshop-popup");
const workshopForm = document.getElementById("workshop-form");
const workshopSuccess = document.getElementById("workshop-success");
const POPUP_DELAY_MS = 10000;

function storageGet(store, key) {
  try { return store.getItem(key); } catch { return null; }
}
function storageSet(store, key, value) {
  try { store.setItem(key, value); } catch { /* storage unavailable */ }
}

// Visiting the page with ?popup in the URL resets the "already seen/registered" flags
// so the popup shows again after the usual 10 seconds (handy for previewing it).
if (new URLSearchParams(location.search).has("popup")) {
  try { localStorage.removeItem("workshopRegistered"); } catch { /* storage unavailable */ }
  try { sessionStorage.removeItem("workshopPopupShown"); } catch { /* storage unavailable */ }
}

if (!storageGet(localStorage, "workshopRegistered") && !storageGet(sessionStorage, "workshopPopupShown")) {
  setTimeout(() => {
    popup.showModal();
    storageSet(sessionStorage, "workshopPopupShown", "1");
  }, POPUP_DELAY_MS);
}

document.getElementById("workshop-later").addEventListener("click", () => popup.close());
document.getElementById("workshop-close").addEventListener("click", () => popup.close());

workshopForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = workshopForm.elements.name.value.trim();
  storageSet(localStorage, "workshopRegistered", "1");
  workshopForm.hidden = true;
  workshopSuccess.textContent =
    `🎉 Thank you, ${name}! You're on the list. See you at Ang Mo Kio CC on Friday at 7 PM!`;
  workshopSuccess.hidden = false;
  setTimeout(() => popup.close(), 4000);
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
