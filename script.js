/**
 * Client-side progressive enhancement.
 * Set FORM_ENDPOINT to a real POST endpoint when a backend is available.
 */
const FORM_ENDPOINT = "";

const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

function showFormMessage(message, type) {
  formMessage.className = `alert custom-alert mt-3 ${type}`;
  formMessage.setAttribute("role", type === "alert-danger" ? "alert" : "status");
  formMessage.innerHTML = `<i class="bi ${type === "alert-success" ? "bi-check-circle-fill" : "bi-info-circle-fill"} me-2" aria-hidden="true"></i>${message}`;
  formMessage.focus();
}

function validateField(field) {
  field.classList.toggle("is-invalid", !field.checkValidity());
  field.classList.toggle("is-valid", field.checkValidity());
  return field.checkValidity();
}

if (form) {
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) validateField(field);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = [...form.querySelectorAll("input, select, textarea")];
    const isValid = fields.map(validateField).every(Boolean);

    if (!isValid) {
      showFormMessage("Revisa los campos marcados antes de continuar.", "alert-danger");
      form.querySelector(":invalid")?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    if (!FORM_ENDPOINT) {
      showFormMessage("El formulario está listo. Para recibir mensajes, configura FORM_ENDPOINT en script.js y conecta tu backend.", "alert-success");
      console.info("Formulario validado (sin envío):", data);
      return;
    }

    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Enviando…";
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      fields.forEach((field) => field.classList.remove("is-valid"));
      showFormMessage("Mensaje enviado correctamente. Pronto te responderemos.", "alert-success");
    } catch (error) {
      console.error("No fue posible enviar el formulario:", error);
      showFormMessage("No pudimos enviar el mensaje. Inténtalo de nuevo o escríbenos por correo.", "alert-danger");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Preparar mensaje";
    }
  });
}

document.querySelectorAll(".navbar .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("mainNav");
    if (menu?.classList.contains("show") && window.bootstrap) {
      window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });
});

const carousel = document.getElementById("testimonialsCarousel");
if (carousel && window.bootstrap && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.bootstrap.Carousel.getOrCreateInstance(carousel, { interval: false });
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".navbar .nav-link")];
if ("IntersectionObserver" in window && sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));
}
