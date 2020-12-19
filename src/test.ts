export default class Test {
    function_1() {
        return 'fun_1!'
    }

    function_2() {
        return 2
    }

    function_3(req: any, res: any, next: () => {}) {
        return `Got parameters: ${req}, ${res}, ${next}.`
    }
}