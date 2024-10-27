# Redcat Aurelia 2 aria toolkit

Allow easy setup of aria attributes using aurelia2. Mainly a full rewrite of rgaa

## Using it:

``` 
npm install @blackcube/aurelia2-aria
```
### Registering it in app

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

