---
name: All About Laravel
date: 2024-11-12
description: learning laravel starting from basic
slug: laravel
---

# All About Laravel

<!--toc:start-->

- [All About Laravel](#all-about-laravel)
  - [Blade templating](#blade-templating)
    - [$slot](#slot)
    - [name $slot](#name-slot)
    - [$attributes](#attributes)
    - [$props](#props)
      - [:](#)
    - [$props vs $attributes](#props-vs-attributes)
  - [Helpers](#helpers)
    - [request](#request)
      - [is method](#is-method)
  - [Eloquent](#eloquent)
  - [Terminal Php artisan](#terminal-php-artisan)
  - [model](#model)
    - [Syntax /method of model class](#syntax-method-of-model-class)
      - [**HasFactory**](#hasfactory)
      - [**$table**](#table)
      - [**$fillable**](#fillable)
      - [**guarded**](#guarded)
      - [**hidden**](#hidden)
      - [**Cast**](#cast)
    - [Binding](#binding)
  - [Authenticaton](#authenticaton)
  <!--toc:end-->

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

props is for custom attributes
attrbiutes is the official attributes

## Helpers

A helper functions and classes directly from laravel.

### request

[docs](https://laravel.com/docs/11.x/requests)
Is a helper that returns the current request(http request) instance.

- #### is method

  A part of request method that checks the **path** and return a boolean if it matches the path.
  Example:

  ```blade
  <h1>
     @if(request()->is('/'))
        Im home
     @endif

     Not Home
  </h1>
  ```

  **wildcard** can also be used to match more/subsequent path.

```php
<?php
   request()->is('/dashboard/*');
```

<!-- TODO:  add more .-->

## Eloquent

Laravel ORM. It handles a lot of things when it comes to mapping database to your code such as :

- migration schema - you can define your tables in Database folder
- factory - fast setup and scaffold your database data.
- seed - Best pair with _factory_ and also pairs well with `migrate:fresh --seed`.
- Model

  - defining relationship - using Model to define relationship between tables.
  - setting up pagination.
  - can setup lazy or eager loading.

  <!-- TODO:  better deep dive on this topic especially how to use model methods. Read the docs-->

## Terminal Php artisan

A terminal helper that can scaffold a code depending on what you need.
For example it can help create a model which you can also create migration,factory and test for you in a single `php artisan make:model` And through this, you can define your table columns through the migration and factory so that you can use the helper again to migrate it for you and seed it as well with a single command `php artisan migrate --seed`

There are a lot of artisan command but you can define `help` before the command of the one that you need a help with to check the available flags and options .
Example:
`php artisan help migrate` will give you the flags and options in migrating your schema to the database .

Alternatively, you can run the command `php artisan help` to list all the artisan command.

## model

This is where your database connections, authentication , tables relationship like foreign keys relationship and even CRUD operation

It binds your database table throught Eloquent and connect it to your Laravel code so that you can call it to query in your code base instead of querying directly to your database.

It also binds it to other class like policies(authorization), your Auth facade(authentication), or to your controller

You can define the model by using the terminal command `php artisan make:model` . Where you'll be prompted with questions like names

Example model:

```php
<?php

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
```

This is a model that extends the Authenticatable which is responsible for authentication and the class that connects your User Model to the authentication related helpers provided by laravel, [more info About authentication. ](#authenticaton)

Another example that extends the model

```php
<?php

class Job extends Model
{
    use HasFactory;
    protected $table = 'job_listings';

    // protected $fillable = ['salary','title','employer_id','created_at','updated_at'];
    // or
    protected $guarded = ['id'];
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<App\Models\Employer,App\Models\Job>
     */
    public function employer(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Employer::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<App\Models\Tag,App\Models\Job>
     **/
    public function tags(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {

        return $this->belongsToMany(Tag::class, foreignPivotKey: "job_listing_id");

    }

}
```

### Syntax /method of model class

#### **HasFactory**

- is from the `model` extension that binds with the factory class. This is responsible for seeding and the class that connects to the seesing class.

#### **$table**

- is the table name from your database. To be able to connect your orm model to the correct database table.

#### **$fillable**

- one of the security feature of the `model` class. To protect your database from sql injections you can set what are allowed to be filled in your database and if other field/columns were being stored in your database an _execption_ will be thrown.

#### **guarded**

- the same security feature like **fillable** but the way it define is the opposite. Here you will define what are the columns that must not be query/stored

#### **hidden**

- is another security feature for your model. It is a way to avoid the columns define here from being serialized/access when querying the table. In the example model `User` , it defined `password` and `remember_token` as hidden. This means when the user database is being queried it will not include the password and remember_token.

  Example:

  ```php
  <?php
  $user = User::find(1);
  return response->json();
  ```

  Will return json without password and remember_token.

  This is a useful feature to avoid accidental leaking of sensitive information.

#### **Cast**

- Is a way for laravel/eloquent on how to handle the column when it is being retrieved or stored to the database. Laravel will convert(cast) that data to a certain datatype that you need.

- Usage
  create a protected method name `cast` and return an `assoc array` where the **key** is the `table name` and the **value** is the cast types. Refer in the document for the cast types

  [laravel docs about cast system](https://laravel.com/docs/11.x/eloquent-mutators#attribute-casting)

  For example(from the table above):

  - Hashing the **password**, laravel will hash the password when it is being stored to the database
    and, for example, the user login with the password laravel will also convert it and with the help of `Auth` facade it will compare both of the password to authenticate the user.

### Binding

To bind your route with the model to automatically query your database.
This is helpful to lessen the logic since you can use the binded model for your CRUD operation.
Most used in a route with a wild card.

- Usage
  Just need to define your model as a **type**.

Example:

```php
<?php
    //this
    public function show(Job $job): View
    {
        return view('jobs.show', ['job' => $job  ]);
    }

    // instead of this
    public function show($job): View
    {
        $job = Job::query->find($job);
        return view('jobs.show', ['job' => $job  ]);
    }
```

## Authenticaton

The most common process for authentication are as follows:

1. Validate

   checking the data/input that was sent to the server.

   Example:

   ```php
   <?Php
    $attributes = request()->validate([
      'email' => ['email','required'],
      'password' => ['required',Password::min(6)]
    ]);
   ```

   This will check and validate the data and it returns the validated data
   or the error message back to its source ,
   then this is where you'll receive and display the error message.

   ### Illuminate Password

   `Password` came from `use Illuminate\Validation\Rules\Password;`

2. Attempt to login

For redirect:
redirect()->guest('login');
redirect()->intended();//home page default

## authorization

Add can(gate) to as a prop for your frontend to receive
or fine grained control (like only for admin)

Things to note:

- to access the gate pass it as a prop

```php
<?php

// pass the prop like this

'can' => [
'createUser': Auth::user()->email === 'admin@admin.com'
]
```

or create a policy

```php
<?php

// pass the prop like this

'can' => [
'createUser': Auth::user()->can('create', User::class)
  //                               ^ this is the gate from policy
]
```
