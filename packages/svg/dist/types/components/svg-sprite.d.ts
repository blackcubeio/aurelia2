import { ILogger } from "aurelia";
import { ISpritesServices } from "../services/sprites-service";
export declare class SvgSprite {
    private readonly logger;
    private readonly spriteServices;
    name: string;
    class: string;
    style: string;
    width: string;
    height: string;
    ariaHidden: string;
    focusable: string;
    svg: SVGElement;
    private svjObjects;
    private ready;
    private attributes;
    constructor(logger?: ILogger, spriteServices?: ISpritesServices);
    bound(): any;
    attaching(): void;
    private drawSvg;
}
//# sourceMappingURL=svg-sprite.d.ts.map