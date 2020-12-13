// credit https://github.com/FrontendMasters/hardcore-Functional-js-v2/blob/master/types.js

type Func = (x: any) => any;
type FuncWithSpreadableArgs = (x?: any) => any;
type FuncReturningTask = (x: any) => TaskFn;
type FuncWithSpreadableArgsReturningTask = (f: Func, g: Func) => TaskFn;

interface TaskFn {
    fork: any;
    ap: FuncReturningTask;
    map: FuncReturningTask;
    chain: FuncReturningTask;
    concat: FuncReturningTask;
    fold: FuncWithSpreadableArgsReturningTask;
}

interface TaskObj {
    of: FuncReturningTask;
    rejected?: FuncReturningTask;
    fromPromised?: any;
}

interface Task extends TaskObj {
    (fork: any): TaskFn;
}

const Task: Task = (fork: any) => ({
    fork,
    ap: (other) => Task((rej: Func, res: Func) => fork(rej, (f: Func) => other.fork(rej, (x: any) => res(f(x))))),
    map: (f: Func) => Task((rej: Func, res: Func) => fork(rej, (x: any) => res(f(x)))),
    chain: (f: Func) => Task((rej: Func, res: Func) => fork(rej, (x: any) => f(x).fork(rej, res))),
    concat: (other) =>
        Task((rej: Func, res: Func) =>
            fork(rej, (x: any) =>
                other.fork(rej, (y: any) => {
                    // eslint-disable-next-line no-console
                    console.log('X', x, 'Y', y);
                    res(x.concat(y));
                }),
            ),
        ),
    fold: (f: Func, g: Func) =>
        Task((rej: Func, res: Func) =>
            fork(
                (x: any) => f(x).fork(rej, res),
                (x: any) => g(x).fork(rej, res),
            ),
        ),
});

Task.of = (x: any) => Task((rej: Func, res: Func) => res(x));
Task.rejected = (x: any) => Task((rej: Func, _res: Func) => rej(x));
Task.fromPromised = (fn: FuncWithSpreadableArgs) => (...args: any[]) =>
    Task((rej: Func, res: Func) =>
        fn(...args)
            .then(res)
            .catch(rej),
    );

export { Task, Func };
