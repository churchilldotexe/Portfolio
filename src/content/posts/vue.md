---
name: "All About Vue"
date: 2024-11-25
description: "Vue starting from the basic"
slug: "vue"
---

# Vue starting from the basic

Vue is a js framework that is like react.
But the distinct difference between the two is how they re-render

- React is **OPT-IN** reactivity. Meaning, it does a **Global Rerender** pattern where when a state change the whole component will do a re-render(like a scan) and then react will do the **diffing** and compare it with virtual DOM and optimize the DOM tree by only update that actual DOM on which part of the component changed.
  although, it is great, because it is optimized you have to be careful with the **re-rendering** part as it is one of the reason of bottlenecks especially if you have a heavy logic and if you have a piece of code that changes its value on every re-render (like useEffect with omitted dependencies) it will cause you an infinite re-render

- Vue is **OPT-OUT** reactivity. Meaning, it is doing a **Granular Rerender** where it will only re-render the part of the code that actually change.

## Syntaxes

### V-model

- #### Vue Implementation

  Is a two way binding directive from vue.
  It is being passed as an **attributes**.
  By two way means, it is reactive if either of the reference changes state the other one will change as well.

  ```vue
  <div>
     <input type="text" v-model="greeting"/>
     <p>{{ greeting }}</p>
  </div>

  <script>
  Vue.createApp({
    data() {
      return {
        greeting: "hello, world",
      };
    },
  });
  </script>
  ```

  What will happen here is the initial state of input now is **"hello, world"** but when you start typing in the input the `p` tag's _hello world_ will also change base on the value that you typed likewise if you manually/dynamically change the greeting directly in the js/script tag the input's `value` and the `p` tag will also change

- #### React Implementation state + event listener(onChange)

  In react, You can do the equivalent by first creating a **state hook** and connect it with **event listener** specifically, \*_Onchange_  
  like so:

  ```tsx
  import React, { useState } from "react";

  function App() {
    // Declare a state variable `greeting` with an initial value of "hello, world"
    const [greeting, setGreeting] = useState("hello, world");

    // Handle the change event for the input field
    const handleInputChange = (event) => {
      setGreeting(event.target.value); // Update the greeting state with the new input value
    };

    return (
      <div>
        <input
          type="text"
          value={greeting} // Bind the input field's value to the `greeting` state
          onChange={handleInputChange} // Handle input change
        />
        <p>{greeting}</p> {/* Display the current value of greeting */}
      </div>
    );
  }

  export default App;
  ```

- Key difference

  - Vue's implementation is two-way data binding so when the value change the model **greeting** will also change or vice versa
  - React's implementation is doing it in a controlled component, where you bind the input value and onchange handler to the state. The only way to change the state is using the **setGreeting** and must not do it directly to the **greeting** due to react's principle of immutability

### binding and event handlers

- #### Vue's v-binding and v-on

  `v-bind:` - is a way to bind your state to a html attributes to make it more dynamic.

  - `:` -shorthand

  - `v-bind:class` or `:class` - usage

    `v-on:` - is for event handlers to connect the handlers and make it dynamic

  - `@` -shorthand

  - `v-on:click` or `@click` - usage

  example:

  ```vue
  <section>
        <button type="button" v-on:click="toggle">
          change the color below
        </button>
        <p v-bind:class="active? text : 'text-blue-500'">im red</p>
  
  
        <button type="button"  @:click="toggle">
        This is the shorthand
        </button>
        <p :class="active? text : 'text-blue-500'">Im also red</p>
  </section>
  <script>
  Vue.createApp({
    data() {
      return {
        greeting: "hello, world",
        text: "text-red-500",
        active: false,
      };
    },
    methods: {
      toggle() {
        this.active = !this.active;
      },
    },
  }).mount("#app");
  </script>
  ```

- #### React `{}` and `on` event handlers

  `{}` - in react this directive it also used to bind the attributes to be dynamic. in the this braces is like switching to JS world
  `on` - react use `on` + event handlers to bind js to html event handler

  Example:

  ```tsx
  import React, { useState } from "react";

  const App = () => {
    const [active, setActive] = useState(false);

    const toggle = () => {
      setActive(!active);
    };

    return (
      <section>
        {/* Button to toggle the color */}
        <button type="button" onClick={toggle}>
          Change the color below
        </button>
        <p className={active ? "text-red-500" : "text-blue-500"}>I'm red</p>

        {/* no Shorthand */}
      </section>
    );
  };

  export default App;
  ```

### Looping , conditionals and Computed properties

- #### Vue `v-for` , `v-if`,`v-show`, `:key` and `computed()`

  - **`v-for`** is vue way of looping and iterating over an array or objects.

    - implemented through attributes
    - `<div v-for="foo in foos" > {{ foo.bar }} </div>`

    -**`:key`** to avoid bug on when the iterated value changes in a way that it is being destroy and recreated.

    - it is a special attribute for vue to keep track of changes in the itterated value.

  - **`v-show`** is a vue helper that is used to conditionally render an element base on its truthy-ness..

    - under the hood it uses display: none to hide the element.
    - this is useful for performance since you're not destrying and recreating the element.

      - **`v-show vs v-if`** - as stated above, v-show under the hood uses display: none to avoid recreating elements.
        while `v-if` is the opposite, it completely remove the element in the DOM.

  - **`v-if`** conditional syntax of vue. Renders an element base of its truthy-ness.. (the same with js/ts `if`)

  > [!WARNING]
  > Do not use `v-for` with `v-if` on the same element
  > `v-if` will always have a higher priority with fr `vi-for`
  > thus if you use the value/itterated from `v-for` to `vi-if` it will throw an error
  > because `v-if` was being checked first than `v-for`

  [docs regarding v-for and v-if](https://vuejs.org/style-guide/rules-essential.html#avoid-v-if-with-v-for)

  - **`v-else-if`** conditional syntax of vue. For nesting more conditionals.

    - **Restriction:** must be used together with `v-if` or `v-else-if`.

  - **`v-else`** vue syntax for `else`. Where it renders as a fallback of `v-if` when the `v-if` condition wasnt met this can be used as a fallback/default.

    - does not express expression
    - **Restriction:** previous sibling must be either `v-if` or `vi-elseif`

  ```vue
  <div v-if="condition1">Condition 1</div>
  <div v-else-if="condition2">Condition 2</div>
  <div v-else>Fallback</div>
  ```

  - **`computed Properties`** are a special kind of property that is only computed once and then cached. It needs `data properties` and **automatically** keeps track of it and cached the data.

    - It only changes when the data from the `data properties` changes. Which makes it performant.
    - as long as the data properties are not changed it will not re-compute, _no matter how many times how many times it is being used_.

  - **`useMemo`** - React uses `useMemo` to memoize the value of the function. It is the same with computed properties from view , it achieves the same objective that is, but it they also have differences.

    - **explicit** dependency array is required in order to memoize the value correctly if not provided correctly, it will make the value's stale. While computed Properties, automatically tracks and cache the value and will only change the value if its dependency changes.

  Example:

  ```vue
  <section class="space-y-4">
      <fieldset v-show="inProgressAssignments.length">
        <legend class="text-2xl font-bold">Not Accomplished</legend>
  
        <ul v-for="assignment in inProgressAssignments">
          <label v-show="!assignment.completed" :key="assignment.id">
            {{ assignment.name }}
            <input type="checkbox" v-model="assignment.completed" />
          </label>
        </ul>
      </fieldset>
  
      <fieldset v-show="accomplishedAssignments.length">
        <legend class="text-2xl font-bold">Accomplished</legend>
  
        <ul v-for="assignment in accomplishedAssignments ">
          <label :for="assignment.name" :key="assignment.id">
            {{ assignment.name }}
            <input
              type="checkbox"
              :id="assignment.name"
              v-model="assignment.completed"
            />
          </label>
        </ul>
      </fieldset>
    </section>
  <script>
  Vue.createApp({
    data() {
        assignments: [
          { name: "Finish project", completed: false, id: 1 },
          { name: "Read documentation", completed: false, id: 2 },
          { name: "Write homework", completed: false, id: 3 },
        ],
      };
    },

    computed: {
      accomplishedAssignments() {
        return this.assignments.filter((assignment) => assignment.completed);
      },

      inProgressAssignments() {
        return this.assignments.filter((assignment) => !assignment.completed);
      },
    },
  }).mount("#app");
  </script>
  ```

- #### React `map`, `ternary operator`, `key`, `show/hide` and `useMemo`

  - **`map`** - React uses `map` to iterate over an array and return a new array that is now being used to diffing and then render

  - **`key`** - React uses `key` to keep track of the changes in the iterated value.

    - it is the same with vue.

  - `**`show/hide`**` - react have different implementations for `show/hide` an element although it also relies truthy-ness.

    - It uses ternary operator and also it is being implemented inline inside the attribute like style and className. although, they can achieve the same thing like display:none

    - since it uses ternary operator, it can also be used to remove the element from the DOM directly but this implementation is not being implemented inside the attributes

- **`Ternary operator`** - React uses the ternary operator instead of `if`, `else`.

  - and in order todo it the template must opt in to js/ts using `{}`

  example:

  ```tsx
  {
    condition1 ? <div>Condition 1</div> : condition2 ? <div>Condition 2</div> : <div>Fallback</div>;
  }
  ```

```tsx
import React, { useMemo } from "react";

const App = () => {
  const assignments = [
    { name: "Finish project", completed: false },
    { name: "Read documentation", completed: true },
  ];

  // although in this context it is unnecessary to use useMemo
  // but for the sake of comparison, it is being used here
  const completedAssignments = useMemo(() => assignments.filter((a) => a.completed), [assignments]);

  const inProgressAssignments = useMemo(
    () => assignments.filter((a) => !a.completed),
    [assignments]
  );

  return (
    <section>
      {inProgressAssignments.length > 0 && (
        <fieldset>
          <legend>Not Accomplished</legend>
          {inProgressAssignments.map((assignment) => (
            <label key={assignment.name}>
              {assignment.name}
              <input type="checkbox" defaultChecked={assignment.completed} />
            </label>
          ))}
        </fieldset>
      )}

      {completedAssignments.length > 0 && (
        <fieldset>
          <legend>Accomplished</legend>
          {completedAssignments.map((assignment) => (
            <label key={assignment.name}>
              {assignment.name}
              <input type="checkbox" defaultChecked={assignment.completed} />
            </label>
          ))}
        </fieldset>
      )}
    </section>
  );
};

export default App;
```

## Custom components

- #### Vue `custom components` , `template` and `slot`

  - **`custom Components`** - Vue uses the syntax `components` to create reusable and custom html elements.

    - custom components must be under the `components:{}` object.
      - the **key** is the name of the component
      - the **value** can be treated the same as the `app` object (the initialized object from `Vue.createApp` )

  - **`template`** - is the where you write the html for your component.

  - it must be define under the components object and your custom component object.
    like so:

    ```vue
    const app = { components: { 'my-component': { template: '
    <div>Hello World</div>
    ' } } }
    ```

  - **`slot`** - is vue's way to dynamically render content inside a component or nest it.
    - Purpose: Slots allow you to inject custom content into a component, making it highly reusable and flexible.
      Meaning you can use the component in a completely different way from one another.
    - it must be defined under the `template`
    - can be nested with another custom component
    - Usage: once defined you can use the custom component as if it was a native html element and its children will
      render.

  Example:

  ```vue
  <body class="h-full">
     <div id="app" class="contents">
        <foo class="">bar</foo>
     </div>
  </body>

  <script>
  const app = {
    components: {
      foo: {
        template: `<button @click="toggle"><slot/></button>`,
        mounted() {
          console.log("foo");
        },
        methods: {
          toggle() {
            alert("baz");
          },
        },
      },
    },
  };

  Vue.createApp(app).mount("#app");
  </script>
  ```

- #### React `components`, `JSX`, and `children`

  - **`Components`** - React uses components as the building blocks for creating reusable and custom UI elements.

    - Components can be defined as **functions** or **classes**.
    - A component must return JSX, which describes the UI.

  - **`JSX`** - is the syntax extension for JavaScript that allows you to write HTML-like code within React.

    - It is used to define the structure of the component's UI.
    - JSX must be wrapped in a single parent element.

    Example of a functional component:

    ```jsx
    function MyComponent() {
      return <div>Hello World</div>;
    }
    ```

    Example of a class component:

    ```jsx
    class MyComponent extends React.Component {
      render() {
        return <div>Hello World</div>;
      }
    }
    ```

  - **`children`** - React uses the `children` prop to render dynamic content inside a component or to nest elements.

    - It allows passing content between opening and closing component tags.
    - Usage: Define a component that accepts `children` and use it as a wrapper.

    Example:

    ```jsx
    import React from "react";
    import ReactDOM from "react-dom";

    function Foo({ children }) {
      return <button onClick={() => alert("baz")}>{children}</button>;
    }

    const App = () => (
      <div id="app">
        <Foo>bar</Foo>
      </div>
    );

    ReactDOM.render(<App />, document.getElementById("root"));
    ```

---
