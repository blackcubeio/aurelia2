# Blackcube Aurelia 2 Google reCaptcha

This toolkit allows easy use setup of Google reCaptcha.

## Install

Package is available on npm

Then you can install the package:

```shell
npm install @blackcube/aurelia2-recaptcha
```

## Additional configuration if needed

You can configure the toolkit by passing a configuration object to the configure method:

## usage `bc-google-recaptcha`

```typescript
import Aurelia, { ConsoleSink, LoggerConfiguration, LogLevel} from 'aurelia';
import { RecaptchaConfiguration } from "@blackcube/aurelia2-recaptcha";
import { MyApp } from './my-app';


Aurelia
    .register(RecaptchaConfiguration.configure({
        apiKey: '6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        // size: 'normal' default to 'invisible'
    }))
    .register(LoggerConfiguration.create({
        level: LogLevel.trace,
        colorOptions: 'colors',
        sinks: [ConsoleSink]
    }))
    .app(MyApp)
    .start();
```

API Key can also be set in the html:

```html
<script>
    var googleRecaptchaApiKey = '6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
</script>
```
```typescript
import Aurelia, { ConsoleSink, LoggerConfiguration, LogLevel} from 'aurelia';
import { RecaptchaConfiguration } from "@blackcube/aurelia2-recaptcha";
import { MyApp } from './my-app';


Aurelia
    .register(RecaptchaConfiguration.configure({
        verifyUrl: '/api/recaptcha-verify',
    }))
    .register(LoggerConfiguration.create({
        level: LogLevel.trace,
        colorOptions: 'colors',
        sinks: [ConsoleSink]
    }))
    .app(MyApp)
    .start();
```

```html
<form bc-google-recaptcha="">
    <input type="text">
    <button type="submit">Validate</button>
</form>
```

On submit the form will be validated and if valid the form will be submitted.

## verify usage

Create verify action

```php
<?php
/**
 * RecaptchaAction.php
 *
 * PHP version 8.1+
 *
 * @author Philippe Gaultier <pgaultier@gmail.com>
 * @copyright 2018-2024 Blackcube
 * @license https://www.blackcube.io/license license
 * @version XXX
 * @link https://www.blackcube.io
 */

//todo:correct namespace
namespace webapp\actions;

use Exception;
use GuzzleHttp\Client;
use Yii;
use yii\base\Action;
use yii\helpers\Json;
use yii\web\NotAcceptableHttpException;

/**
 * Class RecaptchaAction
 *
 * @author Philippe Gaultier <pgaultier@gmail.com>
 * @copyright 2018-2024 Blackcube
 * @license https://www.blackcube.io/license license
 * @version XXX
 * @link https://www.blackcube.io
 */
class RecaptchaAction extends Action
{
    public $apiSiteSecret = null;
    public function run()
    {
        try {
            $request = Yii::$app->request;
            if (Yii::$app->request->isPost) {
                $token = Yii::$app->request->getBodyParam('token');
                if (empty($token)) {
                    throw new NotAcceptableHttpException('Invalid token');
                }
                $client = new Client();
                $guzzaleResponse = $client->request('POST', 'https://www.google.com/recaptcha/api/siteverify', [
                    'form_params' => [
                        'secret' => $this->apiSiteSecret,
                        'response' => $token,
                    ]
                ]);
                Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
                $jsonResponse = Json::decode($guzzaleResponse->getBody()->getContents());
                if ($guzzaleResponse->getStatusCode() !== 200) {
                    throw new NotAcceptableHttpException('Invalid response from google');
                }
                Yii::$app->response->data = $jsonResponse;
            } else {
                throw new NotAcceptableHttpException('Invalid request method');
            }
            return Yii::$app->response;
        } catch (Exception $e) {
            Yii::error($e->getMessage(), __METHOD__);
            throw $e;
        }
    }
}

```

Add action to API controller

```php 
public function actions()
    {
        $actions = parent::actions();
        $actions['recaptcha-verify'] = [
            'class' => RecaptchaAction::class,
            'apiSiteSecret' => '6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        ];
        return $actions;
    }
```

Configure App:

```typescript
import Aurelia, { ConsoleSink, LoggerConfiguration, LogLevel} from 'aurelia';
import { RecaptchaConfiguration } from "@blackcube/aurelia2-recaptcha";
import { MyApp } from './my-app';


Aurelia
    .register(RecaptchaConfiguration.configure({
        apiKey: '6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        // size: 'normal' default to 'invisible'
        verifyUrl: '/api/recaptcha-verify', // verify url created above
    }))
    .register(LoggerConfiguration.create({
        level: LogLevel.trace,
        colorOptions: 'colors',
        sinks: [ConsoleSink]
    }))
    .app(MyApp)
    .start();
```
Use `bc-google-recaptcha` in your form as usual