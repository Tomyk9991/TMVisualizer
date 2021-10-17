export default class State { // Zustand
    constructor(private name: string) {
    }

    get Name() { return this.name; }
}

export class InitialState extends State {

}

export class FinalState extends State {

}
