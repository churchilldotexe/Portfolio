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

### $attributes

is a helper to pass down the props to the component. Meaning, once set in the component you can use the **Official** attribute of the html tag it was passed to.

Example:

```blade

<!-- component -->
<div {{$attributes}}>
   {{$slot}}
</div>

<!-- usage -->
<x-component class="text-red-100"></x-component>

```

- Merge
  is a method of `$attributes` to merge your component's attribute to the attribute on where the component is being use.

  Example

  ```blade
   <!-- component -->
  <div {{$attributes->merge(['class'=> 'bg-red-500 text-white'])}}>{{$slot}}</div>

   <!-- usage -->
  <x-component class='text-blue-500'>foo</x-component>

  <!-- output -->

  <div class='bg-red-500 text-blue-500'>foo</div>
  ```

- Get
  is another method of `$attributes`, it gets the value of the attribute. You can also define a fallback.
  This is good if you want to create a fallback for components that needs an attributes.

  Example:

  ```blade
  <!-- component -->
  <div class="{{$attributes->get('class','bg-red-500')}}">
     {{$slot}}
  </div>

  <!-- usage -->
  <x-component class="text-blue-500">foo</x-component>
  ```

### $props

has the same usage as attributes, you can define it inline.
If _named slot_ you can define as a children
_props_ can define inline.
It has the same characteristic with **named slot** but the usage is the same with **$attributes**

You can define the props in the component through laravel helper `@props()` function.

```blade
<!-- component -->
{{@props(['foo'=>true])}} <!--array or assoc array to provide default-->

<div class="{{foo? bg-red-500 : bg-blue-500}}"></div>
```

#### :

By Default, if you pass a value through props or attribute it is consider as a string.
To pass the actual data type to the component `:` must be used before the prop.

```blade
<!-- usage  -->
<x-component :foo="true" >bar</x-component>
```

### $props vs $attributes

props is for your custom attributes
attrbiutes is the the official attributes
