# Redcat Aurelia 2 transitions toolkit

Allow easy setup of transitions 

## Using it:

``` 
npm install @blackcube/aurelia2-transition
```
### Registering it in app

```typescript
import Aurelia, { ConsoleSink, LoggerConfiguration, LogLevel} from 'aurelia';
import { TransitionConfiguration } from "@blackcube/aurelia2-transition";
import { MyApp } from './my-app';
Aurelia
    .register(TransitionConfiguration)
    .register(LoggerConfiguration.create({
        level: LogLevel.trace,
        colorOptions: 'colors',
        sinks: [ConsoleSink]
    }))
    .app(MyApp)
    .start();


```

