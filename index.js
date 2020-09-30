"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beforeEffect = exports.afterEffect = exports.effectsMiddleware = exports.Effect = void 0;
var Effect;
(function (Effect) {
    function all(...effects) {
        return (store) => {
            const actionEffects = effects.map((eff) => eff(store));
            const before = [];
            const after = [];
            actionEffects.forEach((eff) => {
                if (eff.before)
                    before.push(eff.before);
                if (eff.after)
                    after.push(eff.after);
            });
            return {
                before: before.length > 0
                    ? (action) => before.forEach((eff) => eff(action))
                    : undefined,
                after: after.length > 0
                    ? (action) => after.forEach((eff) => eff(action))
                    : undefined,
            };
        };
    }
    Effect.all = all;
})(Effect = exports.Effect || (exports.Effect = {}));
exports.effectsMiddleware = (rootEffect) => (store) => {
    const eff = rootEffect(store);
    return (next) => (action) => {
        eff.before && eff.before(action);
        next(action);
        eff.after && eff.after(action);
    };
};
/**
 * Create an effect that executes after the state has been updated
 */
exports.afterEffect = (eff) => (store) => {
    let handler = eff(store);
    return {
        after: handler,
    };
};
/**
 * Create an effect that executes before the reducers change the state
 */
exports.beforeEffect = (eff) => (store) => {
    let handler = eff(store);
    return {
        before: handler,
    };
};
