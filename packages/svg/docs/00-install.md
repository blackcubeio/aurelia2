# Blackcube Aurelia 2 toolkit

This toolkit allows easy use of 
 * error presentersvg spritesaria-invalid

## Install

```shell
npm install @blackcube/aurelia2-svgsprites
```

## Registering it in app

```typescript
import Aurelia, { ConsoleSink, LoggerConfiguration, LogLevel} from 'aurelia';
import { SvgConfiguration } from "@blackcube/aurelia2-svgsprites";
import { MyApp } from './my-app';
Aurelia
    .register(SvgConfiguration)
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
import { SvgConfiguration } from "@blackcube/aurelia2-svgsprites";
import { MyApp } from './my-app';

import svgSprites from './img/sprites.svg';

Aurelia
    .register(SvgConfiguration.configure({
        svgSprites: svgSprites
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

- svgSprites: not set,
- svgStyle: `'content'`

- **svgSprites** is used by `bc-svg-sprite` to define the svg sprites file to use
- **svgStyle** is used by `bx-svg-sprite` to set hte style of the container

## Usage `bc-svg-sprite`


```html
<bc-svg-sprite name="circle" class="myClass"></bc-svg-sprite>
```

Will produce:

```html
<svg xmlns="http://www.w3.org/2000/svg" class="myClass">
    <circle cx="7" cy="7" r="7"></circle>
</svg>
```
