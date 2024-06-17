# Trap Focus

## Usage

`blackcube-trap-focus` is an attribute used to keep the focus inside an element (a modal, ...). It also 
capture keyboard events to send a message to close the element.

## Basic information

### Enumerations

- **TrapFocusChannels.main**: used to trigger the attribute (input).
- **TrapFocusChannels.end**: used to notify the end of attribute update(output).
- **TrapFocusChannels.keydown**: used to notify when a key has been pressed(output).

### Interfaces

- **IHtmlTrapFocus**: used to define the message to send to the attribute (input).
- **IHtmlTrapFocusEnded**: is the notify message sent after the attribute has been updated  (output).
- **IHtmlTrapFocusKeydown**: is the notify message sent when a key has been pressed (output).

### Bindable properties

- **name**: string (primary) is used to identify the element. It is mandatory and must be unique.
- **enabled**: boolean (default false) is used to activate the attribute on startup.

## Examples

### Basic usage

Initial markup:

```html
<div bc-trap-focus="myTrapFocus">
    <button>Close</button>
    <a href="#">A link</a>
    ...
</div>
```

Produces:

```html
<div>
    <button>Close</button>
    <a href="#">A link</a>
    ...
</div>
```

### Communication with the attribute

Initial markup:

```html
<div bc-trap-focus="myTrapFocus">
    <button>Close</button>
    <a href="#">A link</a>
    ...
</div>
```

Produces:

```html
<div>
    <button>Close</button>
    <a href="#">A link</a>
    ...
</div>
```

>> Take care to start `trapFocus`, it is not started by default.

Starting the trapFocus:

```typescript
import { IHtmlTrapFocus, TrapFocusChannels, HtmlActions} from "@blackcube/aurelia2-aria";
const message: IHtmlTrapFocus = {
    name: "myTrapFocus",
    action: HtmlActions.define,
}
this.ea.publish(TrapFocusChannels.main, message);
```

Stopping the trapFocus:

```typescript
import { IHtmlTrapFocus, TrapFocusChannels, HtmlActions} from "@blackcube/aurelia2-aria";
const message: IHtmlTrapFocus = {
    name: "myTrapFocus",
    action: HtmlActions.remove,
}
this.ea.publish(TrapFocusChannels.main, message);
```

Listening to keydown of the trapFocus:

```typescript
import { IHtmlTrapFocusKeydown, IHtmlTrapFocus, TrapFocusChannels, HtmlActions} from "@blackcube/aurelia2-aria";
this.disposable = this.ea.subscribe(TrapFocusChannels.keydown, (message: IHtmlTrapFocusKeydown) => {
    // no need to follow all fields
    if (message.name === 'myTrapFocus') {
        if (message.key === 'Escape') {
            // close the modal
            //...
            // stop the trapFocus
            const message: IHtmlTrapFocus = {
                name: "myTrapFocus",
                action: HtmlActions.remove,
            }
            this.ea.publish(TrapFocusChannels.main, message);
        }
    }
});
```

Managing trapFocus with groups:

```html
<div bc-trap-focus="myTrapFocus">
    <button trap-focus-group="g0">Close</button>
    <a href="#" trap-focus-group="g0">A link</a>
    ...
    <ul>
        <li>
            <a href="#" trap-focus-group="g1">A sublink</a>
        </li>
        <li>
            <a href="#" trap-focus-group="g1">A sublink</a>
        </li>
    </ul>
    <button trap-focus-group="g0">Another button</button>
    ...
    <ul>
        <li>
            <a href="#" trap-focus-group="g2">A sublink</a>
        </li>
        <li>
            <a href="#" trap-focus-group="g2">A sublink</a>
        </li>
    </ul>
</div>
```
Trap focus on `g0` group

```typescript
import { IHtmlTrapFocus, TrapFocusChannels, HtmlActions} from "@blackcube/aurelia2-aria";
const message: IHtmlTrapFocus = {
    name: "myTrapFocus",
    action: HtmlActions.define,
    groups: 'g0',
}
this.ea.publish(TrapFocusChannels.main, message);
```

When opening `g2` group, trap focus on `g0` and `g2` groups

```typescript
import { IHtmlTrapFocus, TrapFocusChannels, HtmlActions} from "@blackcube/aurelia2-aria";
const message: IHtmlTrapFocus = {
    name: "myTrapFocus",
    action: HtmlActions.define,
    groups: 'g0 g2',
}
this.ea.publish(TrapFocusChannels.main, message);
```

To rollback to `g0` group without moving the focus

```typescript
import { IHtmlTrapFocus, TrapFocusChannels, HtmlActions} from "@blackcube/aurelia2-aria";
const message: IHtmlTrapFocus = {
    name: "myTrapFocus",
    action: HtmlActions.define,
    groups: 'g0',
    keepFocus: true,
}
this.ea.publish(TrapFocusChannels.main, message);
```
