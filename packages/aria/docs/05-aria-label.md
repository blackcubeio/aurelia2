# Aria Label

## Usage

`bc-aria-label` is an attribute used to manage the attributes `aria-label` of an element.

## Basic information

### Enumerations

- **LabelChannels.main**: used to trigger the attribute (input).
- **LabelChannels.end**: used to notify the end of attribute update(output).

### Interfaces

- **IAriaLabel**: used to define the message to send to the attribute (input).
- **IAriaLabelEnded**: is the notify message sent after the attribute has been updated  (output).

### Bindable properties

- **name**: string (primary) is used to identify the element. It is mandatory and must be unique.
- **enabled**: boolean (default true) is used to activate the attribute on startup.
- **label**: label (default `''`) is used to define the initial state of the attribute.

## Examples

### Basic usage

Initial markup:

```html
<div bc-aria-label="myLabel">...</div>
```

Produces:

```html
<div>...</div>
```

### Advanced usage with binding

Initial markup:

```html
<div bc-aria-label="name:myLabel; label:My Label">...</div>
```

Produces:

```html
<div aria-label="My Label">...</div>
```

### Communication with the attribute

Initial markup:

```html
<div bc-aria-label="myLabel">...</div>
```

Produces:

```html
<div>...</div>
```

Triggering the label:

```typescript
import { IAriaLabel, LabelChannels, HtmlActions} from "@blackcube/aurelia2-aria";
const message: IAriaLabel = {
    name: "myLabel",
    label: "My Label",
    action: HtmlActions.define,
}
this.ea.publish(LabelChannels.main, message);
```

Produces:

```html
<div aria-label="My Label">...</div>
```