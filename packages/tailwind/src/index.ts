import { IContainer, IRegistry } from 'aurelia';
import {ITailwindConfig, ITailwindConfiguration} from './configure';
import { DropdownMenu, FormDropdown, MenuMobile, MenuSidebar } from './attributes';
import { ISidebarService } from './services/sidebar-service';
import { IStorageService } from './services/storage-service';

export {
    ITailwindConfig,
    ITailwindConfiguration,
    ISidebarService,
    IStorageService,
    DropdownMenu,
    FormDropdown,
    MenuMobile,
    MenuSidebar,
};
const DefaultComponents: IRegistry[] = [
    DropdownMenu as unknown as IRegistry,
    FormDropdown as unknown as IRegistry,
    MenuMobile as unknown as IRegistry,
    MenuSidebar as unknown as IRegistry,
];

function createTailwindConfiguration(options: Partial<ITailwindConfig>) {
    return {
        register(container: IContainer) {
            const configClass = container.get(ITailwindConfiguration);

            // @ts-ignore
            configClass.options(options);
            return container.register(...DefaultComponents)
        },
        configure(options: ITailwindConfig) {
            return createTailwindConfiguration(options);
        }
    };
}

export const TailwindConfiguration = createTailwindConfiguration({});