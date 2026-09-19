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

  window.CHX_IMG = window.CHX_IMG || {};

  function loadOne(name, parts) {
    var fetches = [];
    for (var i = 0; i < parts; i++) {
      fetches.push(
        fetch("js/imgdata/" + name.replace(/\.jpg$/, "") + ".part" + i + ".b64").then(function (r) {
          if (!r.ok) throw new Error("missing " + r.url);
          return r.text();
        })
      );
    }
    return Promise.all(fetches).then(function (chunks) {
      var b64 = chunks.join("").replace(/\s+/g, "");
      window.CHX_IMG[name] = b64;
      document.querySelectorAll('[data-img="' + name + '"]').forEach(function (el) {
        setImg(el, b64);
      });
      return b64;
    });
  }

  window.CHX_loadImages = function () {
    return fetch("js/imgdata/manifest.json")
      .then(function (r) { return r.json(); })
      .then(function (manifest) {
        var needed = {};
        document.querySelectorAll("[data-img]").forEach(function (el) {
          var name = el.getAttribute("data-img");
          if (name && manifest[name]) needed[name] = manifest[name].parts;
        });
        return Promise.all(
          Object.keys(needed).map(function (name) {
            return loadOne(name, needed[name]).catch(function (err) {
              console.warn(err);
            });
          })
        );
      });
  };
})();
