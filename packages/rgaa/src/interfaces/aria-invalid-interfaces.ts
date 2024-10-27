
import {InvalidModes} from "../enums/aria-invalid-enums";
import {IHtmlElement, IHtmlEnded} from "./html-interfaces";


export interface IAriaInvalid extends IHtmlElement {
    mode: InvalidModes;
    form?: HTMLFormElement;
}
export interface IAriaInvalidEnded extends IHtmlEnded {
    mode: InvalidModes;
}