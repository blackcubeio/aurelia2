# Aria Invalid

## Usage

`bc-aria-invalid` is an attribute used to manage the attributes `aria-invalid` of an element.

## Basic information

### Enumerations

- **InvalidChannels.main**: used to trigger the attribute (input).
- **InvalidChannels.end**: used to notify the end of attribute update(output).

- **InvalidModes.true**: used to set the attribute `aria-invalid` to `'true'`.
- **InvalidModes.false**: used to set the attribute `aria-invalid` to `'false'`.

### Interfaces

- **IAriaInvalid**: used to define the message to send to the attribute (input).
- **IAriaInvalidEnded**: is the notify message sent after the attribute has been updated  (output).

### Bindable properties

- **name**: string (primary) is used to identify the element. It is mandatory and must be equal to the property validated.
- **enabled**: boolean (default true) is used to activate the attribute on startup.
- **mode**: HiddenModes (default true) is used to define the initial state of the attribute.
- **describedById**: string (default null) is used to define the id of the element that will be used to describe the error, if not set `name` will be used.
- **describedByEnabled**: boolean (default true) is used to activate the attribute `aria-describedby`.
- **labelledById**: string (default null) is used to define the id of the element that will be used to label the error, if not set `name+'Label'` will be used.
- **labelledByEnabled**: boolean (default false) is used to activate the attribute `aria-labeledby`.

## Examples

### Basic usage

Initial markup:

```html
<input type="text" bc-aria-invalid="myField" value.bind="myField & validate">
```

Produces:

```html
<!-- When myField is valid -->
<input type="text" value="bolo">
<!-- When myField is invalid -->
<input type="text" value="bolo" aria-invalid="true" aria-describedby="myField">
<p id="myField">Field is erroneous</p>
```

### Advanced usage with binding

Initial markup:

```html
<input type="text" bc-aria-invalid="name:myField; described-by-id:mySuperField" value.bind="myField & validate">
<!-- or -->
<input type="text" bc-aria-invalid="myField" aria-describedby="mySuperField" value.bind="myField & validate">
```

Produces:

```html
<!-- When myField is valid -->
<input type="text" value="bolo">
<!-- When myField is invalid -->
<input type="text" value="bolo" aria-invalid="true" aria-describedby="mySuperField">
<p id="mySuperField">Field is erroneous</p>
```

### Communication with the attribute

Initial markup:

```html
<input type="text" bc-aria-invalid="myField" value.bind="myField & validate">
```

Produces:

```html
<input type="text" value="bolo">
```

Triggering the invalid mode:

```typescript
import { IAriaInvalid, InvalidChannels, InvalidModes, HtmlActions} from "@blackcube/aurelia2-rgaa";
this.rules = validationRules
    .on(Component)
    .ensure('myField')
    .required()
    .withMessage('Field is empty')

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

Triggering the invalid mode with currently submitted form:

```typescript
import {IAriaInvalid, InvalidChannels, InvalidModes, HtmlActions} from "@blackcube/aurelia2-rgaa";
import {INode} from 'aurelia';
import {newInstanceOf} from '@aurelia/kernel';
import {ValidationController} from '@aurelia/validation-html';
import {IValidationRules} from '@aurelia/validation';

class ExampleComponent {
    private rules: IValidationRules;
    private form: HTMLFormElement|null = null
    public constructor(
        @INode private readonly element: INode,
        @newInstanceOf(ValidationController) private readonly validationController: ValidationController,
        @IValidationRules private readonly validationRules: IValidationRules,
    ) {
        this.rules = validationRules
            .on(Component)
            .ensure('myField')
            .required()
            .withMessage('Field is empty')
    }
    
    public attached(): void {
        this.form = this.element.closest('form');
        this.form?.addEventListener('submit', this.onSubmit);
    }
    
    public detached(): void {
        this.form?.removeEventListener('submit', this.onSubmit);
    }
    
    private onSubmit(event: Event): void {
        this.validationController.validate()
            .then((result) => {
                if (result.valid) {
                    //... perform tasks if the validation is successful
                } else {
                    const errors: IAriaInvalid[] = AriaInvalid.convertErrors(result.results, this.form);
                    this.ea.publish(InvalidChannels.main, errors);
                    //... perform tasks if the validation is unsuccessful
                }
            });
    }
}
```

Produces:

```html
<!-- When myField is valid -->
<input type="text" value="bolo">
<!-- When myField is invalid -->
<input type="text" value="" aria-invalid="true" aria-describedby="myField">
<p id="myField">Field is empty</p>
```