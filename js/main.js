(function () {
  const cfg = window.PORTFOLIO || {};

  function setupNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("menu");
    const header = document.querySelector(".header");
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    }

    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    window.addEventListener("scroll", function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }, { passive: true });
  }

  function setupActiveSection() {
    const links = Array.from(document.querySelectorAll(".nav a"));
    const sections = links
      .map(function (link) {
        const id = link.getAttribute("href");
        return id && id.startsWith("#") ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = "#" + entry.target.id;
        links.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === id);
        });
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function setupEmail() {
    const email = (cfg.email || "").trim();
    if (!email) return;
    document.querySelectorAll(".js-email").forEach(function (el) {
      el.hidden = false;
      el.classList.remove("is-hidden");
      el.setAttribute("href", "mailto:" + email);
      el.textContent = "E-mail";
    });
  }

  function setupGithubStats() {
    const user = cfg.githubUser || "LucasConfortini";
    fetch("https://api.github.com/users/" + user)
      .then(function (res) {
        if (!res.ok) throw new Error("github");
        return res.json();
      })
      .then(function (data) {
        const repos = document.querySelector('[data-gh="repos"]');
        const followers = document.querySelector('[data-gh="followers"]');
        if (repos && typeof data.public_repos === "number") repos.textContent = String(data.public_repos);
        if (followers && typeof data.followers === "number") followers.textContent = String(data.followers);
      })
      .catch(function () {
        /* mantém os valores estáticos */
      });
  }

  function setupCanonical() {
    if (!cfg.domain) return;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", cfg.domain);
    let og = document.querySelector('meta[property="og:url"]');
    if (!og) {
      og = document.createElement("meta");
      og.setAttribute("property", "og:url");
      document.head.appendChild(og);
    }
    og.setAttribute("content", cfg.domain);
  }

  setupNav();
  setupActiveSection();
  setupEmail();
  setupGithubStats();
  setupCanonical();
})();
