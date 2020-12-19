export default class Test {
    route_1(req: any, res: any, next: () => {}) {
        return `Got parameters: ${req}, ${res}, ${next}.`
    }

    route_2(req: any, res: any, next: () => {}) {
        this.helper_function();
        return 2
    }

    helper_function() {
        console.log("Called helper!")
    }
}