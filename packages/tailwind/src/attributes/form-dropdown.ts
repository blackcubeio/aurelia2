import {
    customAttribute,
    IEventAggregator,
    ILogger,
    ICustomAttributeViewModel,
    IPlatform,
    IDisposable,
    INode,
    resolve
} from 'aurelia';
import {AriaService, IAriaService, IAriaTrapFocus} from '@blackcube/aurelia2-aria';

@customAttribute('bc-tw-form-dropdown')
export class FormDropdown implements ICustomAttributeViewModel
{
    private button: HTMLButtonElement;
    private label: HTMLLabelElement;
    private input: HTMLInputElement;
    private select: HTMLSelectElement;
    private panel: HTMLElement;
    private optionTemplate: HTMLElement;
    private generatedId: string;
    private disposable: IDisposable;
    private isMultiple: boolean = false;
    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('FormDropdown'),
        private readonly platform: IPlatform = resolve(IPlatform),
        private readonly element: HTMLElement = resolve(INode) as HTMLElement,
        private readonly ea: IEventAggregator = resolve(IEventAggregator),
        private ariaService: IAriaService = resolve(IAriaService),
    )
    {
        this.generatedId = 'listbox-' + Math.random().toString(36).substring(2, 7);
    }
    public attaching()
    {
        this.logger.trace('Attaching');
        this.disposable = this.ea.subscribe(AriaService.trapFocusChannel, this.onTrapFocusKeydown);
        this.button = this.element.querySelector('[data-form-dropdown="button"]');
        this.input = this.element.querySelector('[data-form-dropdown="input"]');
        this.label = this.element.querySelector('label');
        this.select = this.element.querySelector('select');
        const tpl  = this.element.querySelector('template');
        this.optionTemplate = tpl.content.firstElementChild as HTMLLIElement;
        this.panel = this.element.querySelector('[data-form-dropdown="panel"]');
        if (!this.panel || !this.button || !this.input || !this.select || !this.optionTemplate || !tpl || !this.label) {
            throw new Error('Missing required elements');
        }
        this.isMultiple = this.select.multiple;
        this.ariaService.setExpanded(this.input, 'false');
        this.ariaService.setHasPopup(this.input, 'listbox');
        this.input.id = this.generatedId;
        this.label.htmlFor = this.generatedId;
        tpl?.remove();
        this.panel.id = this.generatedId + '-list';
        // this.list.classList.remove('hidden');
        this.initList();
    }

    public attached()
    {
        this.logger.trace('Attached');
        this.select.addEventListener('change', this.onSelectChange);
        this.panel.addEventListener('click', this.onSelectElement);
        this.input.addEventListener('input', this.onInputChange);
        this.button.addEventListener('click', this.onToggleList);
        this.input.addEventListener('focusout', this.onFocusOut);
        this.input.addEventListener('keydown', this.onKeyPress);
        this.element.addEventListener('focusout', this.onFocusOutDropdown);
    }

    public detaching()
    {
        this.logger.trace('Detached');
        this.select.removeEventListener('change', this.onSelectChange);
        this.panel.removeEventListener('click', this.onSelectElement);
        this.input.removeEventListener('input', this.onInputChange);
        this.button.removeEventListener('click', this.onToggleList);
        this.input.removeEventListener('focusout', this.onFocusOut);
        this.input.removeEventListener('keydown', this.onKeyPress);
        this.element.removeEventListener('focusout', this.onFocusOutDropdown);
    }

    private initList() {
        this.panel.querySelectorAll('[data-form-dropdown="option"]').forEach((htmlOption) => {
            htmlOption.remove();
        });
        Array.from(this.select.options)
            .forEach((option) => {
                const htmlTemplateOption = this.optionTemplate.cloneNode(true) as HTMLElement;
                const button = htmlTemplateOption.querySelector('[data-form-dropdown="option-button"]') as HTMLElement;
                this.ariaService.setRole(button, 'option');
                button.dataset.optionId = option.value;
                htmlTemplateOption.dataset['searchValue'] = option.text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                const textElement = htmlTemplateOption.querySelector('[data-value]') as HTMLElement;
                textElement.textContent = option.text;
                const check = htmlTemplateOption.querySelector('[data-selected]')as HTMLElement;
                check.dataset['selected'] = option.selected ? 'true' : 'false';
                if (option.selected) {
                    this.ariaService.setSelected(button, 'true');
                    check.classList.remove('hidden');
                } else {
                    this.ariaService.setSelected(button, 'false');
                    check.classList.add('hidden');
                }
                this.panel.appendChild(htmlTemplateOption);
            });
        this.fillInput();
        this.logger.trace('List inited');
    }

    private updateList(nofilter:boolean = undefined) {
        if (nofilter === undefined) {
            if (this.isMultiple) {
                nofilter = true;
            } else {
                nofilter = false;
            }
        }

        const searchableValues = [];
        const searchValue = this.input.value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        if (this.isMultiple) {
            searchValue.split(/\s*,\s*/).forEach((value) => {
                searchableValues.push(value);
            });
        } else {
            searchableValues.push(searchValue);
        }
        Array.from(this.select.options)
            .forEach((option) => {
                const button = this.panel.querySelector('[data-option-id="'+option.value+'"]') as HTMLElement;
                const htmlOption = button.closest('[data-form-dropdown="option"]') as HTMLElement;
                const text = option.text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                let isFound = false;
                searchableValues.forEach((searchableValue) => {
                    if ((nofilter === true) || (searchableValue === '') || text.includes(searchableValue)) {
                        isFound = true;
                    }
                });
                if (isFound) {
                    htmlOption.classList.remove('hidden');
                } else {
                    htmlOption.classList.add('hidden');
                }
                const check = htmlOption.querySelector('[data-selected]')as HTMLElement;
                check.dataset['selected'] = option.selected ? 'true' : 'false';
                if (option.selected) {
                    this.ariaService.setSelected(button, 'true');
                    check.classList.remove('hidden');
                } else {
                    this.ariaService.setSelected(button, 'false');
                    check.classList.add('hidden');
                }
            });
    }

    private onTrapFocusKeydown = (evt: IAriaTrapFocus) => {
        if (evt.escape && evt.trapElement === this.panel) {
            this.panel.classList.add('hidden');
            this.fillInput();
        }
    };

    private onKeyPress = (evt: KeyboardEvent) => {
        if (evt.key === 'Tab' && !this.panel.classList.contains('hidden')) {
            evt.preventDefault();
            evt.stopPropagation();
            this.ariaService.trapFocus(this.panel, this.input);
        } else if (evt.key === 'Escape' && !this.panel.classList.contains('hidden')) {
            evt.preventDefault();
            evt.stopPropagation();
            this.panel.classList.add('hidden');
            this.ariaService.untrapFocus();
            this.fillInput();
        }
    }
    private onFocusOut = (evt: FocusEvent) => {
        this.logger.trace('Focus out');
    }
    private onFocusOutDropdown = (evt: FocusEvent) => {
        this.logger.trace('Focus out dropdown');
        if (!this.element.contains(evt.relatedTarget as Node)) {
            this.panel.classList.add('hidden');
            this.fillInput();
        }
    }
    private onToggleList = (evt: Event) => {
        this.logger.trace('Toggle list');
        if (this.panel.classList.contains('hidden')) {
            this.updateList(true);
            this.panel.classList.remove('hidden');
            this.ariaService.trapFocus(this.panel, this.input);
        } else {
            this.fillInput();
            this.panel.classList.add('hidden');
            this.ariaService.untrapFocus();
        }
    };

    private onSelectChange = (evt: Event) => {
        this.logger.trace('Select changed');
        this.updateList();
    }

    private onInputChange = (evt: Event) => {
        this.logger.trace('Input changed');
        this.updateList(false);
        this.panel.classList.remove('hidden');
    }

    private onSelectElement = (evt: Event) => {
        const button = (evt.target as HTMLButtonElement).closest('[data-form-dropdown="option-button"]') as HTMLElement;
        if (this.panel.contains(button)) {
            evt.stopPropagation();
            this.logger.trace('Element selected');
            const id = button.dataset.optionId;
            Array.from(this.select.options).forEach((option) => {
                if (option.value == id) {
                    if (this.isMultiple) {
                        option.selected = !option.selected;
                    } else {
                        option.selected = true;
                    }
                }
            });
            this.fillInput();
            this.select.dispatchEvent(new Event('change'));
            if (this.isMultiple === false) {
                this.panel.classList.add('hidden');
                this.ariaService.setExpanded(this.input, 'false');
                this.ariaService.untrapFocus();
                this.input.focus();
            }
        }
    }

    private fillInput() {
        if (this.isMultiple) {
            let selectedoptions: Set<string> = new Set();
            Array.from(this.select.options)
                .forEach((option) => {
                    if (option.selected) {
                        selectedoptions.add(option.text);
                    }
                });
            this.input.value = Array.from(selectedoptions).join(', ');
        } else {
            this.input.value = this.select.options[this.select.selectedIndex].text || '';
        }
    }

}