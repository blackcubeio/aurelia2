# Aria Expanded

## Usage

`bc-aria-expanded` is an attribute used to manage the attribute `aria-expanded` of an element.

## Basic information

### Enumerations

- **ExpandedChannels.main**: used to trigger the attribute (input).
- **ExpandedChannels.end**: used to notify the end of attribute update(output).

- **ExpandedModes.true**: used to set the attribute `aria-expanded` to `'true'`.
- **ExpandedModes.false**: used to remove the attribute `aria-expanded`.

### Interfaces

- **IAriaExpanded**: used to define the message to send to the attribute (input).
- **IAriaExpandedEnd**: is the notify message sent after the attribute has been updated  (output).

### Bindable properties

- **name**: string (primary) is used to identify the element. It is mandatory and must be unique.
- **enabled**: boolean (default true) is used to activate the attribute on startup.
- **mode**: ExpandedModes (default false) is used to define the initial state of the attribute.

## Examples

### Basic usage

Initial markup:

```html
<div bc-aria-expanded="myExpandablePanel">...</div>
```

Produces:

```html
<div aria-expanded="false">...</div>
```

### Advanced usage with binding

Initial markup:

```html
<div bc-aria-expanded="name:myExpandablePanel; mode:true">...</div>
```

Produces:

```html
<div aria-expanded="true">...</div>
```

### Communication with the attribute

Initial markup:

```html
<div bc-aria-expanded="myExpandablePanel">...</div>
```

Produces:

```html
<div aria-expanded="false">...</div>
```

Triggering the expanded mode:

```typescript
import { IAriaExpanded, ExpandedChannels, ExpandedModes, HtmlActions} from "@blackcube/aurelia2-aria";
const message: IAriaExpanded = {
    name: "myExpandablePanel",
    mode: ExpandedModes.true,
    action: HtmlActions.define,
}
this.ea.publish(ExpandedChannels.main, message);
```

Produces:

```html
<div aria-expanded="true">...</div>
```