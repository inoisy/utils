# HTML Style Guide

Данное руководство описывает правила для оформления и форматирования html-файлов. Большинство приведенных ниже правил так же актуальны для секции `template` во `.vue` файлах.

Имя файла должно быть написано строчными буквами, слова разделены дефисом (`sidebar.html`, `social-media-widget.html`).

---

## **1. Форматирование**

В этой секции описаны соглашения по форматированию HTML файлов. Для правильного форматирования используйте файл `.editorconfig` в вашем редакторе.

1. Для отступов у вложенных элементов используются **четыре пробела**.
2. Прямые дочерние элементы такие, как `html`, `head`, `body` не должны иметь отступов.
3. Блочные элементы, списки и таблицы должны начинаться с новой строки, а их дочерние элементы должны иметь отступы.

    **Хорошо:**

    ```html
    <div>
    		<h1>Title</h1>
    </div>

    <ul>
    		<li>
    				<p>Hello</p>
    		</li>
    </ul>
    ```

    **Плохо:**

    ```html
    <div>
    <h1>Title</h1>
    </div>

    <ul>
    		<li><p>Hello</p></li>
    </ul>
    ```

4. Теги и их атрибуты должны быть написаны строчным буквами.
5. Необязательный закрывающий слеш у одиночных тегов (`<img>`, `<br>`) не ставится.

    **Хорошо:**

    ```html
    <br>
    <img src="img.jpg" alt="img">
    ```

    **Плохо:**

    ```html
    <br></br>
    <br/>
    <img src="img.jpg" alt="img"></img>
    ```

6. Необязательные закрывающие теги (`</li>`, `</body>`) не пропускаются.
7. Для значений атрибутов всегда используются **двойные кавычки**.

    **Хорошо:**

    ```html
    <img src="img.jpg" alt="img">
    ```

    **Плохо:**

    ```html
    <img src=img.jpg alt='img'>
    ```

8. Для логических атрибутов (`checked`, `disabled`, `required`) значение не указывается, а сами атрибуты указываются последними и в единообразной последовательности во всём документе.

    **Хорошо:**

    ```html
    <input type="text" name="first_name" autofocus>
    ```

    **Плохо:**

    ```html
    <input type="text" name="first_name" autofocus="autofocus">
    ```

9. Атрибут `type` не должен указывается для тегов `<link>` и `script`.

    **Хорошо:**

    ```html
    <link rel="stylesheet" href="style.css" >
    <script src="script.js"></script>
    ```

    **Плохо:**

    ```html
    <link rel="stylesheet" href="style.css" type="text/css">
    <script src="script.js" type="text/javascript"></script>
    ```

10. Атрибут класса у HTML-элементов пишется первым. Остальные атрибуты могут быть расставлены в любом порядке, но единообразно для одинаковых элементов.

---

## **2. Документ**

Эта секция описывает ключевые элементы HTML файла.

1. **Тип документа** обязательно должен быть указан в начале страницы.
    - *Пример:* `<!DOCTYPE html>`
2. **Язык** обязательно должен быть указан на `html` элементе
    - *Пример:* `<html lang="en">`
3. **Кодировка** должна быть определена сразу после элемента `html`
    - *Пример:* `<meta charset="utf-8">`
4. **Viewport** нужен для адаптации к мобильным устройствам, контролирует масштаб видимой области просмотра в браузере.
    - *Пример:* `<meta name="viewport" content="width=device-width, user-scalable=no">`
5. **Заголовок** должен использоваться на всех страницах. Максимальная длина заголовка не должна превышать 55 символов.
    - *Пример:* `<title>Page Title</title>`
6. **Описание** желательно использовать на всех страницах. Предназначено для создания краткого описания html-страницы. Его содержимое может использоваться поисковыми системами. Максимальная длина не должна превышать 150 символов.
    - *Пример:* `<meta name="description" content="Description of the page">`
7. **Favicons** обязательно должны присутствовать на каждой странице. Для генерации используем этот [сервис](https://realfavicongenerator.net/).

    ```jsx
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="theme-color" content="#ffffff">
    <link rel="icon" type="image/x-icon" href="/favicons/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
    <link rel="manifest" href="/favicons/site.webmanifest">
    <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#000000">
    ```

8. **Мета теги социальных сетей (Open Graph)** добавляются непосредственно на странице, которой хотят поделиться. Более полное руководство можно почитать [здесь](https://developers.facebook.com/docs/sharing/webmasters/).

    ```jsx
    <meta property="og:type" content="article">
    <meta property="og:title" content="My Title">
    <meta property="og:description" content="My description">
    ```

9. **Head and body** обязательные теги.
    1. *Пример:* `<head></head><body></body>`

---

## 3**. Комментарии**

В данной секции описан стиль написания комментариев и их формат. Комментарии могут использоваться для описания компонентов, особенностей их работы и ограничений, а также для визуального разграничения кода.

1. **Однострочные комментарии** должны быть написаны на одной строке, а текст внутри отделен пробелами. 

    **Хорошо:**

    ```html
    <!-- This is a comment -->
    ```

    **Плохо:**

    ```html
    <!--
    This is a comment
    -->

    <!--This is a comment-->
    ```

2. **Многострочные комментарии** должны начинаться с новой строки, а тест не должен иметь отступов.

    **Хорошо:**

    ```html
    <!--
    This is a comment
    that spans multiple lines
    -->
    ```

    **Плохо:**

    ```html
    <!-- This is a comment
    that spans multiple lines
    -->

    <!--
    	This is a comment
    	that spans multiple lines
    -->
    ```

---

## 5**. Best Practices**

1. Стили и скрипты должны быть разделены между собой. В примере ниже на кнопке есть 2 класса: `.btn` для стилей и `.js-btn` для скриптов. 

    **Хорошо:**

    ```html
    <button class="btn js-btn">Button</button>
    ```

    **Плохо:**

    ```html
    <button class="btn">Button</button>
    ```

2. За внешние отступы и позиционирование универсальных компонентов (кнопка, виджет)  должны отвечать классы родительского компонента.

    **Хорошо:**

    ```html
    <div class="my-widget">
    		<button class="my-widget__btn btn">Button</button>
    </div>
    ```

    **Плохо:**

    ```html
    <div class="my-widget">
    		<button class="btn">Button</button>
    </div>
    ```

3. HTML должен быть валидным и семантичным. Проверяйте верстку [w3c валидатором](https://validator.w3.org).

    **Хорошо:**

    ```html
    <ul>
    		<li>
    				<p></p>
    		</li>
    </ul>
    ```

    **Плохо:**

    ```html
    <ul>
    		<p></p>
    </ul>
    ```

4. Файлы стилей подключаются с помощью `<link>` внутри `<head>`. Скрипты должны подключаться в самом низу страницы, чтобы при её загрузке не блокировать отображение содержимого.
5. Элемент формы должен быть связан с его описанием с помощью `<label>`, а имена элементов формы, если это необходимо, должны указываться через нижнее подчеркивание `_`.
-