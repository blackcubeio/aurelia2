import { IEventAggregator, ILogger } from "aurelia";
export declare class RollbackFocus {
    private readonly logger;
    private readonly ea;
    private readonly element;
    event: string;
    private subscriptionListenRollbackFocus;
    private subscriptionChangeRollbackFocus;
    constructor(logger?: ILogger, ea?: IEventAggregator, element?: HTMLElement);
    attaching(): void;
    attached(): void;
    detached(): void;
    dispose(): void;
    private onEvent;
    private onRollbackFocus;
    private onRollbackFocusChangeCurrent;
}
//# sourceMappingURL=rollback-focus.d.ts.map