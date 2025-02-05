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

Funkcja loadPage

Funkcja loadPage pobiera plik Markdown (.md) z katalogu Pages, przetwarza go na HTML oraz, jeśli target jest równy _index, generuje menu nawigacyjne dokumentacji.
```js
// Funkcja loadPage, która pobiera plik .md z katalogu Pages i przetwarza go na html
// oraz za pierwszym razem generuje menu nawigacyjne Dokumentacji gdy target jest równy _index

function loadPage(target) {
  fetch(`Pages/${target}.md`)
    .then((response) => response.text())
    .then((data) => {
      // Załadowanie zawartości pliku .md do zmiennej global
      fileMD = data;
      // Przetworzenie pliku .md na html
      let html_index = marked.parse(fileMD);

      // Sprawdzenie czy target jest równy _index aby jednorazowo przygotować menu nawigacyjne Dokumentacji
      if (target === "_index") {
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

          // Sprawdzenie czy element li jest elementem details, jeżeli tak to to w linku href dodaj jego nazwę jako lokalizację do katalogu o tej samej nazwie
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
            // Przerywa propagację zdarzenia aby nie wywołać zdarzenia click na rodzicu, tylko na klikniętym elemencie li, gdy rodzicem jest details
            event.stopPropagation();

            // Przypisanie ścieżki do pliku .md zgodnie z lokalizacją
            let target = this.querySelector("a").href.split("#")[1];

            // Przypisanie pierwszego elementu znajdującego się nad kliknietym elementem li, który posiada klasę module
            const moduleName =
              findPreviousModule(this)?.innerText.split(":")[0];
            // Jeżeli nazwa modułu istnieje i pierwszy element tablicy zdekodowanego targetu jest różny od nazwy modułu to dodaj nazwę modułu do targetu
            if (moduleName && decodeURI(target.split("/")[0]) !== moduleName) {
              target = `${moduleName}/${target}`;
            } else {
              // Zmienna pomocnicza, która przechowuje referencję do rodzica rodzica rodzica elementu li
              const parentNav = this.parentElement.parentElement.parentElement;
              // Przypisanie pierwszego elementu znajdującego się nad kliknietym elementem `parentNav`, który posiada klasę module
              const parentModuleName =
                findPreviousModule(parentNav)?.innerText.split(":")[0];
              // Jeżeli stary target jest równy nowemu target i rodzic modułu istnieje oraz pierwszy element tablicy zdekodowanego targetu jest różny od nazwy modułu to dodaj nazwę modułu do targetu
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
    });
}
```