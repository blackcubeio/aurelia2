
import {IHtmlElement, IHtmlEnded} from "./html-interfaces";
import {ModalModes, ModalRoles} from "../enums/aria-modal-enums";

export interface IAriaModal extends IHtmlElement {
    mode: ModalModes;
    role?: ModalRoles;
}
export interface IAriaModalEnded extends IHtmlEnded {
    mode: ModalModes;
    role: ModalRoles;
}