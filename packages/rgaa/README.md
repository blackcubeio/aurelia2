# Blackcube Aurelia 2 rgaa toolkit

Allow easy setup of rgaa attributes

## Using it:

``` 
npm install @blackcube/aurelia2-rgaa
```
### Registering it in app

```typescript
import Aurelia, { ConsoleSink, LoggerConfiguration, LogLevel} from 'aurelia';
import { AriaConfiguration } from "@blackcube/aurelia2-rgaa";
import { MyApp } from './my-app';
Aurelia
    .register(RgaaConfiguration)
    .register(LoggerConfiguration.create({
        level: LogLevel.trace,
        colorOptions: 'colors',
        sinks: [ConsoleSink]
    }))
    .app(MyApp)
    .start();


```

