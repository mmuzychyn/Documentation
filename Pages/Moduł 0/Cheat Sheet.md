# Cheat Sheet

## Nagłówki

___

```# Nagłówek 1 stopnia```  
```# Nagłówek 2 stopnia```  
```# Nagłówek 3 stopnia```

___

## Formatowanie tekstu

___

```*Pochyły*``` *Pochyły*  
```__Pogrubiony__``` __Pogrubiony__  
```__*Pochyły i pogrubiony*__``` __*Pochyły i pogrubiony*__  
Dodając na koniec lini co najmniej dwie spacje spowodujesz przejście do nowej lini nie kończąc akapitu.

___

## Fragmenty kodu

___

````markdown
```język programowania np.: javascript
Fragment kodu np.: let zmienna = 7;
```
````
```javascript
Fragment kodu np.: let zmienna = 7;
```

___

## Zapis matematyczny

___

```$$2^2=4$$``` $$2^2=4$$  
```$$10*2=5$$``` $$10*2=5$$

___

## Obraz

___

```![Tekst alternatywny opisujący obraz, który jest wyświetlany, gdy obraz nie może zostać załadowany.](lokalizacja pliku obrazka)```  
np.:  
```![Zimowa góra.](/basic-preset-image.jpg)```

![Tekst alternatywny opisujący obraz, który jest wyświetlany, gdy obraz nie może zostać załadowany.](/basic-preset-image.jpg)

___

## Listy automatyczne

___

Aby wykonać zagnieżdżenie listy użyj tabulacji.

### Lista numerowana

Zwróć uwagę, że dane podpunkty będą kontynuacją pierwszej podanej liczby dla danego zagnieżdżenia, a potem nie ma znaczenia, jaką liczbę podasz, aczkolwiek warto pisać składnie i logicznie:

1. Pierwszy
    14. drugi
    3. trzeci
9. czwarty
    1. piąty
        2. szósty

```markdown
1. Pierwszy
    14. drugi
    3. trzeci
9. czwarty
    1. piąty
        102. szósty
```

### Lista nienumerowana

Możesz wykorzystać znak plusa, minusa lub gwiazdki:

- pierwszy
    + drugi
        - trzeci
+ czwarty
    * piąty
        * szósty

```markdown
- pierwszy
    + drugi
        - trzeci
+ czwarty
    * piąty
        * szósty
```

___

# Znaczniki HTML i specjalne generowane w JavaScript

___

## Element szczegółu

___

<details>
<summary>Kategorie produktów spożywczych</summary>

* Warzywa
* Owoce
* Mieso
* Nabiał

</details>

```markdown
<details>
<summary>Kategorie produktów spożywczych</summary>

* Warzywa
* Owoce
* Mieso
* Nabiał

</details>
```
___

## Karty

___

<div data-tabs>
    <div class="tabs">
        <b>Tab 1</b>
        <b>Tab 2</b>
    </div>
    <div class="active">
        <h3>Tab 1</h3>
        <p>Zawartość pierwszej karty.</p>
    </div>
    <div>
        <h3>Tab 2</h3>
        <p>Zawartość drugiej karty.</p>
    </div>
</div>

```html
<div data-tabs>
    <div class="tabs">
        <b>Tab 1</b>
        <b>Tab 2</b>
    </div>
    <div class="active">
        <h3>Tab 1</h3>
        <p>Zawartość pierwszej karty.</p>
    </div>
    <div>
        <h3>Tab 2</h3>
        <p>Zawartość drugiej karty.</p>
    </div>
</div>
```

___

## Hinty

___

<div data-hint="info">
    <p>To jest hint informacyjny.</p>
</div>

```html
<div data-hint="info">
    <p>To jest hint informacyjny.</p>
</div>
```

<div data-hint="success">
    <p>To jest hint sukcesu.</p>
</div>

```html
<div data-hint="success">
    <p>To jest hint sukcesu.</p>
</div>
```

<div data-hint="warning">
    <p>To jest hint ostrzegawczy.</p>
</div>

```html
<div data-hint="warning">
    <p>To jest hint ostrzegawczy.</p>
</div>
```

<div data-hint="danger">
    <p>To jest hint niebezpieczeństwa.</p>
</div>

```html
<div data-hint="danger">
    <p>To jest hint niebezpieczeństwa.</p>
</div>
```

___

## Embed z YouTube

___

<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=Eir45MTGwuEeP6D7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> -->

___