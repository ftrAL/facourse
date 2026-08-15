(function () {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("facourse-theme");
  const preferredDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  function setTheme(theme) {
    root.setAttribute("data-bs-theme", theme);

    themeToggle.textContent = theme === "dark" ? "☀" : "☾";

    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap",
    );

    localStorage.setItem("facourse-theme", theme);
  }

  setTheme(savedTheme || (preferredDark ? "dark" : "light"));

  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-bs-theme");

    setTheme(currentTheme === "dark" ? "light" : "dark");
  });

  const filterButtons = [...document.querySelectorAll(".filter-btn")];

  const courseItems = [...document.querySelectorAll(".course-item")];

  const courseSearch = document.getElementById("courseSearch");
  const searchForm = document.getElementById("searchForm");
  const emptyState = document.getElementById("emptyState");
  const searchStatus = document.getElementById("searchStatus");

  let activeFilter = "all";

  function filterCourses() {
    const query = courseSearch.value.trim().toLowerCase();

    let visible = 0;

    courseItems.forEach((item) => {
      const matchesLevel =
        activeFilter === "all" || item.dataset.level === activeFilter;

      const matchesSearch =
        !query ||
        item.dataset.search.includes(query) ||
        item.textContent.toLowerCase().includes(query);

      const show = matchesLevel && matchesSearch;

      item.hidden = !show;

      if (show) {
        visible += 1;
      }
    });

    emptyState.hidden = visible !== 0;

    searchStatus.textContent = query
      ? `${visible} kelas cocok dengan “${courseSearch.value.trim()}”.`
      : "";
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      filterCourses();
    });
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    filterCourses();

    document.getElementById("kelas").scrollIntoView();
  });

  courseSearch.addEventListener("input", filterCourses);

  const quizForm = document.getElementById("quizForm");
  const feedback = document.getElementById("quizFeedback");

  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const selected = quizForm.querySelector('input[name="answer"]:checked');

    feedback.hidden = false;
    feedback.className = "quiz-feedback";

    if (!selected) {
      feedback.classList.add("wrong");

      feedback.textContent = "Pilih salah satu jawaban terlebih dahulu.";
    } else if (selected.value === "nav") {
      feedback.classList.add("correct");

      feedback.textContent =
        "Benar! <nav> menjelaskan area navigasi utama secara semantik.";
    } else {
      feedback.classList.add("wrong");

      feedback.textContent =
        "Belum tepat. Jawaban yang benar adalah <nav> karena elemen ini khusus untuk kumpulan tautan navigasi.";
    }
  });
})();
