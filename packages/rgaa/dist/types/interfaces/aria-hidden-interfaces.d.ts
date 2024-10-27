import { HiddenModes } from "../enums/aria-hidden-enums";
import { IHtmlElement, IHtmlEnded } from "./html-interfaces";
export interface IAriaHidden extends IHtmlElement {
    mode: HiddenModes;
}
export interface IAriaHiddenEnded extends IHtmlEnded {
    mode: HiddenModes;
}
//# sourceMappingURL=aria-hidden-interfaces.d.ts.map