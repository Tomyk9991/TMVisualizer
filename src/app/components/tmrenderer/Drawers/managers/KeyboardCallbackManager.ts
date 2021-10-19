import IKeyboardCallback from "../IKeyboardCallback";

export default abstract class KeyboardCallbackManager {
    public static callbacks: IKeyboardCallback[] = [];
}
