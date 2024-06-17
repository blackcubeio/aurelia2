import { IContainer, IRegistry } from '@aurelia/kernel';
import {IAriaConfig,IAriaConfiguration} from './configure';
import { AriaCurrent } from "./attributes/aria-current";
import { AriaExpanded } from "./attributes/aria-expanded";
import { AriaHidden } from "./attributes/aria-hidden";
import { AriaInvalid } from "./attributes/aria-invalid";
import { AriaLabel } from "./attributes/aria-label";
import { AriaLive} from "./attributes/aria-live";
import { AriaModal } from "./attributes/aria-modal";
import { AriaSelected } from "./attributes/aria-selected";
import { Focus } from "./attributes/focus";
import { Tabindex } from "./attributes/tabindex";
import { TrapFocus } from "./attributes/trap-focus";
import { TrapFocusChannels } from "./enums/html-trap-focus-enums";
import { CurrentChannels, CurrentModes } from "./enums/aria-current-enums";
import { ExpandedChannels, ExpandedModes } from "./enums/aria-expanded-enums";
import { HiddenChannels, HiddenModes } from "./enums/aria-hidden-enums";
import { InvalidChannels, InvalidModes } from "./enums/aria-invalid-enums";
import { LabelChannels } from "./enums/aria-label-enums";
import { LiveChannels, LiveModes } from "./enums/aria-live-enums";
import { ModalChannels, ModalModes, ModalRoles } from "./enums/aria-modal-enums";
import { SelectedChannels, SelectedModes } from "./enums/aria-selected-enums";
import { HtmlActions} from "./enums/html-enums";
import { FocusChannels } from "./enums/html-focus-enums";
import { TabindexChannels } from "./enums/html-tabindex-enums";
import { IAriaCurrent, IAriaCurrentEnded } from "./interfaces/aria-current-interfaces";
import { IAriaExpanded, IAriaExpandedEnded } from "./interfaces/aria-expanded-interfaces";
import { IAriaHidden, IAriaHiddenEnded } from "./interfaces/aria-hidden-interfaces";
import { IAriaEnded, IAriaElement } from "./interfaces/aria-interfaces";
import { IAriaInvalid, IAriaInvalidEnded } from "./interfaces/aria-invalid-interfaces";
import { IAriaLabel, IAriaLabelEnded } from "./interfaces/aria-label-interfaces";
import { IAriaLive, IAriaLiveEnded } from "./interfaces/aria-live-interfaces";
import { IAriaModal, IAriaModalEnded } from "./interfaces/aria-modal-interfaces";
import { IAriaSelected, IAriaSelectedEnded } from "./interfaces/aria-selected-interfaces";
import { IHtmlFocus, IHtmlFocusEnded } from "./interfaces/html-focus-interfaces";
import { IHtmlElement, IHtmlEnded } from "./interfaces/html-interfaces";
import { IHtmlTabindex, IHtmlTabindexEnded } from "./interfaces/html-tabindex-interfaces";
import { IHtmlTrapFocus, IHtmlTrapFocusEnded, IHtmlTrapFocusKeydown } from "./interfaces/html-trap-focus-interfaces";
import { InvalidFocus} from "./attributes/invalid-focus";
import { InvalidFocusChannels } from "./enums/html-invalid-focus-enums";
import { IHtmlInvalidFocus, IHtmlInvalidFocusEnded } from "./interfaces/html-invalid-focus-interfaces";
import { RollbackFocusChannels } from "./enums/html-rollback-focus-enums";
import { IHtmlRollbackFocus, IHtmlRollbackFocusEnded } from "./interfaces/html-rollback-focus-interfaces";
import { RollbackFocus } from "./attributes/rollback-focus";
export {
    HtmlActions,
    IHtmlEnded,
    IHtmlElement,
    IAriaEnded,
    IAriaElement,
    CurrentChannels,
    CurrentModes,
    IAriaCurrent,
    IAriaCurrentEnded,
    AriaCurrent,
    ExpandedChannels,
    ExpandedModes,
    IAriaExpanded,
    IAriaExpandedEnded,
    AriaExpanded,
    HiddenChannels,
    HiddenModes,
    IAriaHidden,
    IAriaHiddenEnded,
    AriaHidden,
    InvalidChannels,
    InvalidModes,
    IAriaInvalid,
    IAriaInvalidEnded,
    AriaInvalid,
    LabelChannels,
    IAriaLabel,
    IAriaLabelEnded,
    AriaLabel,
    LiveChannels,
    LiveModes,
    IAriaLive,
    IAriaLiveEnded,
    AriaLive,
    ModalChannels,
    ModalModes,
    ModalRoles,
    IAriaModal,
    IAriaModalEnded,
    AriaModal,
    SelectedChannels,
    SelectedModes,
    IAriaSelected,
    IAriaSelectedEnded,
    AriaSelected,
    FocusChannels,
    IHtmlFocus,
    IHtmlFocusEnded,
    Focus,
    TabindexChannels,
    IHtmlTabindex,
    IHtmlTabindexEnded,
    Tabindex,
    IHtmlTrapFocus,
    IHtmlTrapFocusEnded,
    IHtmlTrapFocusKeydown,
    TrapFocus,
    TrapFocusChannels,
    IHtmlInvalidFocus,
    IHtmlInvalidFocusEnded,
    InvalidFocus,
    InvalidFocusChannels,
    RollbackFocusChannels,
    IHtmlRollbackFocus,
    IHtmlRollbackFocusEnded,
    RollbackFocus,
    IAriaConfig,
    IAriaConfiguration,
};
const DefaultComponents: IRegistry[] = [
    AriaCurrent as unknown as IRegistry,
    AriaExpanded as unknown as IRegistry,
    AriaHidden as unknown as IRegistry,
    AriaInvalid as unknown as IRegistry,
    AriaLabel as unknown as IRegistry,
    AriaLive as unknown as IRegistry,
    AriaModal as unknown as IRegistry,
    AriaSelected as unknown as IRegistry,
    Focus as unknown as IRegistry,
    Tabindex as unknown as IRegistry,
    TrapFocus as unknown as IRegistry,
    InvalidFocus as unknown as IRegistry,
    RollbackFocus as unknown as IRegistry,
];

function createAriaConfiguration(options: Partial<IAriaConfig>) {
    return {
        register(container: IContainer) {
            const configClass = container.get(IAriaConfiguration);

            // @ts-ignore
            configClass.options(options);

            return container.register(...DefaultComponents)
        },
        configure(options: IAriaConfig) {
            return createAriaConfiguration(options);
        }
    };
}

export const  AriaConfiguration = createAriaConfiguration({});