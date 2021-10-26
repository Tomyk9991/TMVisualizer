export default class State {
    public isInitialState: boolean = false;
    public isFinalState: boolean = false;
    constructor(private name: string, isInitial?: boolean, isFinal?: boolean) {
        this.isInitialState = isInitial ?? false;
        this.isFinalState = isFinal ?? false;
    }

    get Name() { return this.name; }
}
