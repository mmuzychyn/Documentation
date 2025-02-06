# Dokumentacja script.js

W ```Data/script.js``` na początku znajduje się zmienne globalne z podstawową konfiguracją.

## Zmienne globalne

```fileMD``` - służy do przechowywania zawartości pliku __.md__  
```content``` - przechowuje referencję do elementu z __*id="content"*__  
```onceLoaded_index``` - zmienna logiczna, która przechowuje informację o tym, czy plik _index.md został już załadowany.  
Jest to tak zwana __*flaga*__, która zapobiega wielokrotnemu ładowaniu pliku *_index.md*


```js
let fileMD = "";
const content = document.querySelector("#content");
let onceLoaded_index = false;
// Jednorazowe załadowanie pliku _index.md
if (!onceLoaded_index) {
  loadPage("_index");
  onceLoaded_index = true;
}
```

# Funkcja loadPage()

Funkcja ```loadPage```, która pobiera plik __.md__ z katalogu ```Pages/``` i przetwarza go na *html* oraz za pierwszym razem generuje menu nawigacyjne Dokumentacji gdy target jest równy ```_index```.
```js
function loadPage(target) {
  fetch(`Pages/${target}.md`)
    .then((response) => response.text())
    .then((data) => {
      // Załadowanie zawartości pliku .md do zmiennej global
      fileMD = data;
      // Sprawdzenie czy target jest równy _index aby jednorazowo przygotować menu nawigacyjne Dokumentacji
      if (target === "_index") {
        setupIndexPage();
      }
    });
}
```

# Funkcja setupIndexPage()

Funkcja setupIndexPage, która przygotowuje menu nawigacyjne Dokumentacji

```js
function setupIndexPage() {
  // Przetworzenie pliku .md na html
  let html_index = marked.parse(fileMD);
  // Usunięcie zawartości menu nawigacyjnego Dokumentacji
  document.querySelector("nav>ul").innerHTML = "";

  // Tablica obiektów zawierająca regex oraz replacement, które są wykorzystywane do zamiany tagów html na tagi listy
  const replacements = [
    { regex: /<h1>/g, replacement: '<li><a href="#">' },
    { regex: /<\/h1>/g, replacement: "</a></li>" },
    { regex: /<h4>/g, replacement: '<li class="module">' },
    { regex: /<\/h2>/g, replacement: "</a></li>" },
    { regex: /<details>/g, replacement: "<li><details open>" },
    { regex: /<\/summary>/g, replacement: "</summary><ul>" },
    { regex: /<\/details>/g, replacement: "</ul></details></li>" },
  ];

  // Zamiana tagów html(h1 i h4,) na tagi listy (li) i poprawienie struktury dla przypadków z tagami details i summary
  replacements.forEach(({ regex, replacement }) => {
    html_index = html_index.replace(regex, replacement);
  });
  // Usuniecie zawartości menu nawigacyjnego Dokumentacji
  document.querySelector("nav>ul").innerHTML = html_index;
  // Załadowanie kontentu na podstawie adresu URL
  urlSeter();
  // Nadanie funkcjonalności dla głównego menu nawigacyjnego Dokumentacji
  document.querySelectorAll("nav>ul li").forEach((li, index) => {
    let target; // Zmienna pomocnicza, do przechowywania lokalizacji pliku .md
    const aTag = li.querySelector("a"); // Zmienna pomocnicza
    // Sprawdzenie czy element li jest elementem details,
    //  jeżeli tak to to w linku href dodaj jego nazwę jako lokalizację do katalogu o tej samej nazwie
    if (
      li.parentElement.parentElement.tagName === "DETAILS" &&
      li.parentElement.tagName !== "SUMMARY"
    ) {
      aTag.href = `#${
        li.parentElement.parentElement.querySelector("summary").innerText
      }/${aTag.innerText}`;
      target = aTag.href.split("#")[1] + "/" + aTag.href.split("#")[2];
    } else if (aTag) {
      aTag.href = `#${aTag.innerText}`;
      target = aTag.innerText;
    }
    // Nadanie zdarzenia click na element li do przełączania treści strony
    li.addEventListener("click", function (event) {
      // Przerywa propagację zdarzenia aby nie wywołać zdarzenia click na rodzicu,
      //  tylko na klikniętym elemencie li, gdy rodzicem jest details
      event.stopPropagation();
      // Przypisanie ścieżki do pliku .md zgodnie z lokalizacją
      let target = this.querySelector("a").href.split("#")[1];
      // Przypisanie pierwszego elementu znajdującego się nad kliknietym elementem li,
      //  który posiada klasę module
      const moduleName =
        findPreviousModule(this)?.innerText.split(":")[0];
      // Jeżeli nazwa modułu istnieje i 
      // pierwszy element tablicy zdekodowanego targetu jest różny od nazwy modułu to dodaj nazwę modułu do targetu
      if (moduleName && decodeURI(target.split("/")[0]) !== moduleName) {
        target = `${moduleName}/${target}`;
      } else {
        // Zmienna pomocnicza, która przechowuje referencję do rodzica rodzica rodzica elementu li
        const parentNav = this.parentElement.parentElement.parentElement;
        // Przypisanie pierwszego elementu znajdującego się nad kliknietym elementem `parentNav`,
        //  który posiada klasę module
        const parentModuleName =
          findPreviousModule(parentNav)?.innerText.split(":")[0];
        // Jeżeli stary target jest równy nowemu target i rodzic modułu istnieje 
        // oraz pierwszy element tablicy zdekodowanego targetu jest różny od nazwy modułu to dodaj nazwę modułu do targetu
        if (
          parentModuleName &&
          decodeURI(target.split("/")[0]) !== parentModuleName
        ) {
          target = `${parentModuleName}/${target}`;
        }
      }
      // Uzupełnienie adresu URL
      this.querySelector("a").href = `#${target}`;
      // Pobranie zawartości pliku .md zgodnie z lokalizacją
      fetch(`Pages/${target}.md`)
        .then((response) => response.text())
        .then((data) => {
          // Załadowanie zawartości pliku .md do zmiennej globalnej fileMD
          fileMD = data;
          // Wywołanie funkcji generującej stronę
          setupPage(target);
          setupNavSidebar();
          renderMathInElement(content);
        });
    });
  });
}
```

# Funkcja findPreviousModule()

Funkcja findPreviousModule, która zwraca pierwszy element znajdujący się nad elementem, który posiada klasę module

```js
function findPreviousModule(element) {
  let previousElement = element.previousElementSibling;// Przypisanie pierwszego elementu znajdującego się nad elementem
  // Pętla while, która przechodzi przez wszystkie elementy znajdujące się nad elementem i
  //  sprawdza czy element posiada klasę module jeżeli tak to zwraca ten element
  while (previousElement) {
    if (previousElement.classList.contains("module")) {
      return previousElement;
    }
    previousElement = previousElement.previousElementSibling;
  }
  return null;
}
```

# Funkcja urlSeter()

Funkcja urlSeter, która na podstawie adresu URL ścieżki pobiera zawartość pliku .md

```js
function urlSeter() {
  let targetPage;
  const url = window.location.href;
  let target = url.split("#")[1] || document.querySelector("nav>ul>li>a").innerText;
  target = decodeURI(target).split("/");
  // Przypisanie lokalizacji pliku .md zgodnie z długością tablicy target
  switch (target.length) {
    case 1:
      targetPage = target[0];
      break;
    case 2:
      targetPage = `${target[0]}/${target[1]}`;
      break;
    case 3:
      targetPage = `${target[0]}/${target[1]}/${target[2]}`;
      break;
    default:
      targetPage = target;
  }
  // Pobranie zawartości pliku .md zgodnie z lokalizacją i wywołanie funkcji generującej stronę
  fetch(`Pages/${targetPage}.md`)
    .then((response) => response.text())
    .then((data) => {
      fileMD = data;
      setupPage(targetPage);
      setupNavSidebar();
    });
}
```
# Funkcja changeActiveNav()

Funkcja changeActiveNav, która zmienia aktywny element menu nawigacyjnego Dokumentacji

```js
function changeActiveNav(targetPage) {
  let targetPageArray = targetPage.split("/");
  targetPage = targetPageArray[targetPageArray.length - 1];
  targetPage = decodeURI(targetPage);
  // Znalezienie elementu menu nawigacyjnego, który zawiera w sobie nazwę pliku .md
  const targetElement = Array.from(document.querySelectorAll("nav>ul a")).find(
    (a) => a.innerText.includes(targetPage)
  );
  // Jeżeli element istnieje to usuń klasę active ze wszystkich elementów menu nawigacyjnego i
  // dodaj ją do elementu, który zawiera w sobie nazwę pliku .md
  if (targetElement) {
    document
      .querySelectorAll("nav>ul li")
      .forEach((li) => li.classList.remove("active"));
    targetElement.parentElement.classList.add("active");
  }
}
```

# Funkcja setupPage()

Funkcja setupPage, która przygotowuje stronę na podstawie zawartości pliku .md

```js
function setupPage(targetPage) {
  // Przetworzenie pliku .md na html
  const htmlContent = marked.parse(fileMD);
  document.getElementById("content").innerHTML = htmlContent;

  // Dodanie kolorowania składni do bloków kodu
  document
    .querySelectorAll("pre code")
    .forEach((block) => hljs.highlightElement(block));
  // Dodanie przycisków kopiuj do bloków kodu
  addCopyButtons();

  // Inicjalizacja zakładek i podpowiedzi
  initializeTabs();
  initializeHints();

  // Zmiana aktywnego elementu menu nawigacyjnego
  changeActiveNav(targetPage);
}
```
# Funkcja addCopyButtons()

Funkcja addCopyButtons, która dodaje przyciski kopiuj do bloków kodu.

```js
function addCopyButtons() {
  document.querySelectorAll("pre").forEach((pre) => {
    const button = document.createElement("button");
    button.className = "copy-button";
    button.innerText = "Kopiuj";
    // Zdarzenie click na przycisku kopiuj
    button.addEventListener("click", () => {
      const code = pre.querySelector("code").innerText;
      // Skopiowanie kodu do schowka i zmiana tekstu przycisku na Skopiowano! na 1s
      navigator.clipboard.writeText(code).then(() => {
        button.innerText = "Skopiowano!";
        setTimeout(() => {
          button.innerText = "Kopiuj";
        }, 1000);
      });
    });
    // Dodanie stworzonego przycisku kopiuj do bloku kodu
    pre.insertBefore(button, pre.firstChild);
  });
}
```

# Funkcja initializeTabs()

Funkcja initializeTabs, która inicjalizuje zakładki.

```js
function initializeTabs() {
  // Znalezienie wszystkich kontenerów z zakładkami
  document.querySelectorAll("[data-tabs]").forEach((tabContainer) => {
    const tabs = tabContainer.querySelector(".tabs");
    const tabButtons = tabs.querySelectorAll("b");
    const tabContents = tabContainer.querySelectorAll("div:not(.tabs)");
    // Dodanie funkcjonalności przełączania zakładek
    tabButtons.forEach((tabButton, index) => {
      if (index === 0) tabButton.classList.add("active");
      tabButton.addEventListener("click", () => {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        tabButton.classList.add("active");
        tabContents[index].classList.add("active");
      });
    });
  });
}
```

# Funkcja initializeHints()

Funkcja initializeHints, która inicjalizuje podpowiedzi (Specjalnie wystylizowane fragmenty dokumentacji)

```js
function initializeHints() {
  document.querySelectorAll("[data-hint]").forEach((hint) => {
    const hintType = hint.getAttribute("data-hint");
    // Nadanie klasy w zależności od typu podpowiedzi
    hint.classList.add(`hint-${hintType}`);
  });
}
```
# Funkcja setupNavSidebar()

Funkcja setupNavSidebar, która przygotowuje nawigację boczną wygenerowanej strony

```js
function setupNavSidebar() {
  const navS_ul = document.querySelector("nav.sidebar ul");
  navS_ul.innerHTML = "";

  // Znalezienie wszystkich nagłówków pierwszego drugiego i trzeciego stopnia 
  // w najwyższym zagnieżdżeniu w elemencie o id="content"
  const headers = document.querySelectorAll(
    "#content > h1, #content > h2, #content > h3"
  );

  headers.forEach((header, index) => {
    // Nadanie id dla nagłówków w content
    header.id = `header-${index}`;
    const li = document.createElement("li");

    // Nadanie klasy wcięcia w menu bocznym w zależności od typu nagłówka
    if (header.tagName === "H2") li.classList.add("indent-h2");
    else if (header.tagName === "H3") li.classList.add("indent-h3");

    // Dodanie linków do nagłówków w menu bocznym
    li.innerHTML = `<a href="#${header.id}">${header.innerText}</a>`;
    // Dodanie klasy active do pierwszego elementu w menu bocznym
    if (index === 0) li.classList.add("active");
    navS_ul.appendChild(li);
  });

  // Dodanie funkcjonalności nawigacji bocznej
  const sections = document.querySelectorAll(
    "#content > h1, #content > h2, #content > h3"
  );
  const navLi = document.querySelectorAll("nav.sidebar ul li");
  let isScrolling = false;

  // Funkcja scrollToSection, która przewija stronę do odpowiedniej sekcji 
  // w sposób płynny dzięki opcji behavior: "smooth"
  function scrollToSection(id) {
    const section = document.querySelector(id);
    const offsetTop = section.offsetTop - 60;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }

  // Dodanie zdarzenia click na elementy menu bocznego
  navLi.forEach((li) => {
    li.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.querySelector("a").getAttribute("href");
      //#####################################################################################################################
      //# OPCJONALNE: Wyłączenie stylu przewijania po każdym elemencie aż do zakończenia przewijania do odpowiedniej sekcji #
      //#####################################################################################################################
      isScrolling = true; 
      //#####################################################################################################################
      scrollToSection(targetId);

      navLi.forEach((li) => li.classList.remove("active"));
      this.classList.add("active");

       //#####################################################################################################################
      //# OPCJONALNE: Wyłączenie stylu przewijania po każdym elemencie aż do zakończenia przewijania do odpowiedniej sekcji #
      //#####################################################################################################################
      setTimeout(() => {
        isScrolling = false;
      }, 1000);
      //#####################################################################################################################
    });
  });

  // Dodanie zdarzenia scroll na okno przeglądarki do zmiany aktywnego elementu menu bocznego 
  // w zależności od przewijanej sekcji
  window.addEventListener("scroll", () => {
    if (isScrolling) return;

    let current = "";

    // Sprawdzenie, która sekcja jest aktualnie przewijana
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 60; // 60px to wysokość <header>
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    // Zmiana aktywnego elementu menu bocznego w zależności od przewijanej sekcji
    navLi.forEach((li) => {
      li.classList.remove("active");
      if (li.querySelector("a").getAttribute("href") === `#${current}`) {
        li.classList.add("active");
      }
    });

    // Fix dla aktywacji ostatniego elementu menu bocznego gdy przewijamy stronę na sam dół,
    // a ostatnia sekcja jest za krótka aby nagłówek był na górze okna przeglądarki
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (documentHeight === scrollPosition) {
      navLi.forEach((li) => li.classList.remove("active"));
      navLi[navLi.length - 1].classList.add("active");
    }
  });
}
```
# Funkcja showLoadingPage()

Funkcja showLoadingPage, która pokazuje stronę ładowania dla wartości true i ukrywa dla wartości false

```js
function showLoadingPage(show) {
  const loadingPage = document.querySelector("#loading-doc-page");
  setTimeout(() => {
    if (show) {
      loadingPage.style.display = "block";
    } else {
      loadingPage.style.display = "none";
    }
  }, 500);
}
```