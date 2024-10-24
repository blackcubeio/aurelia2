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
    private list: HTMLUListElement;
    private optionTemplate: HTMLLIElement;
    private generatedId: string;
    private disposable: IDisposable;
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
        this.button = this.element.querySelector('button');
        this.input = this.element.querySelector('input');
        this.input.id = this.generatedId;
        this.ariaService.setExpanded(this.input, 'false');
        this.ariaService.setHasPopup(this.input, 'listbox');
        this.label = this.element.querySelector('label');
        this.label.htmlFor = this.generatedId;
        this.select = this.element.querySelector('select');
        const tpl  = this.element.querySelector('template');
        this.optionTemplate = tpl.content.firstElementChild as HTMLLIElement;
        tpl?.remove();
        this.list = this.element.querySelector('ul');
        this.list.id = this.generatedId + '-list';
        // this.list.classList.remove('hidden');
        this.initList();
    }

    private initList() {
        this.list.querySelectorAll('li').forEach((li) => {
            li.remove();
        });
        Array.from(this.select.options)
            .forEach((option) => {
                const li = this.optionTemplate.cloneNode(true) as HTMLLIElement;
                const button = li.querySelector('button') as HTMLButtonElement;
                this.ariaService.setRole(button, 'option');
                button.dataset['optionid'] = option.value;
                li.dataset['searchValue'] = option.text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                const textElement = li.querySelector('[data-value]') as HTMLElement;
                textElement.textContent = option.text;
                const check = li.querySelector('[data-selected]')as HTMLElement;
                check.dataset['selected'] = option.selected ? 'true' : 'false';
                if (option.selected) {
                    this.ariaService.setSelected(button, 'true');
                    check.classList.remove('hidden');
                    this.input.value = option.text;
                } else {
                    this.ariaService.setSelected(button, 'false');
                    check.classList.add('hidden');
                }
                this.list.appendChild(li);
            });
        this.logger.trace('List inited');
    }

    private updateList(nofilter:boolean = false) {
        const searchValue = this.input.value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        Array.from(this.select.options)
            .forEach((option) => {
                const button = this.list.querySelector('button[data-optionid="'+option.value+'"]') as HTMLButtonElement;
                const li = button.closest('li') as HTMLLIElement;
                const searchableValue = li.dataset['searchValue'].trim();
                if ((nofilter === true) || (searchValue === '') || searchableValue.includes(searchValue)) {
                    li.classList.remove('hidden');
                } else {
                    li.classList.add('hidden');
                }
                const check = li.querySelector('[data-selected]')as HTMLElement;
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

    public attached()
    {
        this.logger.trace('Attached');
        this.select.addEventListener('change', this.onSelectChange);
        this.list.addEventListener('click', this.onSelectElement);
        this.input.addEventListener('input', this.onInputChange);
        this.button.addEventListener('click', this.onToggleList);
        this.input.addEventListener('focusout', this.onFocusOut);
        this.input.addEventListener('keydown', this.onKeyPress)
    }

    public detaching()
    {
        this.logger.trace('Detached');
        this.select.removeEventListener('change', this.onSelectChange);
        this.list.removeEventListener('click', this.onSelectElement);
        this.input.removeEventListener('input', this.onInputChange);
        this.button.removeEventListener('click', this.onToggleList);
        this.input.removeEventListener('focusout', this.onFocusOut);
        this.input.removeEventListener('keydown', this.onKeyPress)
    }

    private onTrapFocusKeydown = (evt: IAriaTrapFocus) => {
        if (evt.escape && evt.trapElement === this.list) {
            this.list.classList.add('hidden');
            this.input.value = this.select.options[this.select.selectedIndex].text;
        }
    };

    private onKeyPress = (evt: KeyboardEvent) => {
        if (evt.key === 'Tab' && !this.list.classList.contains('hidden')) {
            evt.preventDefault();
            evt.stopPropagation();
            this.ariaService.trapFocus(this.list, this.input);
        } else if (evt.key === 'Escape' && !this.list.classList.contains('hidden')) {
            evt.preventDefault();
            evt.stopPropagation();
            this.list.classList.add('hidden');
            this.ariaService.untrapFocus();
            this.input.value = this.select.options[this.select.selectedIndex].text;
        }
    }
    private onFocusOut = (evt: FocusEvent) => {
        this.logger.trace('Focus out');
    }
    private onToggleList = (evt: Event) => {
        this.logger.trace('Toggle list');
        if (this.list.classList.contains('hidden')) {
            this.updateList(true);
            this.list.classList.remove('hidden');
            this.ariaService.trapFocus(this.list, this.input);
        } else {
            this.input.value = this.select.options[this.select.selectedIndex].text;
            this.list.classList.add('hidden');
            this.ariaService.untrapFocus();
        }
    };

    private onSelectChange = (evt: Event) => {
        this.logger.trace('Select changed');
        this.updateList();
    }

    private onInputChange = (evt: Event) => {
        this.logger.trace('Input changed');
        this.updateList();
        this.list.classList.remove('hidden');
    }

    private onSelectElement = (evt: Event) => {
        const button = (evt.target as HTMLButtonElement).closest('button');
        if (this.list.contains(button)) {
            evt.stopPropagation();
            this.logger.trace('Element selected');
            const id = button.dataset['optionid'];
            Array.from(this.select.options).forEach((option) => {
                if (option.value === id) {
                    this.select.value = id;
                }
            });
            const span = button.querySelector('span');
            this.input.value = span.textContent;
            this.select.dispatchEvent(new Event('change'));
            this.list.classList.add('hidden');
            this.ariaService.setExpanded(this.input, 'false');
            this.ariaService.untrapFocus();
            this.input.focus();
        }
    }

}