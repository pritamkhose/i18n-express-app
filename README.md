# express-i18n-example
An example project demonstrating an i18n setup for express

# Setup
After cloning and `yarn install`ing, run with `yarn run start`.

# Examples
## Basic Translation
The `/greeting` endpoint will return a message in English (`en`) or Spanish (`es`) based on the `Accept-Language` header.

To get a message in Spanish:
```bash
$ curl localhost:3000/greeting -H "Accept-Language: es"
```

To get a message in English:
```bash
$ curl localhost:3000/greeting -H "Accept-Language: en"
```

## Default Language
English is configured as the default language. The message returned by the `/no-translation` endpoint does not have a translation. No matter what value is passed in the `Accept-Language` header, only the default (English) message will be returned.
```bash
$ curl localhost:3000/no-translation -H "Accept-Language: es"
$ curl localhost:3000/no-translation -H "Accept-Language: fr"
```

## No Message
The `/no-message` endpoint has no message value in any translations. In this case, the message key will be returned.
```bash
$ curl localhost:3000/no-message -H "Accept-Language: es"
```

# Added new i18n key
The add key in code then update json file with `/locales/en` for English save your changes. Run below cmd which take care of all translation via `translate-google` npm package has free and support.
```bash
yarn run i18ntranslate
```
Commit all file repo and deploy code.
List of support loacale are - 
```bash
/i18n-express-app/i18n-translate.js 
const listoflang = ["es", "fr", "ja", "hi", "mr"];

/i18n-express-app/app.js
preload: ["en", "es", "fr", "ja", "hi", "mr"],
```

# Reference
* [Sample code](https://github.com/bmanley91/express-i18n-example/) and details at [Article](https://dev.to/bmanley91/express-i18n-made-easy-2d2o)

