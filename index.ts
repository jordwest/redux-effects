import { Action as ReduxAction, Dispatch } from 'redux';

type MiddlewareAPI<State, Action extends ReduxAction> = {
    getState(): State;
    dispatch(action: Action): void;
};
type Middleware<State, Action extends ReduxAction> = (
    store: MiddlewareAPI<State, Action>
) => (next: Dispatch<Action>) => (action: Action) => void;

type Handler<Action> = (action: Action) => void;
type HandlerMap<Action> = {
    before?: Handler<Action>;
    after?: Handler<Action>;
};

export type Effect<State, Action extends ReduxAction> = (
    store: MiddlewareAPI<State, Action>
) => HandlerMap<Action>;

export namespace Effect {
    export function all<State, Action extends ReduxAction>(
        ...effects: Effect<State, Action>[]
    ): Effect<State, Action> {
        return (store: MiddlewareAPI<State, Action>) => {
            const actionEffects = effects.map((eff) => eff(store));
            const before: Handler<Action>[] = [];
            const after: Handler<Action>[] = [];
            actionEffects.forEach((eff) => {
                if (eff.before) before.push(eff.before);
                if (eff.after) after.push(eff.after);
            });

            return {
                before:
                    before.length > 0
                        ? (action) => before.forEach((eff) => eff(action))
                        : undefined,
                after:
                    after.length > 0
                        ? (action) => after.forEach((eff) => eff(action))
                        : undefined,
            };
        };
    }
}

export const effectsMiddleware = <State, Action extends ReduxAction>(
    rootEffect: Effect<State, Action>
): Middleware<State, Action> => (store: MiddlewareAPI<State, Action>) => {
    const eff = rootEffect(store);

    return (next: Dispatch<Action>) => (action: Action) => {
        eff.before && eff.before(action);
        next(action);
        eff.after && eff.after(action);
    };
};

/**
 * Create an effect that executes after the state has been updated
 */
export const afterEffect = <State, Action extends ReduxAction>(
    eff: (store: MiddlewareAPI<State, Action>) => (action: Action) => void
) => (store: MiddlewareAPI<State, Action>) => {
    let handler = eff(store);
    return {
        after: handler,
    };
};

/**
 * Create an effect that executes before the reducers change the state
 */
export const beforeEffect = <State, Action extends ReduxAction>(
    eff: (store: MiddlewareAPI<State, Action>) => (action: Action) => void
) => (store: MiddlewareAPI<State, Action>) => {
    let handler = eff(store);
    return {
        before: handler,
    };
};
