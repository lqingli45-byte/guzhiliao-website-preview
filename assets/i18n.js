(function () {
  var KEY = "guzhiliao-lang";
  var FLAG = "guzhiliao-lang-redirected";
  var pairs = {
    "index.html": "en/index.html",
    "products.html": "en/products.html",
    "product-gongdu-workshop.html": "en/product-read-aloud-workshop.html",
    "about.html": "en/about.html",
    "contact.html": "en/contact.html",
    "privacy.html": "en/privacy.html",
    "terms.html": "en/terms.html",
    "refund.html": "en/refund.html",
    "404.html": "en/index.html",
    "en/index.html": "index.html",
    "en/products.html": "products.html",
    "en/product-read-aloud-workshop.html": "product-gongdu-workshop.html",
    "en/about.html": "about.html",
    "en/contact.html": "contact.html",
    "en/privacy.html": "privacy.html",
    "en/terms.html": "terms.html",
    "en/refund.html": "refund.html"
  };

  function repoPrefix() {
    var path = location.pathname || "";
    if ((location.hostname || "").indexOf("github.io") !== -1) {
      var seg = path.split("/").filter(Boolean)[0];
      if (seg) return "/" + seg + "/";
    }
    return "";
  }

  function pageKey() {
    var path = location.pathname || "";
    var prefix = repoPrefix();
    if (prefix && path.indexOf(prefix) === 0) path = path.slice(prefix.length);
    else if (prefix) {
      var bare = prefix.replace(/\/$/, "");
      if (path === bare) path = "/";
    }
    path = path.replace(/^\/+/, "");
    if (!path || path.endsWith("/")) path += "index.html";
    return path;
  }

  function currentLang() {
    return pageKey().indexOf("en/") === 0 ? "en" : "zh";
  }

  function urlFor(lang) {
    var key = pageKey();
    var dest = key;
    if (lang === "en" && key.indexOf("en/") !== 0) dest = pairs[key] || "en/index.html";
    if (lang === "zh" && key.indexOf("en/") === 0) dest = pairs[key] || "index.html";
    var prefix = repoPrefix();
    if (prefix) return prefix + dest;
    return dest;
  }

  function browserLang() {
    var lang = String(navigator.language || navigator.userLanguage || "zh").toLowerCase();
    return lang.indexOf("zh") === 0 ? "zh" : "en";
  }

  document.querySelectorAll(".lang-toggle a[data-lang]").forEach(function (link) {
    link.addEventListener("click", function () {
      try { localStorage.setItem(KEY, link.getAttribute("data-lang")); } catch (e) {}
    });
  });

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var current = currentLang();
  var wanted = saved;
  if (!wanted) {
    var key = pageKey();
    if (key === "index.html" || key === "en/index.html") wanted = browserLang();
    else wanted = current;
  }
  if (wanted !== current) {
    var already = false;
    try { already = sessionStorage.getItem(FLAG) === "1"; } catch (e) {}
    if (!already) {
      try { sessionStorage.setItem(FLAG, "1"); } catch (e) {}
      location.replace(urlFor(wanted));
    }
  }
})();
