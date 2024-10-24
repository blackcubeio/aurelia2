import { IContainer } from 'aurelia';
import { IAriaConfig, IAriaConfiguration } from './configure';
import { IAriaSet, IAriaRevert, IAriaTrapFocus } from './interfaces/aria';
import { IAriaService, AriaService } from './services/aria-service';
export { IAriaConfig, IAriaConfiguration, IAriaSet, IAriaRevert, IAriaTrapFocus, IAriaService, AriaService };
export declare const AriaConfiguration: {
    register(container: IContainer): IContainer;
    configure(options: IAriaConfig): any;
};
//# sourceMappingURL=index.d.ts.map