
import {IHtmlElement, IHtmlEnded} from "./html-interfaces";

export interface IAriaLabel extends IHtmlElement {
    label?: string;
}
export interface IAriaLabelEnded extends IHtmlEnded {
    label?: string;
}