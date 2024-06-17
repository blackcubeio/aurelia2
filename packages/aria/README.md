# Blackcube Aurelia 2 aria toolkit

This toolkit allows easy setup of aria attributes.

## Install

Package is available on npm

Then you can install the package:

```shell
npm install @blackcube/aurelia2-aria
```

## Registering it in app

```typescript
import Aurelia, { ConsoleSink, LoggerConfiguration, LogLevel} from 'aurelia';
import { AriaConfiguration } from "@blackcube/aurelia2-aria";
import { MyApp } from './my-app';
Aurelia
    .register(AriaConfiguration)
    .register(LoggerConfiguration.create({
        level: LogLevel.trace,
        colorOptions: 'colors',
        sinks: [ConsoleSink]
    }))
    .app(MyApp)
    .start();
```

## Additional configuration if needed

You can configure the toolkit by passing a configuration object to the configure method:

```typescript
import Aurelia, { ConsoleSink, LoggerConfiguration, LogLevel} from 'aurelia';
import { AriaConfiguration } from "@blackcube/aurelia2-aria";
import { MyApp } from './my-app';
Aurelia
    .register(AriaaConfiguration.configure({
        focusableElementsQuerySelector: '[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]',
        invalidElementsQuerySelector: ':invalid',
        keysMonitored: [
            'Escape',
        ],
    }))
    .register(LoggerConfiguration.create({
        level: LogLevel.trace,
        colorOptions: 'colors',
        sinks: [ConsoleSink]
    }))
    .app(MyApp)
    .start();
```

Default values are:

- focusableElementsQuerySelector: '[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [accesskey], summary, canvas, audio, video, details, iframe, [contenteditable]',
- invalidElementsQuerySelector: '[aria-invalid="true"], :invalid',
- keysMonitored: ['Escape']

- **focusableElementsQuerySelector** is used `bc-trap-focus` to cycle through focusable elements
- **invalidElementsQuerySelector** is used by `bc-aria-invalid` to find invalid elements
- **keysMonitored** is used by `bc-trap-focus` to send a close event message