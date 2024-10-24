export interface IAriaTrapFocus {
    escape: boolean;
    trapElement: HTMLElement;
    rollbackFocusElement?: HTMLElement;
}
export interface IAriaSet {
    name: string;
    attribute: string;
    checked?: 'true' | 'false' | 'mixed';
    controls?: string;
    current?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
    describedby?: string;
    description?: string;
    details?: string;
    disabled?: 'true' | 'false';
    expanded?: string;
    hidden?: 'true' | 'false';
    haspopup?: 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | 'false';
    invalid?: 'grammar' | 'spelling' | 'true' | 'false';
    label?: string;
    labelledby?: string;
    level?: '1' | '2' | '3' | '4' | '5' | '6';
    live?: 'assertive' | 'polite' | 'off';
    modal?: 'true' | 'false';
    pressed?: 'false' | 'mixed' | 'true';
    required?: 'true' | 'false';
    role?: string;
    selected?: 'true' | 'false';
    sort?: 'ascending' | 'descending' | 'none' | 'other';
    tabindex?: string;
}
export interface IAriaRevert {
    name: string;
    attribute: string;
}
//# sourceMappingURL=aria.d.ts.map