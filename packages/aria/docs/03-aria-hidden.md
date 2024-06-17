# Aria Hidden

## Usage

`bc-aria-hidden` is an attribute used to manage the attributes `aria-hidden` of an element.

## Basic information

### Enumerations

- **HiddenChannels.main**: used to trigger the attribute (input).
- **HiddenChannels.end**: used to notify the end of attribute update(output).

- **HiddenModes.true**: used to set the attribute `aria-current` to `'true'`.
- **HiddenModes.false**: used to set the attribute `aria-current` to `'false'`.

### Interfaces

- **IAriaHidden**: used to define the message to send to the attribute (input).
- **IAriaHiddenEnded**: is the notify message sent after the attribute has been updated  (output).

### Bindable properties

- **name**: string (primary) is used to identify the element. It is mandatory and must be unique.
- **enabled**: boolean (default true) is used to activate the attribute on startup.
- **mode**: HiddenModes (default true) is used to define the initial state of the attribute.

## Examples

### Basic usage

Initial markup:

```html
<div bc-aria-hidden="myHidden">...</div>
```

Produces:

```html
<div aria-hidden="true">...</div>
```

### Advanced usage with binding

Initial markup:

```html
<div bc-aria-hidden="name:myHidden; mode:false">...</div>
```

Produces:

```html
<div>...</div>
```

### Communication with the attribute

Initial markup:

```html
<div bc-aria-hidden="myHidden">...</div>
```

Produces:

```html
<div aria-hidden="true">...</div>
```

Triggering the expanded mode:

```typescript
import { IAriaHidden, HiddenChannels, HiddenModes, HtmlActions} from "@blackcube/aurelia2-aria";
const message: IAriaHidden = {
    name: "myHidden",
    mode: HiddenModes.false,
    action: HtmlActions.define,
}
this.ea.publish(HiddenChannels.main, message);
```

Produces:

```html
<div>...</div>
```