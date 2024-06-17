# Aria Live

## Usage

`bc-aria-live` is an attribute used to manage the attributes `aria-live` of an element.

## Basic information

### Enumerations

- **LiveChannels.main**: used to trigger the attribute (input).
- **LiveChannels.end**: used to notify the end of attribute update(output).

- **LiveValues.assertive**: used to set the attribute to assertive.
- **LiveValues.polite**: used to set the attribute to polite.
- **LiveValues.off**: used to set the attribute to off.

### Interfaces

- **IAriaLive**: used to define the message to send to the attribute (input).
- **IAriaLiveEnded**: is the notify message sent after the attribute has been updated  (output).

### Bindable properties

- **name**: string (primary) is used to identify the element. It is mandatory and must be unique.
- **enabled**: boolean (default true) is used to activate the attribute on startup.
- **mode**: LiveValues (default polite) is used to set the attribute to assertive, polite or off.

## Examples

### Basic usage

Initial markup:

```html
<div bc-aria-live="myLive">...</div>
```

Produces:

```html
<div aria-live="polite">...</div>
```

### Advanced usage with binding

Initial markup:

```html
<div bc-aria-live="name:myLive; mode:assertive">...</div>
```

Produces:

```html
<div aria-live="assertive">...</div>
```

### Communication with the attribute

Initial markup:

```html
<div bc-aria-live="myLive">...</div>
```

Produces:

```html
<div aria-live="polite">...</div>
```

Triggering the live:

```typescript
import { IAriaLive, LiveChannels, LiveModes, HtmlActions} from "@blackcube/aurelia2-aria";
const message: IAriaLive = {
    name: "myLive",
    mode: LiveModes.assertive,
    action: HtmlActions.define,
}
this.ea.publish(LiveChannels.main, message);
```

Produces:

```html
<div aria-live="assertive">...</div>
```