---
name: Php and Javascript Side by Side
date: 2024-10-22T00:00:00.000Z
description: A side by side comparison of php and Javascript
slug: php-js
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

  Then you can run the development server with :

  ```bash
  php -S localhost:8888
  ```

  You can specify another port

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

  - #### helper methods and functions

    [string functions documentation](https://www.php.net/ref.strings)

    - `strlen()` : checks the length of a string.

      ```php
      <?php
        $foo = "bar";
        strlen($foo); // 3
      ```

    - `string_replace`:
    - `stringtoupper`;

    # TODO:

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

  #### if-else statement

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

  #### ternary operator

  ```php
  <?php
  echo $_SERVER['REQUEST_URI'] ? "bg-gray-900 text-white" : "text-gray-300";
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

  Array in php is like an ArrayList in data structure where you can grow the array beyond its index.
  In a sense it is the same with Javascript.

  - #### Iteration

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

  - ##### Caveat of looping

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

  - #### built ins

    [php array functions documentation](https://www.php.net/manual/en/book.array.php)

    - filter

      `array_filter`

      ```php
         <?php
             $filterBooks = array_filter($books, function ($book) {
                 return $book['author'] === 'author1';
             });
         ?>
      ```

      this is exactly the same signature with [filter function with lambda fn](#lambda-functions)

- Javascript
  Javascript array also behaves like an Array List where you can grow the length of the array and do a shift and unshift operations

  - #### Iteration

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

  - #### Built-in filter

    Javascript also have a built-in filter

    ```javascript
    const foo = ["bar", "baz"];
    const filterfoo = foo.filter((val) => val === "bar");
    ```

### Associative array

- **php**

  It is an array inside of an array that has an Associative key as a pointer of the values inside the array.
  If array is like an Array List. Associative Array is like a **hashmap** where it has a key and a value associated to it.

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

  You can think of this like adding customized index names so instead of numbers you can add a string that you want.  
  If you think of it this way there is no stopping you of doing it like this:

  ```php
  <?php
  $array2 = array("a" => "green", "b" => "yellow", "blue", "red");
  ```

  This array now have the following indexes/value pairs:

  - a => green
  - b => yellow
  - 0 => blue
  - 1 => red

  notice that since we added a values that dont have an **associated array** with them, it automatically assigned to the default assignments which is a number that starts with 0.

  - #### array_key_exists()

    is a helper function to check if the passed `key` exists in an associated array.
    It takes in two arguments:

    1. **key** - the property or key that you want to check.
    2. **associated array** - the associated array that you want to check to.

    ```php
    <?php
    $foo = [
      'bar' => 1,
      'baz' => 2
    ];

      array_key_exists('bar',$foo); // true
      array_key_exists('boo',$foo); // false, doesnt exist
    ```

  - **Javascript**
    Javascript object is the closest comparison to _php's Associative array_.
    It have the same behavior where it has a key associated with value(key/value pair)
    it can also be access using `object['key']` syntax.

    ```javascript
    const book = [
       {
          title : 'Book1',
          author => 'author1',
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

  - ##### hasOwnProperty()

  _hasOwnProperty()_ is a method that is a close comparison of php's associated array, it checks if the key exist in an object. It has a different syntax since it is a method it must be chain on the object that you want to check.

  ```javascript
  const foo = {
    bar: 1,
    baz: 2,
  };

  console.log(foo.hasOwnProperty("bar")); // true
  console.log(foo.hasOwnProperty("boo")); // false
  ```

### Class

A blueprint is a way to define a structure of variable,constant and functions that can be use multiple times and also can be use differently from one another.

```php
<?php
class Person {
  public $name ;
  public $age;

  public function greet()
  {
    echo $this->name . "greets you.";
  }
}


$person = new Person();

$person->name="foo";
$person->age=25;

$person->greet();

```

- #### Defining constant in class

  - There are some cases where you want to define a _read only_ variable or constant.
  - As it is a read only it cant be change once it is defined.
  - can be access using `::` scope resolution operator without defining a new instance.
  - You can leverage constant inside the class which also give you a benefit of a type inferred constant.

    ```php
    <?php
    class Response {
      public const NOTFOUND = 404;
      public const FORBIDDEN = 403;
    }

      //usage
    var_dump(Response::NOTFOUND) // will output 404
    ```

- #### Defining static in class

  - useful for **pure function** as it can be access without creating a new class instance.
  - can be access using `::` scope resolution operator without defining a new instance.

  ```php
    <?php

    class Validator
    {
        public static function string(string $value, int $min = 1, int $max = INF): bool
        {
            $trimmedValue = trim($value);
            var_dump(strlen($trimmedValue) >= $min);

            return strlen($trimmedValue) >= $min && strlen($trimmedValue) <= $max;
        }
    }
  ```

- #### Owning and wrapping a predefined methods

  - If you need to have a more customized method that that came from php or a method that you dont own, you can wrap it to another method and add your desired logic to it.
  - This is useful for:

    - the methods that you need to do a **guard checks** and you keep on defining those checks.
    - if you can see a pattern that you're adding the same logic over and over again everytime you use the said method.

    Example:

    ```php
    <?

    class Database
    {
        private $connection;
        private $statement;

        public function __construct($config, $userName = "root", $password = "")
        {
            $dsm = "mysql:" . http_build_query($config, "", ";");
            $this->connection = new PDO($dsm, $userName, $password, [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
        }

        public function query($query, $params = [])
        {

            $this->statement = $this->connection->prepare($query);

            $this->statement->execute($params);

            return $this;
        }

        public function getOne()
        {
            return $this->statement->fetch();
        }

        public function getOrAbort()
        {
            $result = $this->getOne();
            if (!$result) {
                abort();
            }

            return $result;
        }

    }
    ```

    This class uses `PDO` which is an object from php. The best example here is `getOrAbort()`, this method need to check if `getOne()` method is truthy if not then abort().

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

## Syntaxes

### var_dump

a function that displays the value or information of a variable, Arrays and objects.
when Array or object it will display recursively no matter the depth in a proper structure.
It is best paired with [`die()`](<php#die()>) and a html's `<pre>` to have a readable structure.

```php
<?php

   $book = [
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
  ];

  echo "<pre>";
  var_dump($book);
  echo "</pre>";

  die();
```

### die

Die is a function that will prevent the code after it to not execute. It is like ,in a way, a `return`.

### filter_var

- syntax: `filter_var(mixed $value, int $filter = FILTER_DEFAULT, array|int $options = 0): mixed`

  - $value - `mixed` types or simply any types.
  - $filter - `int` It corresponds to the `filter types identifiers`. It is a list of constants that corresponds to an ID so it is an int.
  - $options - `array|int` - It can be an associated array or [FILTER TYPES](https://www.php.net/manual/en/filter.filters.php) like the second argument.
    The **associated array** can have:
    - `flags` key for additional filter that corresponds to `filter`, second argument or another [FILTER TYPES](https://www.php.net/manual/en/filter.filters.php) .
    - `options` a more precise or customized filter for the second argument.
  - **return** - `mixed` :
    - returns `bool false` : if the validation fails and in some cases returns `undefined` | `""` for sanitization.
    - returns `filtered value` : if the validation or sanitization is a success.

A php utility function that can validate and sanitize the value you passed in.
It will check the `value`(**first argument**) given and base on the `filter types`(**second argument**) it will perform the following:

- validate
  if the [FILTER TYPES](https://www.php.net/manual/en/filter.filters.php), second argument,starts with `FILTER_VALIDATE_*`.
- sanitize
  if the [FILTER TYPES](https://www.php.net/manual/en/filter.filters.php), second argument,starts with `FILTER_SANITIZE_*`.
- sanitize then validate
  if the [FILTER TYPES](https://www.php.net/manual/en/filter.filters.php), second argument,starts with `FILTER_SANITIZE_*` and then the third argument is also a [FILTER TYPES](https://www.php.net/manual/en/filter.filters.php) but with a `FILTER_VALIDATE_*`.

  example:
  sanitize email and then verify:

  ```php
  <?php
  $value = "         ema:il@email.com";
    filter_var($value, FILTER_SANITIZE_EMAIL ,FILTER_VALIDATE_EMAIL);
  // output: email@email.com
    filter_var($value, FILTER_VALIDATE_EMAIL ,FILTER_SANITIZE_EMAIL);
  // output: false
  ```

  the second filter will return false due to the following:

  - It will validate the value first so if it is a valid email no need to sanitze then will return the filtered value. In our example it has a **white space** and also it has **invalid character** which is `:` so it will invalidate it.

- customized/concise validation and/or sanitization
  if the second argument , [FILTER TYPES](https://www.php.net/manual/en/filter.filters.php), is a validate type(`FILTER_VALIDATE_*`) and the third argument is an associated array with `flags` and/or `options` property.

  examples:
  string with `regExp` filter that accepts lower or capital letters and integers

  ```php
  <?php
    $string = "abc123";
    $filteredString = filter_var($string, FILTER_VALIDATE_REGEXP, [
        "options" => [
            "regexp" => "/^[a-z0-9]+$/i"
        ]
    ]);
  ```

### Superglobals

A pre-defined Contants(variables) that are Accessible on any scopes. Meaning you can access it on any php files and even inside a function.
It is useful to access certain information from server and http. Some notable Superglobals are:

- #### `$_SERVER` : contains information like headers, url path and query, request methods and more

  ```php
    <?php

  ```

  ```php
  <?php
  $_SERVER['REQUEST_URI']
  ```

  will output the following and more:

  ```php

  array(28) {
    ["REMOTE_ADDR"]=>
    string(9) "127.0.0.1"
    ["REMOTE_PORT"]=>
    string(5) "48066"
    ["SERVER_NAME"]=>
    string(9) "localhost"
    ["SERVER_PORT"]=>
    string(4) "8888"
    ["REQUEST_URI"]=>
    string(1) "/"
    ["REQUEST_METHOD"]=>
    string(3) "GET"
    ["SCRIPT_NAME"]=>
    string(10) "/index.php"
    ["HTTP_HOST"]=>
    string(14) "localhost:8888"
    ["HTTP_SEC_FETCH_MODE"]=>
    string(8) "navigate"
    ...
  }

  ```

- #### `$_GET`

  Since `GET` request transfers data to the backend mainly by **URL**. This Superglobals helper is a way:

  - to access the information about a **GET** request
  - to get access to the URL parameter, or query string.
  - It will be parsed in an Associative array as long as it is a query parameter.

  ```php
  <?php
  $url = "https://foo.com/?bar=baz";

  var_dump($_GET);
  /*
  will output:
    array(1) {
      ["bar"]=>
      string(3) "baz"
    }
  */


  var_dump($_GET['bar'])
  // will output :
  # string(3) "baz"
  ```

- #### `$_POST`

  While `GET` method mainly send data through url. `POST` by default dont do that, so `$_POST` Superglobals is a helper from php to access the entire named data from your `form`.

  ```php
  <?php

  var_dump($_POST);
  /*
  array(1) {
    ["body"]=>
    string(3) "foo"
  }
  */
  ```

### parse_url()

It will receive a url as an argument and parse it as a **associative array**
some of those properties are:

- path = the path of the url `/path`
- query = the key/value pairs query parameter. `?query=foo`
- more example:

  ```php
  <?php
  $url = 'http://username:password@hostname:9090/path?arg=value#anchor';

  var_dump(parse_url($url));
  // will output:
  array(8) {
    ["scheme"]=> string(4) "http"
    ["host"]=> string(8) "hostname"
    ["port"]=> int(9090)
    ["user"]=> string(8) "username"
    ["pass"]=> string(8) "password"
    ["path"]=> string(5) "/path"
    ["query"]=> string(9) "arg=value"
    ["fragment"]=> string(6) "anchor"
  }
  ```

### http_response_code(404)

a function that receives a [valid http status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) and it will be sent in the network a valid response code as a response.
it is useful in a case of error like `404` where when the page is not found, you can create a custom page and at the same time you can sent a valid status code to the client.

Example :

```php
<?php

function abort($code = 404)
{

    http_response_code($code);

    require "controller/{$code}.php";
    die();

}
```

this code will send a response code and set the proper controller that corresponds to the status code.

### **DIR**

Syntax: `__DIR__`
a constant from php that will reveal the current directory on where it is invoke. the same as `pwd` for unix terminal.

### DIRECTORY_SEPARATOR

a php constant that will return your OS specific directory Separator. linux/mac: `/`, windows: `\`

### Extract

[docs for extract](https://www.php.net/manual/en/function.extract.php)

syntax: `extract(assoc_arr,extract_rules,prefix)`
args:
`assoc_arr` : it receives an associated array as an argument
`extract_rules` : is a way to check for invalid variable or keys collision. In the case of collision, you can have a rules to either **overwrite**, **skip** or **add prefix** .
`prefix`: depends on the second parameter. if the second parameter rules have a `PREFIX` set to it. you _need_ to defined the prefix through here.

Will extract or imports the variable defined in the assoc_array so that you can access the variable defined to it to the local symbol. It is best paired with `require` in the case of creating a custom logic for it.

spl_autoload_register

[docs for autoload_register](https://www.php.net/manual/en/function.spl-autoload-register.php)
syntax: `spl_autoload_register(?callbale $callback = null, bool $append)`
`callback` a function that will registers the autoload.

Is a function that will detect the classes in your code base and autoload them. The logic behind this is it will return the class that it detects so thats why in the first parameter,callback, must have a `$class parameter` as an identifier for the class detected and with it you can require the directory on where the class is located.

```php
<?php
spl_autoload_register(function ($class) {
    require base_path("core/{$class}.php");
});

```

### Compact

<!--TODO:-->

### Namespace and use

```php
<?php

namespace Core;
use PDO; //do a use declaration like this especially if it is from php/you dont own them

class foo{
  /*code here*/
  PDO($dsn);
}
```

- #### Namespace :

  It is a way to organize your file, especially for those file that have the same functionality.
  You can think of it as a way to register all of the class below it to a symlink

  - tips and some use cases:

    - once it is define especially in the top of the file everything that is applicable to be symlink/namespace will be registered under the namespace and cannot be acquired using require but `use`.
    - It is mostly use to declare classes so that it is ready and can be use in the files it needs to be.
    - It is best paired with lazy loading logic like `spl_autoload_register` for a reason of the project wide declarition of file and also only run them when used/acquired.

  - syntax: `namespace Core;`

  - list of applicable and not applicable for namespaces:

  | Can Use Namespace | Cannot Use Namespace                              |
  | ----------------- | ------------------------------------------------- |
  | Classes           | Variables                                         |
  | Interfaces        | Class Properties                                  |
  | Functions         | Class Methods                                     |
  | Constants         | Language Constructs (echo, include, require, etc) |
  | Traits            | Superglobals ($\_GET, $\_POST, etc)               |
  | Enums             | Static Variables                                  |

- #### use :

  Is a way to **use** the registered namespace/symlink under its `name` specified in the namespace
  creating and using symlink. in our example : `Core`.

  syntax:`use Core\foo`

  - `Core\foo` is the name of the object on where the namespace is declared.
  - `PDO` if the class/logic affected came from php or you dont own the naming must start with `\`. You dont need to specify the name of the namespace since it came from php, directly.
    - `/PDO` other way, if you dont use the `use` syntax to require it you can add `\` before it to be ignore in a namespace.

### header

[docs](https://www.php.net/manual/en/function.header.php)
A way to redirect to another page.
Syntax: `header(Location: url)`
`Location:` - a header string
`url` - the url

---

## Connecting to database

```php
<?php
new PDO($dsn);
```

```php

<?php
$dsn = "mysql:host=localhost;port=3306;dbname=myapp;user=root;password=mypass;charset=utf8mb4";
# or
$dsn = "mysql:host=127.0.0.1;port=3306;dbname=myapp;user=root;password=mypass;charset=utf8mb4";

$pdo = new PDO($dsn);


$statement = $pdo->prepare("SELECT * FROM posts");

$statement->execute();

$posts = $statement->fetchAll(PDO::FETCH_ASSOC);

foreach ($posts as $post) {
    echo "<li>{$post['title']}</li>";
}
```

```php
<?php

class Database
{
    private $connection;
    public function __construct($config, $userName = "root", $password = "")
    {
        $dsm = "mysql:" . http_build_query($config, "", ";");
        $this->connection = new PDO($dsm, $userName, $password, [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
    }

    public function query($query)
    {

        $statement = $this->connection->prepare($query);

        $statement->execute();

        return $statement;
    }

}
```

## Validation and Authorization

Most of the time, validation is needed in our form to set some rules on how and what the shape of data is that is being sent to the server.
While creating a validation in the frontend or in your html. It is important to also have a validation in the server because frontends validation can possibly be bypass.
For example:

- Simple html template for form:

  ```php
  <form method="POST">
    <textarea
      id="body"
      name="body"
      minlength="20"
      maxlenght="1000"
      required
    ></textarea>
    <button>Submit</button>
  </form>
  ```

  With this simple validation we made sure that we have need to pass something in the textarea by adding `required` and also limiting the input by adding `minlenght` and `maxlength`.
  however, this can be bypass, as long as you know the endpoint there is no stoping you for doing something like this .

  ```bash
  # assuming the url below is the end point
  curl -X POST https://localhost:8888/notes/create -d 'body=I just bypass your validation.'
  ```

  with this terminal code you can now bypass the frontend and send a post request to the server using `curl` without interacting to the frontend.

---

## Routing Folder Structure and Conventions

- show for details page (/note/create)
- create for creating (/note)
- index for main Path (/notes)
- destroy for delete requuest response controller (/destroy)

controller naming Following REST Conventions:

- DELETE - will have a name something like `destroy`.
- POST - add the resources to the parent and controller name will be like `strong`. have the same resource with GET.. <!--TODO: elaborate this-->

## Thinking about folder security

when setting up a simple routing system and folder structure to connect the php file with `url`. The files are being required from a source point which is the root's `index.php` but doing this comes with a **security risk** since the source file ,`index.php`, is being rendered together with the code so for example

```bash
.
├── configs.php
├── controller
├── core
├── functions.php
├── phpcs.xml
├── index.php
├── routers.php
├── routes.php
└── views
```

in this example the `index.php` file is collocated with other folder and files so if your index.php is the root which is the path `/` you will be able to access it through `localhost:8888/index.php`. This may look normal but since you can do this it means you can also do this `localhost:8888/functions.php`and you dont intend and dont want to do this .

To secure the root it is recommended to create a `public` folder that will isolate the root file this way you cant access them through url.

```bash
├── public
│   └── index.php
├── functions.php
├── phpcs.xml
├── routers.php
├── routes.php
└── views
```
