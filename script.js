document.addEventListener("DOMContentLoaded", function () {
  setupMobileNav();
  setupRevealFallback();
  setupCountersAndBars();
  highlightActiveNav();
  loadImpactData();
  setupOptimityContactForm();
  setupAdminInbox();
});

/* =========================
SECTION: MOBILE NAVIGATION
========================= */

function setupMobileNav() {
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");

  if (!mobileToggle || !navLinks) return;

  mobileToggle.addEventListener("click", function () {
    navLinks.classList.toggle("show");
    mobileToggle.textContent = navLinks.classList.contains("show") ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("show");
      mobileToggle.textContent = "☰";
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 700) {
      navLinks.classList.remove("show");
      mobileToggle.textContent = "☰";
    }
  });
}

/* =========================
SECTION: ACTIVE NAV LINK
========================= */

function highlightActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");

    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* =========================
SECTION: REVEAL ANIMATION
========================= */

function setupRevealFallback() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) return;

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(function (el) {
      el.classList.add("visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach(function (el) {
    observer.observe(el);
  });
}

/* =========================
SECTION: COUNTER FORMATTING
========================= */

function formatCounterValue(value) {
  if (value >= 1000) {
    return Number(value).toLocaleString();
  }

  return String(value);
}

/* =========================
SECTION: COUNTER ANIMATION
========================= */

function animateCounter(el) {
  const target = parseInt(el.dataset.counter || "0", 10);
  const duration = 1600;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * easedProgress);

    el.textContent = formatCounterValue(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = formatCounterValue(target);
    }
  }

  requestAnimationFrame(update);
}

/* =========================
SECTION: COUNTERS + BARS
========================= */

function setupCountersAndBars() {
  const revealSections = document.querySelectorAll(".reveal");
  const allCounters = document.querySelectorAll("[data-counter]");

  if (!allCounters.length) return;

  if (!("IntersectionObserver" in window)) {
    runAnimations(document);
    return;
  }

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runAnimations(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  if (revealSections.length) {
    revealSections.forEach(function (section) {
      observer.observe(section);
    });
  } else {
    runAnimations(document);
  }
}

function runAnimations(scope) {
  const counters = scope.querySelectorAll("[data-counter]");

  counters.forEach(function (counter) {
    if (!counter.dataset.started) {
      counter.dataset.started = "true";
      animateCounter(counter);
    }
  });
}

/* =========================
SECTION: LOAD LIVE IMPACT DATA
========================= */

async function loadImpactData() {
  try {
    const response = await fetch(
      "https://ifako-ijaiye-2030.onrender.com/api/public/impact"
    );

    const data = await response.json();

    if (!data.success || !data.impact) return;

    const impact = data.impact;

    const heroYouth = document.getElementById("heroImpactYouth");
    const heroArtisans = document.getElementById("heroImpactArtisans");
    const heroJobs = document.getElementById("heroImpactJobs");
    const heroPartners = document.getElementById("heroImpactPartners");

    const bandYouth = document.getElementById("impactYouth");
    const bandArtisans = document.getElementById("impactArtisans");
    const bandJobs = document.getElementById("impactJobs");
    const bandPartners = document.getElementById("impactPartners");

    if (heroYouth) heroYouth.textContent = Number(impact.youth_total || 0).toLocaleString();
    if (heroArtisans) heroArtisans.textContent = Number(impact.artisan_total || 0).toLocaleString();
    if (heroJobs) heroJobs.textContent = Number(impact.jobs || 0).toLocaleString();
    if (heroPartners) heroPartners.textContent = Number(impact.partner_total || 0).toLocaleString();

    if (bandYouth) bandYouth.textContent = Number(impact.youth_total || 0).toLocaleString();
    if (bandArtisans) bandArtisans.textContent = Number(impact.artisan_total || 0).toLocaleString();
    if (bandJobs) bandJobs.textContent = Number(impact.jobs || 0).toLocaleString();
    if (bandPartners) bandPartners.textContent = Number(impact.partner_total || 0).toLocaleString();
  } catch (error) {
    console.error("Impact API error:", error);
  }
}

/* =========================
SECTION: OPTIMITY CONTACT FORM
========================= */

function setupOptimityContactForm() {
  const contactForm = document.querySelector(".contact-form-v2");

  if (!contactForm) return;

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalText = submitBtn ? submitBtn.textContent : "Send Message";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    const payload = {
      fullName: document.getElementById("fullName")?.value.trim() || "",
      organization: document.getElementById("organization")?.value.trim() || "",
      email: document.getElementById("email")?.value.trim() || "",
      interestArea: document.getElementById("interestArea")?.value.trim() || "",
      message: document.getElementById("message")?.value.trim() || ""
    };

    try {
      const response = await fetch("https://ifako-ijaiye-2030.onrender.com/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      alert(result.message || "Message submitted.");

      if (result.success) {
        contactForm.reset();
      }
    } catch (error) {
      console.error("Optimity contact form error:", error);
      alert("Unable to send message.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}

/* =========================
SECTION: ADMIN INBOX
========================= */

function setupAdminInbox() {
  const adminLoginCard = document.querySelector(".admin-login-card");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const loginNotice = document.getElementById("adminLoginNotice");
  const inboxNotice = document.getElementById("adminInboxNotice");
  const messagesList = document.getElementById("messagesList");
  const searchInput = document.getElementById("messageSearch");
const refreshBtn = document.getElementById("refreshMessagesBtn");
const logoutBtn = document.getElementById("logoutBtn");

  if (!adminLoginForm || !messagesList) return;

  let allMessages = [];

  function showLoginNotice(message) {
    if (loginNotice) {
      loginNotice.textContent = message;
    }
  }

  function showInboxNotice(message) {
    if (inboxNotice) {
      inboxNotice.textContent = message;
    }
  }

  function getStoredToken() {
    return localStorage.getItem("optimity_admin_token") || "";
  }

  function storeToken(token) {
  localStorage.setItem("optimity_admin_token", token);
}

function clearToken() {
  localStorage.removeItem("optimity_admin_token");
}

  function hideLoginCard() {
    if (adminLoginCard) {
      adminLoginCard.style.display = "none";
    }
  }

  function showLoginCard() {
    if (adminLoginCard) {
      adminLoginCard.style.display = "block";
    }
  }

  function renderMessages(messages) {
    if (!messagesList) return;

    if (!messages.length) {
      messagesList.innerHTML = `<div class="empty-state">No messages found.</div>`;
      return;
    }

    messagesList.innerHTML = messages
      .map(function (message) {
        const createdAt = message.created_at
          ? new Date(message.created_at).toLocaleString()
          : "No date";

        return `
          <article class="message-card">
            <div class="message-card-top">
              <div>
                <div class="message-name">${escapeHtml(message.full_name || "No name")}</div>
                <div class="message-meta">
                  <span><strong>Email:</strong> ${escapeHtml(message.email || "")}</span>
                  <span><strong>Organization:</strong> ${escapeHtml(message.organization || "")}</span>
                  <span><strong>Submitted:</strong> ${escapeHtml(createdAt)}</span>
                </div>
              </div>

              <div class="message-interest">
                ${escapeHtml(message.interest_area || "General")}
              </div>
            </div>

            <div class="message-body">${escapeHtml(message.message || "")}</div>
          </article>
        `;
      })
      .join("");
  }

  function filterMessages() {
    const query = (searchInput?.value || "").trim().toLowerCase();

    if (!query) {
      renderMessages(allMessages);
      return;
    }

    const filtered = allMessages.filter(function (message) {
      return (
        String(message.full_name || "").toLowerCase().includes(query) ||
        String(message.email || "").toLowerCase().includes(query) ||
        String(message.organization || "").toLowerCase().includes(query) ||
        String(message.interest_area || "").toLowerCase().includes(query) ||
        String(message.message || "").toLowerCase().includes(query)
      );
    });

    renderMessages(filtered);
  }

  async function loadMessages() {
    const token = getStoredToken();

    if (!token) {
      showLoginCard();
      showInboxNotice("Please login first.");
      return;
    }

    showInboxNotice("Loading messages...");

    try {
      const response = await fetch("https://ifako-ijaiye-2030.onrender.com/api/admin/contact-messages", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showLoginCard();
        showInboxNotice(result.message || "Failed to load messages.");
        return;
      }

      hideLoginCard();
      allMessages = result.messages || [];
      renderMessages(allMessages);
      showInboxNotice(`Loaded ${allMessages.length} message(s).`);
    } catch (error) {
      console.error("Admin inbox error:", error);
      showInboxNotice("Unable to load messages.");
    }
  }

  adminLoginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("adminEmail")?.value.trim() || "";
    const password = document.getElementById("adminPassword")?.value.trim() || "";

    showLoginNotice("Signing in...");

    try {
      const response = await fetch("https://ifako-ijaiye-2030.onrender.com/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showLoginNotice(result.message || "Login failed.");
        return;
      }

      storeToken(result.token);
      showLoginNotice("Login successful.");
      hideLoginCard();
      loadMessages();
    } catch (error) {
      console.error("Admin login error:", error);
      showLoginNotice("Unable to login.");
    }
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterMessages);
  }

 if (refreshBtn) {
  refreshBtn.addEventListener("click", loadMessages);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    clearToken();
    allMessages = [];
    showLoginCard();
    showLoginNotice("Logged out successfully.");
    showInboxNotice("Please login first.");
    messagesList.innerHTML = `<div class="empty-state">No messages found.</div>`;

    const adminEmail = document.getElementById("adminEmail");
    const adminPassword = document.getElementById("adminPassword");

    if (adminEmail) adminEmail.value = "";
    if (adminPassword) adminPassword.value = "";
  });
}

if (getStoredToken()) {
  hideLoginCard();
  loadMessages();
}

/* =========================
SECTION: HTML ESCAPE
========================= */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}}