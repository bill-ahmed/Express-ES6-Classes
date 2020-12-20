# Express-ES6-Classes
A package to help consolidate express routes. Inspired by Ruby on Rails :)

## Usage:

Here's a basic example to get started. Note that `buildController(...)` returns a valid Express Router instance that be used directly with `app.use(...)`.

```typescript
class DashboardController {
    static PATH = '/dashboard'

    /** index says to treat it like...the index
     * Responds to: /dashboard 
     */
    @route({ index: true })
    async index(req: Request, res: Response) {
        res.status(200).send(`Welcome to the dashboard!`);
    }

    /** The function name is taken to be the endpoint!
     * Responds to: /dashboard/users
     */
    @route({ middleware: Authentication })
    async users(req: Request, res: Response) {
        await doSomeStuff();

        res.json([
            { name: 'John', age: 34 },
            { name: 'Mike', age: 28 }
        ])
    }

    /** All method NOT marked as @route() are ignored, but are still avilable in each route. */
    async doSomeStuff() { ... }
}

export default buildController(DashboardController)
```

The `@route()` decorator supports many more configurations. Take a look at the `src/examples` directory to get started with more scenarios.

## More Example Usages
### Define HTTP method types explicitly:
```typescript

/** Don't want a GET route? Specify a different one! */
@route({ type: 'post' })
async updateUsers(req: Request, res: Response) { ... }

/** Respond to multiple HTTP methods */
@route({ type: ['post', 'put', 'delete'] })
async updateRecords(req: Request, res: Response) { ... }
```

### Multiple middleware per route:
```typescript
@route({ type: ['delete', 'get'], middleware: [Logger, Authentication] })
async updateData(req: Request, res: Response) { ... }
```

### Define middleware for all routes:
```typescript
@useMiddleware(Logger)          /** Pass in array for multiple */
class DashboardController {
    static PATH = '/dashboard'

    /** This middleware will run AFTER the Logger! */
    @route({ middleware: Authentication })
    async users(req: Request, res: Response) { ... }
}

export default buildController(DashboardController)
```