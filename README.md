# eec (express-es6-classes) <br/>![Test Suite](https://github.com/bill-ahmed/eec/workflows/Test%20Suite/badge.svg?branch=main)

Define ExpressJS routes as Typescript classes using decorators. Inspired by Ruby on Rails :)

## Install:
```
npm install eec --save
```

This package makes use of decorators and reflect-metadata. so you will also need to enable the following flags in your `tsconfig.json`:
* `"experimentalDecorators": true`
* `"emitDecoratorMetadata": true`

## Usage:

Here's a basic example to get started. Note that `buildController(...)` returns a valid Express Router instance that be used directly with `app.use(...)`.

```typescript
import express from 'express';
import { route, buildController } from 'eec';

class DashboardController {
    static PATH = '/dashboard'

    // Responds to: /dashboard. `index` says to treat it like index of the PATH
    @route({ index: true })
    async index(req, res) {
        res.status(200).send(`Welcome to the dashboard!`);
    }
}

const app = express();
app.use(buildController(DashboardController))

// Go to http://localhost:3000/dashboard/
app.listen(3000, () => { console.log("App listening!") })
```


The `@route()` decorator supports many more configurations. Take a look at the `src/examples` directory to get started with more scenarios.

## Running Examples
To run all the examples provided:
1. Clone this repo
2. `npm install`
3. `npm start`

A server will be listening at port 3000!

## Running tests
```
npm install
npm test
```

## More Example Usages

### Use helpers methods defined in the class
```typescript

class DashboardController {
    static PATH = '/dashboard'

    // Responds to: /dashboard/users. The function name is taken to be the endpoint!
    @route()
    async users(req, res) {
        await this.doSomeStuff();

        res.json({ name: 'John', age: 34 })
    }

    // All method NOT marked as @route() are ignored, but are still avilable in each route.
    async doSomeStuff() { console.log('Working!') }
}
```

### Define HTTP method types explicitly:
```typescript

// Don't want a GET route? Specify a different one!
@route({ type: 'post' })
async updateUsers(req, res) { ... }

// Or use one of the several aliases
@post()
async updateUsers(req, res) { ... }

// Respond to multiple HTTP methods
@route({ type: ['post', 'put', 'delete'] })
async updateRecords(req, res) { ... }
```

### Multiple middleware per route:
```typescript
@route({ middleware: [Logger, Authentication] })
async updateData(req, res) { ... }
```

### Define middleware for all routes:
```typescript
@useMiddleware(Logger)          //Pass in array for multiple
class DashboardController {
    static PATH = '/dashboard'

    // This middleware will run AFTER the Logger!
    @route({ middleware: Authentication })
    async users(req, res) { ... }
}

export default buildController(DashboardController)
```