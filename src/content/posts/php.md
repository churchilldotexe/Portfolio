---
name: "Php and Javascript Side by Side"
date: 2024-10-22
description: "A side by side comparison of php and Javascript"
slug: "php-js"
---

# Php and Javascript Side by side

## Setting up the Environment

### simple Php setup

In Unix systems(macos and linux) you can easily install php with **homebrew** or your package manager

```bash
brew install php
```

this will install php for you but you might need a database so you can install and start [database from here](<php#Php with laravel>) and refer to number 3

### Php with laravel

In Macos and Windows you can download [laravel/herd](https://herd.laravel.com/)

- This will setup php, laravel and all its dependencies for you

In Linux however, laravel herd is not currently supported so it must be installed manually.

Here are the steps to configure laravel:

1. Install php:

   ```bash
   sudo apt update
   sudo apt install php-cli php-cgi

   php --version
   ```

   `php --version` is to check the php version and to check if it is successfully installed

   ```bash
   sudo apt install php8.3-xml
   sudo apt install php8.3-curl
   sudo apt install php8.3-sqlite3
   ```

   This will install php extension, the `8.3` is the version of your php

2. Install composer
   Composer is a dependency manager for php, it is like npm for node/javascript.

   ```bash
   php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
   php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
   php composer-setup.php
   php -r "unlink('composer-setup.php');"
   ```

   this will install composer through php and install it in your current directory but its alright since it it will be move to its corresponding directory using this command :

   ```bash
   sudo mv composer.phar /usr/local/bin/composer
   ```

   You can refer to [composer web](https://getcomposer.org/) for more details

   lastly make sure that you export the Path of laravel config in your shell in order to use, for example, laravel if you decide to install its global installer through composer

   - find out where your composer is located normally in `.config` folder

   then in your shell configuration export the path of the composer/vendor/bin

   ```bash
   # .zshrc
   export PATH="$PATH:$HOME/.config/composer/vendor/bin"
   ```

   then source the shell

   ```bash
   source .zshrc
   ```

3. Install database
   You also need database for laravel to use.
   like these examples:

   ```bash
   sudo apt install sqlite3
   sudo apt install postgresql postgresql-contrib
   sudo apt install mysql-server
   sudo mysql_secure_installation
   ```

   and then in linux (systemd)
   you can start postgres and mysql through

   ```bash
   sudo systemctl start postgres.service
   sudo systemctl start mysql.service
   ```

   or

   ```bash
   sudo systemctl enable postgres.service
   sudo systemctl enable mysql.service
   ```

   sqlite however is a self-contained database engine.

4. Setting up laravel
   You can setup laravel to easily start your php project
   and you can do so with composer

   ```bash
   composer global require laravel/installer
   ```

   then create a project using :

   ```bash
   laravel new example
   ```

   where `example` is the project name and follow the cli

### Javascript

In javascript, you can simple just create html,css,javascript to run static app but once you need dependencies, you'll be needing `node package manager`. In php you can have composer, in Javascript you `npm` and others. To install npm however, you need node and it also have a manager which is `node version manager`.

In Unix terminal you can use `curl` to install it :

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

In windows you can download it from this [repository](https://github.com/coreybutler/nvm-windows/releases)

and then you can use this commands

```bash
nvm list
nvm install <version>
nvm use <version>
```

what these command do is to `nvm list` to list the available node version and install it using `nvm install` and you can also switch versions that you installed using `nvm use`

---

## Basic setup and Scaffolding

- **Php**

  To setup a dynamic php to the browser the simple way to do it is to just setup a normal html and just change it to php.

  ```php
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title></title>
      <link href="css/style.css" rel="stylesheet" />
    </head>
    <body>
      <h1>
         <?php echo "Hello world"; ?>
      </h1>
    </body>
  </html>

  ```

  the php tag inside the h1 tag is now considered as a php code meaning you can do your logic directly in there.

- **Javascript**

  On javascript you can set it up like this

  ```javascript

  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title></title>
      <link href="css/style.css" rel="stylesheet" />
    </head>
    <body>
      <h1 id="title">Hi</h1>
     <script>
          document.getElementById('title').textContent = "Hello world";
      </script>
    </body>
  </html>
  ```

  You can take control of it using `script` tag and with DOM manipulation you can take control the html tag (h1 id in this example) and render text.

- **differences between the two**

  The main difference between the two is Javascript execute the code on the browser after the page loads while php will execute it in the server before sending it to the browser

## Scoping and hoisting

- **PHP**

  - **Hoisting**
    Hoisting in php is simple everything aside from function is non-hoisted.
    Meaning you have to define them in order

    ```php
       <?php
          $foo = 1;
          $bar = 2;
          echo $baz; // Reference error
          $baz = 3;

          returnFoo($foo) // works
          function returnFoo($foo){
          return $foo
       }

       ?>
    ```

  - **Scoping** :

    Scoping on other hand have a complexity into it.
    You can think of it like : **Php is functional scoping**.
    Meaning you can access the variable even if it is outside an if-else block
    but you cant access them outside the function block.

    - example:

      ```php
      <?php
         $isRead = true;

         if(isRead){
            $msg = "hello";
         }
          echo $msg; //works

          function AccessMe($foo){
            $bar = "you cant";
            return $foo;
         }

          echo $bar; // Error
      ?>
      ```

  - **Referencing**:
    In you can copy the value of another variable by doing:

    ```php
    <?php
       $foo = 1;
       $bar = $foo;
       $bar = $bar * 3;
       echo $foo // output: 1
    ?>
    ```

    here `$bar` creates a copy of `$foo`. Meaning it is a new point of memory
    and they are reference to a different memory so even tho we change `$bar`
    `$foo` is unaffected.

    On the other hand, if you use a `&` reference operator. It will become different :

    ```php
    <?php
       $foo = 1;
       $bar = &$foo;
       $bar = $bar * 3;
       echo $foo // output: 3
    ?>
    ```

    Now by adding `&` reference operator. `$foo` and `$bar` are pointing the same memory so if you change one of them the other will change as well.

- **Javascript**

  - **Hoisting**:
    JavaScript has more complex hoisting behavior than PHP:

    - `var` declarations are hoisted but not their values
    - `function` declarations are fully hoisted (declaration and implementation)
    - `let` and `const` are hoisted but remain in the Temporal Dead Zone (TDZ) until declaration

    ```javascript
    console.log(foo); // undefined (var is hoisted)
    console.log(bar); // ReferenceError (let/const in TDZ)
    console.log(baz); // ReferenceError (not declared)
    returnFoo(1); // works (functions are fully hoisted)

    var foo = 1;
    let bar = 2;
    const baz = 3;

    function returnFoo(foo) {
      return foo;
    }
    ```

  - **Scoping**:
    JavaScript has lexical (block) scoping, different from PHP's functional scoping:

    - `var` is function-scoped (similar to PHP)
    - `let` and `const` are block-scoped (different from PHP)

    ```javascript
    let isRead = true;
    if (isRead) {
      let msg = "hello";
      var varMsg = "hi";
    }
    console.log(msg); // ReferenceError (block-scoped)
    console.log(varMsg); // works (function-scoped)

    function accessMe(foo) {
      let bar = "you cant";
      var varBar = "you cant";
      return foo;
    }
    console.log(bar); // Error
    console.log(varBar); // Error (function-scoped)
    ```

    Special `var` behavior in Blocks:

    ```javascript
    var x = 1;
    {
      console.log(x); // undefined (hoisting within block)
      var x = 2;
    }
    console.log(x); // 2
    ```

  - Referencing:
    JavaScript handles primitives and objects differently:

    - Primitives (similar to PHP without using reference (**&**)):

    ```javascript
    let foo = 1;
    let bar = foo;
    bar = bar * 3;
    console.log(foo); // output: 1
    ```

    - Objects is similar to php with Reference **&**:

    ```javascript
    let foo = { value: 1 };
    let bar = foo; // Objects are passed by reference
    bar.value = bar.value * 3;
    console.log(foo.value); // output: 3
    ```

    - You can also do a shallow copy which is the same to php without using the reference **&**

    ```javascript
    let foo = { value: 1 };
    let bar = { ...foo }; // Shallow copy
    bar.value = bar.value * 3;
    console.log(foo.value); // output: 1
    ```

  - Differences

    - Hoisting behavior is more complex in JavaScript with var/let/const
    - JavaScript has block-scoping with let/const while PHP is function-scoped
    - JavaScript objects are always referenced, while PHP needs & operator
    - JavaScript requires explicit object copying (spread, Object.assign, etc.) while PHP copies by default
    - JavaScript has the Temporal Dead Zone concept which doesn't exist in PHP

---

## Basic data types

### String

- **Php**
  In php double qoutes `"` and single qoute `'` serves different purpose. Although both returns a string, double qoutes string can be use with string concatenation with variables while the single qoute is only use for only String for example :

  ```php
  <?php
  $greet = "hello";
  echo "$greet world"
  echo '$greet world'
  ?>
  ```

  the first one will render `hello world` while the second one (single qoute) will render `$greet world`

- **Javascript**
  In Javascript, `"` and `'` can define a string and **`** can be use to directly concatenate variable and string

  ```javascript
  const greet = "hello";
  console.log(greet + "there");

  const greet = "hello";
  console.log(`${greet} there`);
  ```

### Concat

- **php**
  The syntax for concat in php is `.`. You can concatenate variable with strings or other logic using it.

  ```php
  <?php
  $greet = "hello";
  echo $greet ." " . "world"
  ?>
  ```

  with this the render is the same `hello world`

- **Javascript**
  In Javascript you can concatenate string using `+`

  ```javascript
  const greet = "hello";

  console.log(greet + " " + "there");
  ```

### Boolean and Conditionals

- **php**
  There are two ways to define if else statement in php

  ```php
  <?php
       $greeting = "Nihao";
      $english = false;
      if ($english) {
          $msg = "Hello";
      } else {
          $msg = "Nihao";
      }
  ?>
  <ul>
     <li>
        <?=$msg?>
     </li>
  </ul>
  ```

  Alternative for conditonals:

  ```php
  <?php
     <ul>
        <?php if($english): ?>
           <li><?=$msg?></li>
        <?php endif; ?>
     </ul>
  ?>

  ```

- **Javascript**
  It is the same with php where you can define it like this
  ```javascript
  if (truthy) {
    //execute
  } else {
    //execute me instead
  }
  ```
- difference
  They may be define the same but they have different code scoping
  - php:
    As the example above the variable `$msg` can be access even if it is outside the scope of `if-else` statement.
  - Javascript:
    While in Javascript it is not the case. You cannot access the variables define inside the `if-else` unless it is a `var`
    [more info in the scoping section](<php#Scoping and hoisting>)

### Equality

- **php**

  - `=` for assignment
  - `===` for strict equal comparison
  - `!==` for not identical
  - `!=` and `<>` are not equal comparison but _!==_ is preferred for strictness
  - `<` , `>` less than and greater than
  - `<=` , `>=` less than or equala and greater than or equal
  - `<=>` **spaceship operator**. It returns an integer base on the condition of left and right .
    - If left is less than to right, it returns **1**
    - If left and right is equal, it returns **0**
    - If left is greater than right, it returns **-1**

- **Javascript**

  - `=` for assignment
  - `===` for strict equal comparison
  - `!==` for not identical
  - `!=` are not equal comparison but _!==_ is preferred for strictness
  - `<` , `>` less than and greater than
  - `<=` , `>=` less than or equala and greater than or equal

---

## Complex data types

### Array

- php

  Array in php is like an ArrayList in data structure where you can grow the array beyond its index
  In a sense it is the same with Javascript.

  #### Iteration

  ```php
  <?php
  foreach ($books as $book){
     echo "<li>{$book}s</li>"
  }
  foreach ($anotherBooks as $book){ // safe assignment book doesnt have another reference
     echo "<li>{$book}s</li>"
  }
  ?>

  ```

  ```php
     <?php foreach ($books of $book): ?>
       <li><?= $book ?></li>
     <?php endforeach;?>
  ```

  ```php
  <?php
     $books[0]
  ?>
  ```

  ##### Caveat of looping

  There is another form of looping that directly modifies the array

  ```php
  <?php
  $books = ["foo", "bar"];
  foreach ($books as &$book){
   $book = $book."1";
  }
  // $books now ["foo1","bar1"]

  foreach ($anotherBooks as $book){ // dangerous! $book is still reference to $books[1]
     echo "<li>{$book}s</li>";
  }
  ?>
  ```

  the caveat here is we are creating a reference of the $books value by using `&`.
   This reference operator will create a new point reference in the array. 
   Meaning we are directly changing the value of $books after the loop the `$book`value still holds that reference so when used in another foreach which is in the code: ` foreach ($anotherBooks as $book `
   $books here still point to `$books[1]`

  So You must remember every time you use `&` reference operator in forEach you must use `unset($variable)`

  ```php
  <?php
  $books = ["foo", "bar"];
  foreach ($books as &$book){
   $book = $book."1";
  }
  // $books now ["foo1","bar1"]
  unset($book)

  foreach ($anotherBooks as $book){ // now safe. $book can be use as it doesnt have a reference
     echo "<li>{$book}s</li>";
  }
  ?>
  ```

  #### built in filter

  `array_filter`

  ```php
     <?php
         $filterBooks = array_filter($books, function ($book) {
             return $book['author'] === 'author1';
         });
     ?>
  ```

  is exactly the same signature with [filter function with lambda fn](<php#lambda Functions>)

- Javascript
  Javascript array also behaves like an Array List where you can grow the length of the array and do a shift and unshift operations

  #### Iteration

  There are several ways to loop through an array and these are:

  - **map**
    This is the most common iteration in JS because it can be use to easily render
    DOM elements and is commonly use in React library.
    It returns a new array

    ```javascript
    const foo = ["bar", "baz"];
    const newFoo = foo.map((val) => {
      return val + "s";
    });
    console.log(newFoo);
    ```

  - **forEach**
    This will iterate over the array and returns **void**

  ```javascript
  const foo = ["bar", "baz"];

  foo.forEach((val) => {
    console.log(val);
  });
  ```

  - **for of**
    This will iterate over the array and the iterated variable represents the value

  ```javascript
  const foo = ["bar", "baz"];

  for (const fo of foo) {
    console.log(fo);
  }
  ```

  - **for loop**
    This is the same with for of but you have a better control over the itteration
    because normally the `i` represents the index of the iteration.

    ```javascript
    const foo = ["bar", "baz"];
    for (let i = 0; i < foo.length; i++) {
      console.log(foo[i]);
    }
    ```

  #### Built-in filter

  Javascript also have a built-in filter

  ```javascript
  const foo = ["bar", "baz"];
  const filterfoo = foo.filter((val) => val === "bar");
  ```

### Associative array

- **php**

  It is an array inside of an array that has an Associative key as a pointer of the values inside the array

  ```php
  <?php
     $books =[
     [
        'title' => 'Book1',
        'author' => 'author1',
        'url' => 'https://example.com',
     ],
     [
        'title' => 'Book2',
        'author' => 'author2',
        'url' => 'https://example1.com',
     ]
  ]
  ?>
  ```

  Then you can loop them like this

  ```php
     <?php foreach ($books as $book): ?>
     <li>
        <a href="<?php $book['url'] ?>">
           <?=$book['title']?>
        </a>
     </li>
     <li><?=$book['author']?></li>
     <?php endforeach; ?>
  ```

- **Javascript**
  Javascript object is the closest comparison to _php's Associative array_.
  It have the same behavior where it has a key associated with value(key/value pair)
  it can also be access using `object['key']` syntax.

  ```javascript
  const book = [
     {
        'title' => 'Book1',
        'author' => 'author1',
        'url' => 'https://example.com',
     },
     {
        'title' => 'Book2',
        'author' => 'author2',
        'url' => 'https://example1.com',
     }
  ]
  ```

  then you can render and loop them like this

  ```javascript
  books.map((book) => (
    <li>
      <a href={book.url}>{book.title}</a>
    </li>
  ));
  ```

### Functions

- **php**
  You can define php using a named function and anonymous function
  functions are fully hoisted meaning you can access them even before where it is declared

  - example of named function:

  ```php
  <?php

      function filterByAuthor($books, $author)
      {
          foreach($books as $book) {
              if($book['author'] === $author) {
                  return  $book;
              }
          }
      };
  ?>
  ```

  - anonymous function :

  ```php
  <?php function ($foo){
     return $foo;
  } ?>
  ```

  since it is anonymous you can assign it to a variable
  and once it is assigned to a variable it will become a **non-hoisted** function

  ```php
  <?php
  const $bar = function ($foo){
     return $foo;
  };
  ?>
  ```

- **Javascript**
  It is also the same in javascript where you can do a function declaration(hoisted fn)
  and a function expression (non-hoisted fn)

  - Function declaration:

  ```javascript
  function foo(bar) {
    return bar;
  }
  ```

  - Function Expression:

  ```javascript
  const foo = function (bar) {
    return bar;
  };
  ```

  or an ES6+ with arrow function

  ```javascript
  const foo = (bar) => bar;
  ```

#### lambda Functions

```php
   <?php
       function filter($items, $fn)
       {
           $filteredArr = [];
           foreach($items as $item) {
               if($fn($item)) {
                   $filteredArr[] = $item;
               }
           }
           return $filteredArr;

       }

       $filterBooks = filter($books, function ($book) {
           return $book['author'] === 'author1';
       });

   ?>
```

---

## Separate logic from template

- php

  In Php Although you can write php logic alongside html as well as its business logic. It is not readable and when the code base grows it will become hard to reason about so it.
  So it is better to split the logic and the view.
  In php, you can split them with this

  ```
  ├── index.php

  └── index.view.php
  ```

  - index.php is where your logic code lives and
  - index.view.php is for your php html

  then you can use `require` or `include`

  ```php
  // index.php (Logic/Controller)
  <?php
  // Here you put your PHP logic, database queries, etc.
  $title = "My Website";
  $books = [
    [
        'title' => 'Book1',
        'author' => 'author1',
        'url' => 'https://example.com'
    ],
    [
        'title' => 'Book2',
        'author' => 'author2',
        'url' => 'https://example1.com'
    ]
  ];

  // After all logic is done, include the view
  require 'index.view.php';
  ```

  then in index.view.php

  ```php

  <!-- index.view.php (Template/View) -->
  <!DOCTYPE html>
  <html>
  <head>
    <title><?= $title ?></title>
  </head>
  <body>
    <h1><?= $title ?></h1>

    <ul>
        <?php foreach ($books as $book): ?>
            <li>
                <a href="<?= $book['url'] ?>">
                    <?= $book['title'] ?>
                </a>
                <p>By <?= $book['author'] ?></p>
            </li>
        <?php endforeach; ?>
    </ul>

  </body>
  </html>
  ```

- Javascript
  It is also the same with javascript you can Separate the html and the Javascript
  to have a redeable and more scalable setup

  ```

  ├── index.html

  └── index.js

  ```

  in `index.html` you can access the js with a script tag

  ```javascript
  <!DOCTYPE html>
  <html>
  <head>
      <title>My Page</title>
      <!-- JavaScript can be included in head or before closing body tag -->
      <script src="index.js"></script>
  </head>
  <body>
      <!-- Or here at the end of body (common practice) -->
      <script src="index.js"></script>
  </body>
  </html>
  ```
