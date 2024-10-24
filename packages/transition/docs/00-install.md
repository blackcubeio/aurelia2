# Blackcube Aurelia 2 transitions toolkit

## Install

```shell
npm install @blackcube/aurelia2-transition
```

## Registering it in app

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

## Additional configuration if needed

You can configure the toolkit by passing a configuration object to the configure method:


## Usage `bc-transition`

`bc-transition` is used to run a css transition on an element.

```css
.box {
    height: 50px;
    width: 50px;
    background-color: #1ce;
}
.box.from {
    transform: translateX(0);
}
.box.to {
    transform: translateX(400px);
}
.box.transition {
    transition: transform 1s linear;
    transition-timing-function: ease-in-out;
}
```

```html
    <div id="myElement" class="box" 
         bc-transition="test" 
         data-transition-from="from" 
         data-transition-to="to"
         data-transition-transition="transition">
        my box
    </div>
```

Run enter (from -> to) transition with an event:

```typescript
    import { ITransitionRun, TransitionChannels, TransitionModes } from '@blackcube/aurelia2-transition';
    const runTransition: ITransitionRun = {
        name: 'test',
        run : TransitionModes.enter
    }
    this.ea.publish(TransitionChannels.main, runTransition);

```

Run enter (from -> to) transition with a service:

```typescript
    import { ITransitionService, ITransition, ITransitionRun, TransitionChannels, TransitionModes } from '@blackcube/aurelia2-transition';
    // transitionService is injected
    const transition: ITransition = {
        from: 'from',
        to: 'to',
        transition: 'transition'
    }
    const element = document.getElementById('myElement') as HTMLElement;
    this.transitionService.enter(element, transition);
```

Run leave (to -> from) transition with an event backward:

```typescript
    import { ITransitionRun, TransitionChannels, TransitionModes } from '@blackcube/aurelia2-transition';
    const runTransition: ITransitionRun = {
        name: 'test',
        run : TransitionModes.leave
    }
    this.ea.publish(TransitionChannels.main, runTransition);

```

Run leave (to -> from) transition with a service:

```typescript
    import { ITransitionService, ITransition, ITransitionRun, TransitionChannels, TransitionModes } from '@blackcube/aurelia2-transition';
    // transitionService is injected
    const transition: ITransition = {
        from: 'from',
        to: 'to',
        transition: 'transition'
    }
    const element = document.getElementById('myElement') as HTMLElement;
    this.transitionService.leave(element, transition);
```
