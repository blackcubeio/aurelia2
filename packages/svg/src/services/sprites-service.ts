import {DI, ILogger, resolve} from "aurelia";
import {ISvgConfiguration} from "../configure";

export interface ISpritesServices extends SpritesServices { }
export const ISpritesServices = /*@__PURE__*/DI.createInterface<ISpritesServices>('ISpritesServices', (x) => x.singleton(SpritesServices));

export class SpritesServices {


    private svjObjects:any;
    private fetchDone:boolean = false;


    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('SpritesServices'),
        private readonly options: ISvgConfiguration = resolve(ISvgConfiguration),
    )
    {
        this.logger.trace('constructor')
    }

    public getSprites()
    {
        if (this.fetchDone === false) {
            const svgSprites = this.options.get('svgSprites');
            if(!svgSprites) {
                throw new Error('svgSprites not defined in configuration');
            }
            this.fetchDone = true;
            this.svjObjects = fetch(svgSprites as string)
                .then((response) => {
                    return response.text();
                })
                .then((data) => {
                    this.logger.trace('getSprites:fetch');
                    const parser = new DOMParser();
                    const serializer = new XMLSerializer();
                    const svg = parser.parseFromString(data, 'image/svg+xml');
                    const svjObjects:any = {};
                    svg.querySelectorAll('symbol').forEach((symbol) => {
                        const id = symbol.getAttribute('id');
                        const viewBox = symbol.getAttribute('viewBox');
                        if (id && viewBox) {
                            const object:any = {
                                viewBox: viewBox,
                                path: []
                            };
                            symbol.childNodes.forEach((path) => {
                                const nodeString = serializer.serializeToString(path).trim();
                                if (nodeString.length > 1) {
                                    object.path.push(nodeString);
                                }
                            })
                            svjObjects[id] = object;
                        }
                    });
                    return svjObjects;
                });
        }

        return this.svjObjects;
    }
}