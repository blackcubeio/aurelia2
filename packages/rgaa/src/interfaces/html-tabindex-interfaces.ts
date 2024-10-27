
import {IHtmlElement, IHtmlEnded} from "./html-interfaces";

export interface IHtmlTabindex extends IHtmlElement {
    value: string; // specific value can be "revert"
}
export interface IHtmlTabindexEnded extends IHtmlEnded {
    value: string;
}