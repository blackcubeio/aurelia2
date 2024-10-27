import {bindable, containerless, customElement, ILogger, watch, resolve} from "aurelia";
import {ISpritesServices, SpritesServices} from "../services/sprites-service";
import template from './svg-sprite.html';

@containerless()
@customElement({
    name: 'bc-svg-sprite',
    template
})
export class SvgSprite
{
    @bindable() public name: string;
    @bindable() public class: string;
    @bindable() public style: string;
    @bindable() public width: string;
    @bindable() public height: string;
    @bindable() public ariaHidden: string;
    @bindable() public focusable: string;
    public svg:SVGElement;
    private svjObjects:any = {};
    private ready = false;
    private attributes: any = {};
    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('SvgSprite'),
        private readonly spriteServices: ISpritesServices = resolve(ISpritesServices),
    ) {
        this.logger.trace('constructor');
    }

    public bound()
    {
        return this.spriteServices.getSprites().then((svgObjects:any) => {
            this.svjObjects = svgObjects;
            this.ready = true;
            this.drawSvg();
            return this.ready;
        });
    }


    public attaching()
    {
        this.logger.trace('attaching');

    }
    @watch('name')
    private drawSvg() {
        if(this.ready) {
            if (this.svjObjects[this.name]) {
                if (this.svjObjects[this.name].viewBox) {
                    this.svg.setAttribute('viewBox', this.svjObjects[this.name].viewBox);
                }
                this.svg.innerHTML = this.svjObjects[this.name].path.join('\n');
                if (this.class) {
                    this.svg.setAttribute('class', this.class);
                }
                if(this.style) {
                    this.svg.setAttribute('style', this.style);
                }
                if(this.width) {
                    this.svg.setAttribute('width', this.width);
                }
                if(this.height) {
                    this.svg.setAttribute('height', this.height);
                }
                if(this.ariaHidden) {
                    this.svg.setAttribute('aria-hidden', this.ariaHidden);
                }
                if (this.focusable) {
                    this.svg.setAttribute('focusable', this.focusable);
                }

                this.logger.debug('Draw SVG');
            }
        }

    }
}
