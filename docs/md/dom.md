# Document Object Model (DOM)

## Element

https://developer.mozilla.org/en-US/docs/Web/API/Element

Element is the most general base class from which all element objects (i.e. objects that represent elements) in a Document inherit. It only has methods and properties common to all kinds of elements. More specific classes inherit from Element.

### element.classList

https://developer.mozilla.org/en-US/docs/Web/API/Element/classList

The Element.classList is a read-only property that returns a live DOMTokenList collection of the class attributes of the element. This can then be used to manipulate the class list.

## DOMTokenList

https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList

The DOMTokenList interface represents a set of space-separated tokens. Such a set is returned by Element.classList or HTMLLinkElement.relList, and many others.

### DOMTokenList.add()

The add() method of the DOMTokenList interface adds the given tokens to the list, omitting any that are already present.

```js
const span = document.querySelector("span");
const classes = span.classList;
classes.add("d");
span.textContent = classes;
```
