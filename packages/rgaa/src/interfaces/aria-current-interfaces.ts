import {CurrentModes} from "../enums/aria-current-enums";
import {IHtmlElement, IHtmlEnded} from "./html-interfaces";

export interface IAriaCurrent extends IHtmlElement {
    mode: CurrentModes;
}
export interface IAriaCurrentEnded extends IHtmlEnded {
    mode: CurrentModes;
}