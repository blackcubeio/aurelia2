import { IContainer } from 'aurelia';
import { ITailwindConfig, ITailwindConfiguration } from './configure';
import { DropdownMenu, FormDropdown, MenuMobile, MenuSidebar } from './attributes';
import { ISidebarService } from './services/sidebar-service';
import { IStorageService } from './services/storage-service';
export { ITailwindConfig, ITailwindConfiguration, ISidebarService, IStorageService, DropdownMenu, FormDropdown, MenuMobile, MenuSidebar, };
export declare const TailwindConfiguration: {
    register(container: IContainer): IContainer;
    configure(options: ITailwindConfig): any;
};
//# sourceMappingURL=index.d.ts.map