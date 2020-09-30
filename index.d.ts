import { Action as ReduxAction, Dispatch } from 'redux';
declare type MiddlewareAPI<State, Action extends ReduxAction> = {
    getState(): State;
    dispatch(action: Action): void;
};
declare type Middleware<State, Action extends ReduxAction> = (store: MiddlewareAPI<State, Action>) => (next: Dispatch<Action>) => (action: Action) => void;
declare type Handler<Action> = (action: Action) => void;
declare type HandlerMap<Action> = {
    before?: Handler<Action>;
    after?: Handler<Action>;
};
export declare type Effect<State, Action extends ReduxAction> = (store: MiddlewareAPI<State, Action>) => HandlerMap<Action>;
export declare namespace Effect {
    function all<State, Action extends ReduxAction>(...effects: Effect<State, Action>[]): Effect<State, Action>;
}
export declare const effectsMiddleware: <State, Action extends ReduxAction<any>>(rootEffect: Effect<State, Action>) => Middleware<State, Action>;
/**
 * Create an effect that executes after the state has been updated
 */
export declare const afterEffect: <State, Action extends ReduxAction<any>>(eff: (store: MiddlewareAPI<State, Action>) => (action: Action) => void) => (store: MiddlewareAPI<State, Action>) => {
    after: (action: Action) => void;
};
/**
 * Create an effect that executes before the reducers change the state
 */
export declare const beforeEffect: <State, Action extends ReduxAction<any>>(eff: (store: MiddlewareAPI<State, Action>) => (action: Action) => void) => (store: MiddlewareAPI<State, Action>) => {
    before: (action: Action) => void;
};
export {};
