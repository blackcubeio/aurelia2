# Invalid Focus

## Usage

`bc-invalid-focus` is an attribute used to set `focus` on first invalid element.

## Basic information

### Enumerations

- **InvalidFocusChannels.main**: used to trigger the attribute (input).
- **IHtmlInvalidFocusEnded.end**: used to notify the end of attribute update(output).

### Interfaces

- **IHtmlInvalidFocus**: used to define the message to send to the attribute (input).
- **IHtmlInvalidFocusEnded**: is the notify message sent after the attribute has been updated  (output).

### Bindable properties

- **name**: string (primary) is used to identify the element. It is mandatory and must be equal to the property validated.

## Examples

### Basic usage

Initial markup:

```html
<form bc-invalid-focus="myForm">
    <input type="text" bc-aria-invalid="myField" value.bind="myField & validate">
</form>
```

Produces:

```html
<!-- When myField is valid -->
<form>
    <input type="text" value="bolo">
</form>
<!-- When myField is invalid -->
<form>
    <input type="text" value="bolo" aria-invalid="true" aria-describedby="myField">
    <p id="myField">Field is erroneous</p>
</form>
```

### Communication with the attribute

Initial markup:

```html
<form bc-invalid-focus="myForm">
    <input type="text" bc-aria-invalid="myField" value.bind="myField & validate">
</form>
```

Produces:

```html
<form>
    <input type="text" value="bolo">
</form>
```

Triggering the invalid mode with `focus`:

```typescript
import { IAriaInvalid, IHtmlInvalidFocus, IHtmlInvalidFocusEnded, InvalidChannels, InvalidFocusChannels, InvalidModes, HtmlActions} from "@blackcube/aurelia2-rgaa";
this.rules = validationRules
    .on(Component)
    .ensure('myField')
    .required()
    .withMessage('Field is empty')
this.formFields = ['myField'];

this.disposable = this.ea.subscribe(InvalidChannels.main, (message: IHtmlInvalidFocusEnded) => {
    // no need to follow all fields
    if (message.name === 'myField') {
        const message: IHtmlInvalidFocus = {
            name: "myForm",
            action: HtmlActions.define,
        };
        this.ea.publish(InvalidFocusChannels.main, message);
    }
});
this.validationController.validate()
    .then((result) => {
        if (result.valid) {
            //... perform tasks if the validation is successful
        } else {
            const errors: IAriaInvalid[] = AriaInvalid.convertErrors(result.results);
            this.ea.publish(InvalidChannels.main, errors);
            //... perform tasks if the validation is unsuccessful
        }
    });
```

Produces:

```html
<!-- When myField is valid -->
<form>
    <!-- The focus is not set -->
    <input type="text" value="bolo">
</form>
<!-- When myField is invalid -->
<form>
    <!-- The focus is set on the first invalid element -->
    <input type="text" value="bolo" aria-invalid="true" aria-describedby="myField">
    <p id="myField">Field is erroneous</p>
</form>
```