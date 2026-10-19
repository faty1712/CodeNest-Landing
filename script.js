const FORM_ENDPOINT = "https://formspree.io/f/xdeajylq";

const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

function showFormMessage(message, type) {
  formMessage.className = `alert custom-alert mt-3 ${type}`;
  formMessage.setAttribute("role", type === "alert-danger" ? "alert" : "status");
  formMessage.setAttribute("aria-live", type === "alert-danger" ? "assertive" : "polite");
  formMessage.classList.remove("d-none");
  const icon = document.createElement("i");
  icon.className = `bi ${type === "alert-success" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"} me-2`;
  icon.setAttribute("aria-hidden", "true");
  formMessage.replaceChildren(icon, document.createTextNode(message));
  formMessage.focus();
}

function validateField(field) {
  const trimmedLength = field.value.trim().length;
  const minimumLength = Number(field.minLength);
  let customError = "";

  if (field.id === "name" || field.id === "message") {
    if (trimmedLength < minimumLength) {
      customError = `Escribe al menos ${minimumLength} caracteres.`;
    }
  }

  field.setCustomValidity(customError);
  const isValid = field.checkValidity();
  field.classList.toggle("is-invalid", !isValid);
  field.classList.toggle("is-valid", isValid && trimmedLength > 0);

  const feedback = document.getElementById(field.getAttribute("aria-describedby"));
  field.setAttribute("aria-invalid", String(!isValid));
  if (feedback) {
    if (isValid) {
      feedback.textContent = field.dataset.defaultFeedback;
    } else if (field.validity.valueMissing) {
      feedback.textContent = "Completa este campo.";
    } else if (field.id === "email") {
      feedback.textContent = "Introduce un correo electrónico válido.";
    } else if (field.validity.tooLong) {
      feedback.textContent = `Usa un máximo de ${field.maxLength} caracteres.`;
    } else if (customError) {
      feedback.textContent = `Escribe entre ${minimumLength} y ${field.maxLength} caracteres.`;
    }
  }

  return isValid;
}

if (form) {
  const fields = [...form.querySelectorAll("[data-validate]")];
  const submitButton = form.querySelector("button[type='submit']");

  fields.forEach((field) => {
    const feedback = document.getElementById(field.getAttribute("aria-describedby"));
    field.dataset.defaultFeedback = feedback?.textContent ?? "";
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      formMessage.classList.add("d-none");
      if (field.classList.contains("is-invalid")) validateField(field);
    });
    field.addEventListener("change", () => {
      formMessage.classList.add("d-none");
      if (field.classList.contains("is-invalid")) validateField(field);
    });
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const isValid = fields.map(validateField).every(Boolean);

    if (!isValid) {
      showFormMessage("Revisa los campos marcados antes de continuar.", "alert-danger");
      form.querySelector(":invalid")?.focus();
      return;
    }

    if (form.elements.namedItem("_gotcha")?.value) {
      form.reset();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Enviando…";
    try {
      const data = new FormData(form);
      fields.forEach((field) => data.set(field.name, field.value.trim()));
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      let result = {};
      try {
        result = await response.json();
      } catch (error) {
        if (!response.ok) throw error;
      }
      if (!response.ok) {
        const errorMessage = result.errors?.map((item) => item.message).join(" ") || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      form.reset();
      fields.forEach((field) => field.classList.remove("is-valid"));
      showFormMessage("Mensaje enviado correctamente. Pronto te responderemos.", "alert-success");
    } catch (error) {
      console.error("No fue posible enviar el formulario:", error);
      showFormMessage("No pudimos enviar el mensaje. Inténtalo de nuevo o escríbenos por correo.", "alert-danger");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar mensaje";
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
