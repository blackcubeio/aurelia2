import { ILogger } from "aurelia";
import { ISvgConfiguration } from "../configure";
export interface ISpritesServices extends SpritesServices {
}
export declare const ISpritesServices: import("@aurelia/kernel").InterfaceSymbol<ISpritesServices>;
export declare class SpritesServices {
    private readonly logger;
    private readonly options;
    private svjObjects;
    private fetchDone;
    constructor(logger?: ILogger, options?: ISvgConfiguration);
    getSprites(): any;
}
//# sourceMappingURL=sprites-service.d.ts.map