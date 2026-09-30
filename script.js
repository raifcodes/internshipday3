document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // Mobile navigation
  // -----------------------------
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // -----------------------------
  // Theme toggle with localStorage
  // -----------------------------
  const themeButton = document.getElementById("themeButton");
  const themeIcon = document.getElementById("themeIcon");

  const savedTheme = localStorage.getItem("raif-theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  updateThemeIcon();

  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const theme = document.body.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("raif-theme", theme);
    updateThemeIcon();
    showToast(`${theme === "light" ? "Light" : "Dark"} appearance enabled`);
  });

  function updateThemeIcon() {
    themeIcon.textContent = document.body.classList.contains("light") ? "☾" : "☼";
  }

  // -----------------------------
  // Live clock
  // -----------------------------
  const liveClock = document.getElementById("liveClock");

  function updateClock() {
    liveClock.textContent = new Intl.DateTimeFormat([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date());
  }

  updateClock();
  setInterval(updateClock, 1000);

  // -----------------------------
  // Interaction counter
  // -----------------------------
  const counterButton = document.getElementById("counterButton");
  const counterValue = document.getElementById("counterValue");
  let count = 0;

  counterButton.addEventListener("click", () => {
    count += 1;
    counterValue.textContent = count;

    counterValue.animate(
      [
        { transform: "scale(1)", opacity: 0.7 },
        { transform: "scale(1.16)", opacity: 1 },
        { transform: "scale(1)", opacity: 1 }
      ],
      { duration: 260, easing: "ease-out" }
    );

    if (count % 5 === 0) {
      showToast(`Nice — ${count} interactions recorded.`);
    }
  });

  // -----------------------------
  // Toast notifications
  // -----------------------------
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  let toastTimer;

  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  document.getElementById("notifyButton").addEventListener("click", () => {
    showToast("JavaScript event handled successfully.");
  });

  // -----------------------------
  // Form validation
  // -----------------------------
  const form = document.getElementById("contactForm");
  const successBox = document.getElementById("formSuccess");

  const fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("nameError"),
      validate(value) {
        return value.trim().length >= 2
          ? ""
          : "Please enter at least 2 characters.";
      }
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("emailError"),
      validate(value) {
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
        return validEmail ? "" : "Please enter a valid email address.";
      }
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("messageError"),
      validate(value) {
        return value.trim().length >= 10
          ? ""
          : "Message should contain at least 10 characters.";
      }
    }
  };

  Object.values(fields).forEach(({ input, error, validate }) => {
    input.addEventListener("input", () => {
      const message = validate(input.value);
      error.textContent = message;
      input.classList.toggle("invalid", Boolean(message));
      successBox.classList.remove("show");
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let formIsValid = true;

    Object.values(fields).forEach(({ input, error, validate }) => {
      const message = validate(input.value);
      error.textContent = message;
      input.classList.toggle("invalid", Boolean(message));

      if (message) {
        formIsValid = false;
      }
    });

    if (!formIsValid) {
      showToast("Please fix the highlighted fields.");
      return;
    }

    successBox.classList.add("show");
    showToast("Form validated — interaction complete.");
    form.reset();

    Object.values(fields).forEach(({ input }) => {
      input.classList.remove("invalid");
    });
  });

  // -----------------------------
  // Scroll reveal using IntersectionObserver
  // -----------------------------
  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observerInstance.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
});
