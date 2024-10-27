import { ExpandedModes } from "../enums/aria-expanded-enums";
import { IHtmlElement, IHtmlEnded } from "./html-interfaces";
export interface IAriaExpanded extends IHtmlElement {
    mode: ExpandedModes;
}
export interface IAriaExpandedEnded extends IHtmlEnded {
    mode: ExpandedModes;
}
//# sourceMappingURL=aria-expanded-interfaces.d.ts.map