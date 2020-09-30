# redux-effects

### Simple, tiny side-effects library for Redux

This library is a simple middleware to deal with side effects outside your action creators
without using thunks or other complex frameworks.

### Example

First, import and add the middleware to your reducer

```js
import {applyMiddleware} from "redux";
import {Effect, effectsMiddleware, afterEffect} from '@jordwest/redux-effects';

return Redux.createStore(
  rootReducer,
  undefined,
  applyMiddleware(effectsMiddleware(rootEffect))
);
```

Let's say you want to fire an API request when a `GET_WIDGETS` action is dispatched.

```js
let rootEffect = Effect.all(getWidgets);

const getWidgets = afterEffect(store => async (action) => {
  if (action.type === ActionType.GET_WIDGETS) {
    const widgets = await myApi.getWidgets();

    store.dispatch({ type: POPULATE_WIDGETS, widgets });
  }
});
```

Because each effect is effectively just a function, you can also pass dependencies to each effect, making it really easy to mock them out in tests.

```js
let rootEffect = myApi => Effect.all(getWidgets(myApi));

const getWidgets = myApi => afterEffect(store => async (action) => {
  if (action.type === ActionType.GET_WIDGETS) {
    const widgets = await myApi.getWidgets();

    store.dispatch({ type: POPULATE_WIDGETS, widgets });
  }
});
```

You can also perform one-time initialization of an effect in the first function:

```ts
const dragDrop = afterEffect(store => {
  let keyDownHandler = (e) => {
    store.dispatch({ type: ActionType.KEY_PRESSED, key: e.key });
  }

  return action => {
    if (action.type === ActionType.START_REPORTING_KEYS) {
      document.addEventListener('keydown', keyDownHandler);
    }
    if (action.type === ActionType.STOP_REPORTING_KEYS) {
      document.removeEventListener('keydown', keyDownHandler);
    }
  }
});
```

Note that handlers wrapped with `afterEffect` run actions after the action has been dispatched. For effects that need to run before the action
has been dispatched and before state has changed, use `beforeEffect`.

These functions are just convenience functions that are shorthand for returning an object as the second parameter. If you need to add an effect that
acts both before and after dispatch, you can skip the convenience functions and instead do:

```js
const myEffect = store => ({
    before: (action) => { ... },
    after: (action) => { ... },
})
```

### TypeScript

Type definitions are included. For easier type checking, it's recommended to create your own effect type to reuse:

```ts
export type AppEffect = Effect<RootState, RootAction>;

const myEffect: AppEffect = afterEffect(store => action => { ... });

// With dependency injection
const myDepEffect = (dependencies: Dependencies): AppEffect => afterEffect(store => action => { ... });
```