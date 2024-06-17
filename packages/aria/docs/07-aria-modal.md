# Aria Modal

## Usage

`bc-aria-modal` is an attribute used to manage the attributes `aria-modal` and `role` and `tabindex` of an element.

## Basic information

### Enumerations

- **ModalChannels.main**: used to trigger the attribute (input).
- **ModalChannels.end**: used to notify the end of attribute update(output).

- **ModalModes.true**: used to set the attribute `aria-modal` to `'true'` and the attribute `tabindex` to `'-1'`.
- **ModalModes.false**: used to remove the attribute `aria-modal` and revert the attribute `tabindex` to its initial value or remove it.

- **ModalRoles.alertdialog**: used to set the attribute `role` to `'alertdialog'`.
- **ModalRoles.dialog**: used to set the attribute `role` to `'dialog'`.

### Interfaces

- **IAriaModal**: used to define the message to send to the attribute (input).
- **IAriaModalEnded**: is the notify message sent after the attribute has been updated  (output).

### Bindable properties

- **name**: string (primary) is used to identify the element. It is mandatory and must be unique.
- **enabled**: boolean (default true) is used to activate the attribute on startup.
- **tabindexEnabled**: boolean (default false) is used to activate the attribute `tabindex` management.
- **mode**: ModalModes (default false) is used to define the initial state of the attribute.
- **role**: ModalRoles (default dialog) is used to define the initial value of the attribute `role`.

## Examples

### Basic usage

Initial markup:

```html
<div bc-aria-modal="myModal">...</div>
```

Produces:

```html
<div aria-modal="false" role="dialog" tabindex="-1">...</div>
```

### Advanced usage with binding

Initial markup:

```html
<div bc-aria-modal="name:myModal; role:alertdialog">...</div>
<!-- or -->
<div bc-aria-modal="myModal" role="alertdialog">...</div>
```

Produces:

```html
<div aria-modal="false" role="alertdialog" tabindex="-1">...</div>
```

### Communication with the attribute

Initial markup:

```html
<div bc-aria-modal="myModal">...</div>
```

Produces:

```html
<div aria-modal="false" role="dialog" tabindex="-1">...</div>
```

Triggering the expanded mode:

```typescript
import { IAriaModal, ModalChannels, ModalModes, ModalRoles} from "@blackcube/aurelia2-aria";
const message: IAriaModal = {
    name: "myModal",
    mode: ModalModes.true
}
this.ea.publish(ModalChannels.main, message);
```

Produces:

```html
<div aria-modal="true" role="dialog">...</div>
```