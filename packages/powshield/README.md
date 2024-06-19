# Blackcube Aurelia 2 powshield toolkit

This toolkit allows easy setup of Powshield.

## Install

Package is available on npm

Then you can install the package:

```shell
npm install @blackcube/aurelia2-powshield
```

### Howto

Process is simple:

1. Fetch a new challenge from the API
2. Solve the challenge to get a solution
3. Verify the solution with the API
4. If the solution is correct, you can submit your form
5. Check the solution serverside to avoid any issue

## API

In order to be mst robust, you should limit the use of a challenge
For example, you can limit the use of a challenge to 2 times:
- First time to allow validation by the JS (frontend)
- Second time to allow validation by the server (backend)

encrypt and decrypt functions should be symmetric to allow the server
to encrypt/decrypt the timestamp and validate the challenge

### PseudoCode to generate a challenge

```
// app constants
key = 'your-secret'

// generate a random string of 12 characters
salt = generateRandomString(12)

// generate a random number between 0 and 50000
// values 0 and 50000 can be tuned to your needs
secretNumber = random_int(0, 50000)

algorithm = 'SHA-256'
// algorithm can be SHA-1, SHA-256, SHA-512

timestamp = time()
cypheredTimestamp = base64_encode(encrypt(timestamp, key))

challenge = hash(algorithm, concat(salt, secretNumber, cypheredTimestamp)
signature = hash_hmac(algorithm, challenge, key);


result = base64_encode(json_encode({
    'algorithm': algorithm,
    'timestamp': cypheredTimestamp,
    'challenge': challenge,
    'salt': salt,
    'signature': $signature,
    'start': 0,
    'max': maxIterations,
}));
// return the result as a base64 encoded JSON object
``` 

### PseudoCode to verify a solution

```
// app constants
key = 'your-secret'
timeValidity = 300 // 5 minutes

// received payload
payload = json_decode(base64_decode($payload))

algorithm = payload.algorithm
cypheredTimestamp = base64_decode(payload.timestamp)
challenge = payload.challenge
number = payload.number
salt = payload.salt
signature = payload.signature

checkChallenge = hash(algorithm, concat(salt, secretNumber, cypheredTimestamp)
checkSignature = hash_hmac(algorithm, challenge, key)

timestamp = decrypt(base64_decode(cypheredTimestamp), key)

validityOk = time < timestamp + timeValidity
challengeOk = hash_equals(checkChallenge, challenge)
signatureOk = hash_equals(checkSignature, signature)

verfied = challengeOk and signatureOk;
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

## Usage in HTML

```html
<template>
    <form bc-powshield="#powshieldSolution">

        <input type="hidden" id="powshieldSolution" name="powshieldSolution" />
        <div>
            <label for="email">EMail</label>
            <input type="email" id="email" name="email" />
        </div>
        <div>
            <button type="submit">Submit</button>
        </div>
    </form>
</template>
```

Form will be protected by Powshield. When the form is submitted, the toolkit will generate a new challenge, and will add the solution to the hidden input field. 
The form will be submitted with the solution. The server will be able to verify the solution.