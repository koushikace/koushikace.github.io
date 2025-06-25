
// ===== PAGE LOADER =====
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
});

// SCROLL CUE BEHAVIOR
const scrollCue = document.querySelector(".scroll-cue");
if (scrollCue) {
    scrollCue.addEventListener("click", () => {
        const nextSection = document.querySelector("#experience");
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
        }
    });
}

// ===== THEME SWITCHER =====
const toggle = document.getElementById("theme-toggle");
if (toggle) {
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    });
}
