import { IContainer } from 'aurelia';
import { IPowshieldConfig, IPowshieldConfiguration } from './configure';
import { IHttpService, HttpService } from './services/http-service';
import { IHttpResponse } from './interfaces/http';
import { IPowshieldService, PowshieldService } from './services/powshield-service';
import { Algorithm } from './types/powshield';
import { IPowshieldChallenge, IPowshieldSolution } from './interfaces/powshield';
import { Powshield } from './attributes/powshield';
export { IPowshieldConfig, IPowshieldConfiguration, IHttpService, HttpService, IHttpResponse, Algorithm, IPowshieldChallenge, IPowshieldSolution, IPowshieldService, PowshieldService, Powshield, };
export declare const PowshieldConfiguration: {
    register(container: IContainer): IContainer;
    configure(options: IPowshieldConfig): any;
};
//# sourceMappingURL=index.d.ts.map