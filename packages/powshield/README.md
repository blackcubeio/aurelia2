# Blackcube Aurelia 2 powshield toolkit

This toolkit allows easy setup of  aria attributes.

## Install

Package is available on npm

Then you can install the package:

```shell
npm install @blackcube/aurelia2-powshield
```

## Registering it in app

```typescript
import Aurelia, { ConsoleSink, LoggerConfiguration, LogLevel} from 'aurelia';
import { PowshieldConfiguration } from "@blackcube/aurelia2-powshield";
import { MyApp } from './my-app';
Aurelia
    .register(PowshieldConfiguration)
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
import { PowshieldConfiguration } from "@blackcube/aurelia2-powshield";
import { MyApp } from './my-app';
Aurelia
    .register(PowshieldConfiguration.configure({
        generateChallengeUrl: '/powshield/generate-challenge',
        verifySolutionUrl: '/powshield/verify-solution',
        solutionInputSelector: '#powshieldSolution'
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

- generateChallengeUrl: '/powshield/generate-challenge',
- verifySolutionUrl: '/powshield/verify-solution',
- solutionInputSelector: '#powshieldSolution'

- **generateChallengeUrl** URL used to generate a new challenge
- **verifySolutionUrl** URL used to verify a solution
- **solutionInputSelector** selector used to get the solution input element which will be used to send the solution to the server