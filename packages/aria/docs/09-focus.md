# Focus

## Usage

`bc-focus` is an attribute used to trigger the focus on an element.

## Basic information

### Enumerations

- **FocusChannels.main**: used to trigger the attribute (input).
- **FocusChannels.end**: used to notify the end of attribute update(output).

### Interfaces

- **IHtmlFocus**: used to define the message to send to the attribute (input).
- **IHtmlFocusEnded**: is the notify message sent after the attribute has been updated  (output).

### Bindable properties

- **name**: string (primary) is used to identify the element. It is mandatory and must be unique.
- **enabled**: boolean (default false) is used to activate the focus on startup.

## Examples

### Basic usage

Initial markup:

```html
<button bc-focus="myFocus">...</button>
```

Produces:

```html
<button>...</button>
```

`focus` is not triggered on startup.

### Communication with the attribute

Initial markup:

```html
<button bc-focus="myFocus">...</button>
```

Produces:

```html
<button>...</button>
```

Triggering the focus:

```typescript
import {IHtmlFocus, FocusChannels, HtmlActions} from "@blackcube/aurelia2-aria";
import {HtmlActions} from "@blackcube/aurelia2-aria";

const message: IHtmlFocus = {
    name: "myFocus",
    action: HtmlActions.define
}
this.ea.publish(FocusChannels.main, message);
```

Produces:

```html
<button>...</button>
```

`focus` is triggered on the element.