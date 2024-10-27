
import {LiveModes} from "../enums/aria-live-enums";
import {IHtmlElement, IHtmlEnded} from "./html-interfaces";

export interface IAriaLive extends IHtmlElement {
    mode:LiveModes;
}
export interface IAriaLiveEnded extends IHtmlEnded {
    mode:LiveModes;
}