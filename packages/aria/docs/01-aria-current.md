# Aria Current

## Usage

`bc-aria-current` is an attribute used to manage the attributes `aria-current` of an element.

## Basic information

### Enumerations

- **CurrentChannels.main**: used to trigger the attribute (input).
- **CurrentChannels.end**: used to notify the end of attribute update(output).

- **CurrentModes.page**: used to set the attribute `aria-current` to `'page'`.
- **CurrentModes.step**: used to set the attribute `aria-current` to `'step'`.
- **CurrentModes.location**: used to set the attribute `aria-current` to `'location'`.
- **CurrentModes.date**: used to set the attribute `aria-current` to `'date'`.
- **CurrentModes.time**: used to set the attribute `aria-current` to `'time'`.
- **CurrentModes.true**: used to set the attribute `aria-current` to `'true'`.
- **CurrentModes.false**: used to set the attribute `aria-current` to `'false'`.

### Interfaces

- **IAriaCurrent**: used to define the message to send to the attribute (input).
- **IAriaCurrentEnded**: is the notify message sent after the attribute has been updated  (output).

### Bindable properties

- **name**: string (primary) is used to identify the element. It is mandatory and must be unique.
- **enabled**: boolean (default true) is used to activate the attribute on startup.
- **mode**: CurrentModes (default false) is used to define the initial state of the attribute.

## Examples

### Basic usage

Initial markup:

```html
<div bc-aria-current="myCurrent">...</div>
```

Produces:

```html
<div>...</div>
```

### Advanced usage with binding

Initial markup:

```html
<div bc-aria-current="name:myCurrent; mode:step">...</div>
```

Produces:

```html
<div aria-current="step">...</div>
```

### Communication with the attribute

Initial markup:

```html
<div bc-aria-current="myCurrent">...</div>
```

Produces:

```html
<div>...</div>
```

Triggering the current mode:

```typescript
import { IAriaCurrent, CurrentChannels, CurrentModes, HtmlActions} from "@blackcube/aurelia2-aria";
const message: IAriaCurrent = {
    name: "myCurrent",
    mode: CurrentModes.page,
    action: HtmlActions.define,
}
this.ea.publish(CurrentChannels.main, message);
```

Produces:

```html
<div aria-current="page">...</div>
```