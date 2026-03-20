(function initThemeToggle() {
    const toggle = document.querySelector(".ui-switch input[type='checkbox']");
    if (!toggle) return;

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        toggle.checked = true;
        document.body.classList.add("dark");
    }

    toggle.addEventListener("change", () => {
        const isDark = toggle.checked;
        document.body.classList.toggle("dark", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
})();
