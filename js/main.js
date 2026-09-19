(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Lightbox for gallery
  var lb = document.getElementById("lightbox");
  var lbImg = lb && lb.querySelector("img");
  var lbClose = lb && lb.querySelector(".lightbox-close");

  function closeLb() {
    if (!lb) return;
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    if (lbImg) lbImg.src = "";
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (!lb || !lbImg) return;
      lbImg.src = link.getAttribute("href");
      lbImg.alt = link.querySelector("img") ? link.querySelector("img").alt : "";
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
    });
  });

  if (lbClose) lbClose.addEventListener("click", closeLb);
  if (lb) {
    lb.addEventListener("click", function (e) {
      if (e.target === lb) closeLb();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLb();
  });

  // Inquire form → mailto
  var form = document.getElementById("inquire-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.name.value || "").trim();
      var email = (form.email.value || "").trim();
      var interest = (form.interest.value || "").trim();
      var visit = (form.visit.value || "").trim();
      var message = (form.message.value || "").trim();

      if (!name || !email || !message) {
        alert("Please fill in your name, email, and message.");
        return;
      }

      var subject = "Inquiry from " + name + " — Chappell Hill Xolos";
      var body = [
        "Name: " + name,
        "Email: " + email,
        "Interest: " + (interest || "Not specified"),
        "Preferred visit window: " + (visit || "Not specified"),
        "",
        "Message:",
        message,
        "",
        "— Sent from chappellhillxolos website inquire form"
      ].join("\n");

      var mailto =
        "mailto:chappellhillxolos@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;
    });
  }
})();
