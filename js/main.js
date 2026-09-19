(function () {
  function setImg(el, b64) {
    var url = "data:image/jpeg;base64," + b64;
    if (el.tagName === "IMG") {
      el.src = url;
    } else if (el.classList.contains("page-hero")) {
      var overlay = el.classList.contains("page-hero--home")
        ? "linear-gradient(160deg,rgba(44,24,16,0.55),rgba(92,46,10,0.75))"
        : "linear-gradient(135deg,rgba(139,69,19,0.92),rgba(92,46,10,0.85))";
      el.style.backgroundImage = overlay + ", url('" + url + "')";
    } else {
      el.style.backgroundImage = "url('" + url + "')";
    }
  }

  function loadImages() {
    if (typeof window.CHX_loadImages === "function") {
      window.CHX_loadImages().then(function () {
        // lightbox uses img.src after load; ensure any late nodes covered
        document.querySelectorAll("[data-img]").forEach(function (el) {
          var name = el.getAttribute("data-img");
          if (name && window.CHX_IMG && window.CHX_IMG[name] && el.tagName === "IMG" && !el.getAttribute("src")) {
            el.src = "data:image/jpeg;base64," + window.CHX_IMG[name];
          }
        });
      });
      return;
    }
    document.querySelectorAll("[data-img]").forEach(function (el) {
      var name = el.getAttribute("data-img");
      if (!name) return;
      if (window.CHX_IMG && window.CHX_IMG[name]) {
        setImg(el, window.CHX_IMG[name]);
        return;
      }
      console.warn("missing image", name);
    });
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var lb = document.getElementById("lightbox");
  var lbImg = lb && lb.querySelector("img");
  var lbClose = lb && lb.querySelector(".lightbox-close");
  function closeLb() {
    if (!lb) return;
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    if (lbImg) lbImg.removeAttribute("src");
  }
  document.querySelectorAll("[data-lightbox]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (!lb || !lbImg) return;
      var img = link.querySelector("img");
      lbImg.src = img && img.src ? img.src : "";
      lbImg.alt = img ? img.alt : "";
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
    });
  });
  if (lbClose) lbClose.addEventListener("click", closeLb);
  if (lb) lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLb(); });

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
      window.location.href =
        "mailto:chappellhillxolos@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }

  loadImages();
})();
