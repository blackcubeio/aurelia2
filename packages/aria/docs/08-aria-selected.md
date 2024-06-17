# Aria Selected

## Usage

`bc-aria-selected` is an attribute used to manage the attributes `aria-selected` of an element.

## Basic information

### Enumerations

- **SelectedChannels.main**: used to trigger the attribute (input).
- **SelectedChannels.end**: used to notify the end of attribute update(output).

- **SelectedModes.true**: used to set the attribute `aria-selected` to `'true'`.
- **SelectedModes.false**: used to set the attribute `aria-selected` to `'false'`.

### Interfaces

- **IAriaSelected**: used to define the message to send to the attribute (input).
- **IAriaSelectedEnded**: is the notify message sent after the attribute has been updated  (output).

### Bindable properties

- **name**: string (primary) is used to identify the element. It is mandatory and must be unique.
- **enabled**: boolean (default true) is used to activate the attribute on startup.
- **mode**: SelectedModes (default false) is used to define the initial state of the attribute.

## Examples

### Basic usage

Initial markup:

```html
<div bc-aria-selected="mySelected">...</div>
```

Produces:

```html
<div>...</div>
```

### Advanced usage with binding

Initial markup:

```html
<div bc-aria-selected="name:mySelected; mode:true">...</div>
```

Produces:

```html
<div aria-selected="true">...</div>
```

### Communication with the attribute

Initial markup:

```html
<div bc-aria-selected="mySelected">...</div>
```

Produces:

```html
<div>...</div>
```

Triggering the selected mode:

```typescript
import { IAriaSelected, SelectedChannels, SelectedModes, HtmlActions} from "@blackcube/aurelia2-aria";
const message: IAriaSelected = {
    name: "mySelected",
    mode: SelectedModes.true,
    action: HtmlActions.define,
}
this.ea.publish(SelectedChannels.main, message);
```

Produces:

```html
<div aria-selected="true">...</div>
```