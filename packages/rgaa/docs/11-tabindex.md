# Tabindex

## Usage

`bc-tabindex` is an attribute used to manage the attributes `tabindex` of an element.

## Basic information

### Enumerations

- **TabindexChannels.main**: used to trigger the attribute (input).
- **TabindexChannels.end**: used to notify the end of attribute update(output).

### Interfaces

- **IHtmlTabindex**: used to define the message to send to the attribute (input).
- **IHtmlTabindexEnded**: is the notify message sent after the attribute has been updated  (output).

### Bindable properties

- **name**: string (primary) is used to identify the element. It is mandatory and must be unique.
- **enabledDisabled**: boolean (default false) is used to activate the attribute `aria-disabled` on startup.
- **enabled**: boolean (default true) is used to activate the attribute on startup.
- **value**: initial `tabindex` value.

## Examples

### Basic usage

Initial markup:

```html
<button bc-tabindex="myTabindex">...</button>
```

Produces:

```html
<button>...</button>
```

### Advanced usage with binding

Initial markup:

```html
<button bc-tabindex="name:myTabindex; value:-1">...</button>
<!-- or -->
<button bc-tabindex="myTabindex" tabindex="-1">...</button>
```

Produces:

```html
<button tabindex="-1">...</button>
```

### Communication with the attribute

Initial markup:

```html
<button bc-tabindex="myTabindex">...</button>
```

Produces:

```html
<button>...</button>
```

Triggering the tabindex:

```typescript
import { IHtmlTabindex, TabindexChannels, HtmlActions} from "@blackcube/aurelia2-rgaa";
const message: IHtmlTabindex = {
    name: "myTabindex",
    action: HtmlActions.define,
    value: "-1"
}
this.ea.publish(TabindexChannels.main, message);
```
>> `value` can be `revert` to reset the `tabindex` to its previous value.
> 
Produces:

```html
<button tabindex="-1">...</button>
```