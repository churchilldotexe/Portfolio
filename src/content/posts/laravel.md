---
name: All About Laravel
date: 2024-11-12
description: learning laravel starting from basic
slug: laravel
---

# All About Laravel

## Blade templating

Blade templating is a way to write php code with html in a clean and readable manner.
It is heavily supported by Laravel because of its simplicity and easy to read syntax but under the hood the code is being converted to vanilla php code.

### $slot

You can think of a way to reserved a slot or certain part of the code. With having that reserved slot, it will make the code more dynamic and become usable on different files.
This is where the concept of component is.
In JS/React it is the same as `children`

Examples:

```php
<?php
//layout.blade.php
<body>{{$slot}}</body>


//home.blade.php
<x-layout>
  <h1>Home</h1>
</x-layout>
```

### name $slot

While slot can make the component dynamic, named $slot will make the component even more dynamic.
The concept of named slot is to have a multiple slot in your component without creating an intersection or conflict with the other slot.

Example:

```php
<?php
//layout.blade.php
<body>
<nav>
  <h1>{{$title}}</h1>
</nav>

{{$slot}}
</body>


//home.blade.php
<x-layout>
  <x-slot:title>Home</x-slot:title>
  <section>

  <p>This is Home</p>
  </section>
</x-layout>
```

To resolve a conflict with slot in order to tell blade which slot to use the naming `<x-slot:title>` important, this way we can tell blade that the content inside the slot title will be render on where `$title` variable is.


