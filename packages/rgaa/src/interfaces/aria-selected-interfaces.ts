import {SelectedModes} from "../enums/aria-selected-enums";
import {IHtmlElement, IHtmlEnded} from "./html-interfaces";

export interface IAriaSelected extends IHtmlElement {
    mode: SelectedModes;
}
export interface IAriaSelectedEnded extends IHtmlEnded {
    mode: SelectedModes;
}