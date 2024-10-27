# Blackcube Aurelia 2 rgaa toolkit

Allow easy setup of svgsprites

## Using it:

``` 
npm install @blackcube/aurelia2-svgsprites
```
### Registering it in app

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

