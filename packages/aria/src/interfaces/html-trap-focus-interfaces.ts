
import {IHtmlElement, IHtmlEnded} from "./html-interfaces";

export interface IHtmlTrapFocus  extends IHtmlElement {
    groups?: string|false;
    keepFocus?: boolean;
}
export interface IHtmlTrapFocusEnded  extends IHtmlTrapFocus {
}
export interface IHtmlTrapFocusKeydown {
    code: string;
    shiftKey: boolean;
    name: string;
    group?: string|false;
}