import { IEventAggregator, INode, ILogger } from "aurelia";
export declare class RollbackFocus {
    private readonly element;
    private readonly logger;
    private readonly ea;
    event: string;
    private subscriptionListenRollbackFocus;
    private subscriptionChangeRollbackFocus;
    constructor(element: INode, logger: ILogger, ea: IEventAggregator);
    attaching(): void;
    attached(): void;
    detached(): void;
    dispose(): void;
    private onEvent;
    private onRollbackFocus;
    private onRollbackFocusChangeCurrent;
}
//# sourceMappingURL=rollback-focus.d.ts.map