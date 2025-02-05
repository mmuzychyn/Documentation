# Struktura projektu

W katalogu ```Data``` znajdują się następujące pliki:

- favicon.ico - ikona strony wyświetlana w karcie przeglądarki
- logo.webp - logo strony wyświetlane w górnym lewym rogu strony
- script.js - zawierający całą funkcjonalność projektu
- styles.css - style strony

W katalogu ```Pages``` bedziesz zamieszczać pliki Markdown. Poniżej masz przykładową strukturę katalogowo plikową tego projektu:
```
[Pages]
    |
    |--[Moduł 0]
    |   |
    |   |- (Cheat Sheet.md)
    |   |- (Struktura projektu.md)
    |
    |--[Moduł 1]
    |   |
    |   |--[Dokumentacja projektu]
    |   |       |
    |   |       |- (Dokumentacja script.js.md)
    |   |       |- (Dokumentacja style.js.md)
    |   |
    |   |- (Dokumentacja projektu.md)
    |
    |- (Wprowadzenie do dokumentacji.md)

```
Pamietaj aby przedstawić ją w pliku ```Pages/_index.md```, dopiero gdy tam dokonasz modyfikacji pliki zostaną dodane do głównego menu nawigacyjnego (kolejność ma znaczenie):

```MarkDown
# Wprowadzenie do dokumentacji

#### Moduł 0: Przykłady

# Cheat Sheet

# Struktura projektu

#### Moduł 1: XYZ

<details>
<summary>

# Dokumentacja projektu

</summary>

# Dokumentacja script.js
# Dokumentacja style.js

</details>

```