# Blackcube Aurelia 2 webauthn toolkit

This toolkit allows easy setup of Webauthn.

## Install

Package is available on npm

Then you can install the package:

```shell
npm install @blackcube/aurelia2-webauthn
```

### Howto

There are 2 main processes:

1. Register a device
2. login with a device

Those processes are based on the Webauthn standard and need webservices server side.

Youn can find a Yii2 module tohandle the server side part here: [Yii2 Webauthn module](https://github.com/blackcubeio/webauthn)

## Services

5 services methods are available:

- `isAvailable(): Promise<boolean>` to check if the browser supports Webauthn
- `registerDevice(email: string, name: string|null = null): Promise<boolean>` to register a device ,and create associated user
- `attachDevice(): Promise<any>` to attach a device to logged user
- `login(email: string): Promise<boolean>` to login a specific user with a device
- `loginDevice(): Promise<boolean>` to login with a device and let the user select the passkey

## Registering it in app

```typescript
import Aurelia, { ConsoleSink, LoggerConfiguration, LogLevel} from 'aurelia';
import { WebauthnConfiguration } from "@blackcube/aurelia2-webauthn";
import { MyApp } from './my-app';
Aurelia
    .register(WebauthnConfiguration)
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
        prepareAttachDeviceUrl: '/webauthn/prepare-attach-device',
        prepareRegisterDeviceUrl: '/webauthn/prepare-register-device',
        validateRegisterUrl: '/webauthn/validate-register',
        prepareLoginUrl: '/webauthn/prepare-login',
        prepareLoginDeviceUrl: '/webauthn/prepare-login-device',
        validateLoginUrl: '/webauthn/validate-login'
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

- prepareAttachDeviceUrl: '/webauthn/prepare-register-user-device', 
- prepareRegisterDeviceUrl: '/webauthn/prepare-register-device', 
- validateRegisterUrl: '/webauthn/register-validate', 
- prepareLoginUrl: '/webauthn/prepare-login-user-device', 
- prepareLoginDeviceUrl: '/webauthn/prepare-login-device', 
- validateLoginUrl: '/webauthn/login-validate'

- **prepareAttachDeviceUrl** URL used to prepare the attach device process
- **prepareRegisterDeviceUrl** URL used to prepare the register device process
- **validateRegisterUrl** URL used to validate the register/attach process
- **prepareLoginUrl** URL used to prepare the login process for a specific user
- **prepareLoginDeviceUrl** URL used to prepare the login device process
- **validateLoginUrl** URL used to validate the login process


## Usage in HTML

Simple components are available to use the toolkit in HTML.

### Webauthn login

```html
<template>
    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h2 class="py-5 text-xl font-semibold leading-7 text-gray-900">Webauthn login</h2>

        <bc-webauthn-login user.bind="false" route="home"></bc-webauthn-login>
    </div>
</template>
```

Bindable properties are:

- **user** : boolean, if true, the component will show a text input to enter the email of the user to login
- **route** : string, the route to redirect to after a successful login (needs routing to be configured)
- **url** : string, the url to redirect to after a successful login (if routing is not set)

### Webauthn register

```html
<template>
    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h2 class="py-5 text-xl font-semibold leading-7 text-gray-900">Webauthn register</h2>

        <bc-webauthn-register></bc-webauthn-register>
    </div>
</template>
```
Bindable properties are:

- **user** : boolean, if true, the component will show a text input to enter the email and create a new user. If false, the component will use the logged user and attach the device to it
- **route** : string, the route to redirect to after a successful register (needs routing to be configured)
- **url** : string, the url to redirect to after a successful register (if routing is not set)
