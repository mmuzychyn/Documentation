let fileMD = "";
const content = document.querySelector("#content");
let onceLoaded_index = false;

if (!onceLoaded_index) {
  loadPage("_index");
  onceLoaded_index = true;
}

document.addEventListener("DOMContentLoaded", () => {});

function loadPage(target) {
  fetch(`Pages/${target}.md`)
    .then(response => response.text())
    .then(data => {
      fileMD = data;
      let html_index = marked.parse(fileMD);

      document.querySelector("nav>ul").innerHTML = '';

      const replacements = [
        { regex: /<h1>/g, replacement: '<li><a href="#">' },
        { regex: /<\/h1>/g, replacement: '</a></li>' },
        { regex: /<h4>/g, replacement: '<li class="module">' },
        { regex: /<h2>/g, replacement: '<li><a href="#">' },
        { regex: /<\/h2>/g, replacement: '</a></li>' },
        { regex: /<details>/g, replacement: '<li><details open>' },
        { regex: /<\/summary>/g, replacement: '</summary><ul>' },
        { regex: /<\/details>/g, replacement: '</ul></details></li>' }
      ];

      replacements.forEach(({ regex, replacement }) => {
        html_index = html_index.replace(regex, replacement);
      });

      document.querySelector("nav>ul").innerHTML = html_index;

      document.querySelectorAll("nav>ul li").forEach((li, index) => {
        if (index === 0) li.classList.add("active");

        let target;
        const aTag = li.querySelector("a");

        if (li.parentElement.parentElement.tagName === "DETAILS" && li.parentElement.tagName !== "SUMMARY") {
          aTag.href = `#${li.parentElement.parentElement.querySelector("summary").innerText}/${aTag.innerText}`;
          target = aTag.href.split("#")[1] + "/" + aTag.href.split("#")[2];
        } else if (aTag) {
          aTag.href = `#${aTag.innerText}`;
          target = aTag.innerText;
        }

        li.addEventListener("click", function (event) {
          event.stopPropagation();
          let target = this.querySelector("a").href.split("#")[1];
          const oldTarget = target;

          const moduleName = findPreviousModule(this)?.innerText.split(":")[0];
          if (moduleName && decodeURI(target.split("/")[0]) !== moduleName) {
            target = `${moduleName}/${target}`;
          }

          const parentNav = this.parentElement.parentElement.parentElement;
          const parentModuleName = findPreviousModule(parentNav)?.innerText.split(":")[0];
          if (oldTarget === target && parentModuleName && decodeURI(target.split("/")[0]) !== parentModuleName) {
            target = `${parentModuleName}/${target}`;
          }

          this.querySelector("a").href = `#${target}`;

          fetch(`Pages/${target}.md`)
            .then(response => response.text())
            .then(data => {
              fileMD = data;
              setupPage(target);
              setupNavSidebar();
            });
        });
      });
    });
}

function findPreviousModule(element) {
  let previousElement = element.previousElementSibling;
  while (previousElement) {
    if (previousElement.classList.contains("module")) {
      return previousElement;
    }
    previousElement = previousElement.previousElementSibling;
  }
  return null;
}

function urlSeter() {
  let targetPage;
  const url = window.location.href;
  let target = url.split("#")[1] || document.querySelector("nav>ul>li>a").innerText;
  target = decodeURI(target).split("/");

  switch (target.length) {
    case 1:
      targetPage = target[0];
      break;
    case 2:
      targetPage = `${target[0]}/${target[1]}`;
      break;
    default:
      targetPage = target;
  }

  fetch(`Pages/${targetPage}.md`)
    .then(response => response.text())
    .then(data => {
      fileMD = data;
      setupPage(targetPage);
      setupNavSidebar();
    });
}

function changeActiveNav(target) {
  document.querySelectorAll("nav>ul>li").forEach(li => li.classList.remove("active"));
  target.classList.add("active");
}

function setupPage(targetPage) {
  if (targetPage) {
    const targetElement = Array.from(document.querySelectorAll("nav>ul>li>a")).find(a => a.innerText.includes(targetPage));
    if (targetElement) {
      changeActiveNav(targetElement.parentElement);
    }
  }

  const htmlContent = marked.parse(fileMD);
  document.getElementById("content").innerHTML = htmlContent;

  document.querySelectorAll("pre code").forEach(block => hljs.highlightElement(block));

  addCopyButtons();
  initializeTabs();
  initializeHints();
  renderMathInElement(content);
}

function addCopyButtons() {
  document.querySelectorAll("pre").forEach(pre => {
    const button = document.createElement("button");
    button.className = "copy-button";
    button.innerText = "Kopiuj";
    button.addEventListener("click", () => {
      const code = pre.querySelector("code").innerText;
      navigator.clipboard.writeText(code).then(() => {
        button.innerText = "Skopiowano!";
        setTimeout(() => {
          button.innerText = "Kopiuj";
        }, 1000);
      });
    });
    pre.insertBefore(button, pre.firstChild);
  });
}

function initializeTabs() {
  document.querySelectorAll("[data-tabs]").forEach(tabContainer => {
    const tabs = tabContainer.querySelector(".tabs");
    const tabButtons = tabs.querySelectorAll("b");
    const tabContents = tabContainer.querySelectorAll("div:not(.tabs)");

    tabButtons.forEach((tabButton, index) => {
      tabButton.addEventListener("click", () => {
        tabButtons.forEach(btn => btn.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));

        tabButton.classList.add("active");
        tabContents[index].classList.add("active");
      });
    });
  });
}

function initializeHints() {
  document.querySelectorAll("[data-hint]").forEach(hint => {
    const hintType = hint.getAttribute("data-hint");
    hint.classList.add(`hint-${hintType}`);
  });
}

function setupNavSidebar() {
  const navS_ul = document.querySelector("nav.sidebar ul");
  navS_ul.innerHTML = '';
  const headers = document.querySelectorAll("#content > h1, #content > h2, #content > h3");

  headers.forEach((header, index) => {
    header.id = `header-${index}`;
    const li = document.createElement("li");

    if (header.tagName === "H2") li.classList.add("indent-h2");
    else if (header.tagName === "H3") li.classList.add("indent-h3");

    li.innerHTML = `<a href="#${header.id}">${header.innerText}</a>`;
    if (index === 0) li.classList.add("active");
    navS_ul.appendChild(li);
  });

  const sections = document.querySelectorAll("#content > h1, #content > h2, #content > h3");
  const navLi = document.querySelectorAll("nav.sidebar ul li");
  let isScrolling = false;

  function scrollToSection(id) {
    const section = document.querySelector(id);
    const offsetTop = section.offsetTop - 60;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth"
    });
  }

  navLi.forEach(li => {
    li.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.querySelector("a").getAttribute("href");
      isScrolling = true;
      scrollToSection(targetId);

      navLi.forEach(li => li.classList.remove("active"));
      this.classList.add("active");

      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    });
  });

  window.addEventListener("scroll", () => {
    if (isScrolling) return;

    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 60;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLi.forEach(li => {
      li.classList.remove("active");
      if (li.querySelector("a").getAttribute("href") === `#${current}`) {
        li.classList.add("active");
      }
    });

    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (documentHeight === scrollPosition) {
      navLi.forEach(li => li.classList.remove("active"));
      navLi[navLi.length - 1].classList.add("active");
    }
  });
}

urlSeter();
