# Rollback Focus

## Usage

`bc-rollback-focus` is an attribute used to define elements where we can rollback focus.

## Basic information

### Enumerations

- **RollbackFocusChannels.main**: used to trigger the focus.
- **TrapFocusChannels.end**: used to notify the end of focus.
- **TrapFocusChannels.change**: inner event to sync all `bc-rollback-focus`.

### Interfaces

- **IHtmlRollbackFocus**: inner interface used to activate/deactivate the attribute (inner).
- **IHtmlRollbackFocusEnded**: is the notify message sent after the focus has been set (output).

### Bindable properties

- **event**: string (primary) is used to define the event which will be use to define the last used element, default to `click`.

## Examples

### Basic usage

Initial markup:

```html
<button type="button" bc-rollback-focus>Open Modal</button>
```

Produces:

```html
<button type="button">Open Modal</button>
```

### Communication with the attribute

Rollback the focus in the modal:

```typescript
import { RollbackFocusChannels } from "@blackcube/aurelia2-rgaa";

this.ea.publish(RollbackFocusChannels.main);
```