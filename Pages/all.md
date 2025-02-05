# Programowanie Obiektowe w C++ 

## Wprowadzenie do Klas

Programowanie obiektowe (**OOP**) to paradygmat programowania, który opiera się na koncepcji _"obiektów"_. Obiekty mogą zawierać dane w postaci pól (znanych również jako atrybuty lub właściwości) oraz kod w postaci metod (funkcji członkowskich).

### Definicja Klasy

Klasa to szablon dla obiektów. Definiuje ona właściwości i zachowania, które obiekty tej klasy będą posiadać. Oto przykład definicji klasy w _**C++**_:

![Klasa](https://rudekalone.gitbook.io/~gitbook/image?url=https%3A%2F%2F3353494283-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FzNmfijSLU7Bk6ggQf6dC%252Fuploads%252FXRXIUvGGodXsDPu1kawf%252FKompilacja_vs_Interpretacja.png%3Falt%3Dmedia%26token%3D6a6e9e4f-3988-44eb-953d-044458028b19&width=768&dpr=1&quality=100&sign=50627544&sv=2)


# Matematyka w Markdown

Możesz zapisać wzory matematyczne w trybie inline, na przykład: $$ 13 + 5^3 + 3^3 = 153 $$.



```cpp

#include <iostream> // do obsługi strumieni wejścia/wyjścia
#include "Kalkulator.h"// dołączamy plik nagłówkowy klasy Kalkulator

int main() {
    Kalkulator kalk; // tworzymy obiekt klasy Kalkulator
    double a = 10.0, b = 5.0; // deklarujemy zmienne a i b

    // wywołujemy metody obiektu kalkulator
    std::cout << "Dodawanie: " << kalk.dodaj(a, b) << std::endl;
    std::cout << "Odejmowanie: " << kalk.odejmij(a, b) << std::endl;
    std::cout << "Mnożenie: " << kalk.mnoz(a, b) << std::endl;
    std::cout << "Dzielenie: " << kalk.dziel(a, b) << std::endl;
    std::cout << "Dzielenie przez zero: " << kalk.dziel(a, 0) << std::endl;

    return 0;
}

```


<details open>
<summary>Shopping list</summary>

* Vegetables
* Fruits
* Fish

</details>


<details>
<summary>Rozwiązanie</summary>

```cpp
#include <iostream> // do obsługi strumieni wejścia/wyjścia
#include "Kalkulator.h"// dołączamy plik nagłówkowy klasy Kalkulator

int main() {
    Kalkulator kalk; // tworzymy obiekt klasy Kalkulator
    double a = 10.0, b = 5.0; // deklarujemy zmienne a i b

    // wywołujemy metody obiektu kalkulator
    std::cout << "Dodawanie: " << kalk.dodaj(a, b) << std::endl;
    std::cout << "Odejmowanie: " << kalk.odejmij(a, b) << std::endl;
    std::cout << "Mnożenie: " << kalk.mnoz(a, b) << std::endl;
    std::cout << "Dzielenie: " << kalk.dziel(a, b) << std::endl;
    std::cout << "Dzielenie przez zero: " << kalk.dziel(a, 0) << std::endl;

    return 0;
}
```

</details>

# Przykład kart i hintów

## Karty


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



## Hinty

<div data-hint="info">
    <p>To jest hint informacyjny.</p>
</div>

<div data-hint="success">
    <p>To jest hint sukcesu.</p>
</div>

<div data-hint="warning">
    <p>To jest hint ostrzegawczy.</p>
</div>

<div data-hint="danger">
    <p>To jest hint niebezpieczeństwa.</p>
</div>
test