import {TransitionModes, TransitionStatus} from '../enums/transition-enums';

export interface ITransition {
    from: string;
    to: string;
    transition: string;
    transitionLeaving?: string;
    show?: string
    hide?: string
}

export interface ITransitionRun {
    name: string;
    mode: TransitionModes;
}

export interface ITransitionProgress {
    name: string;
    status: TransitionStatus;
}
export interface ITransitionEnd {
    name: string;
    status: TransitionStatus.ENTERED|TransitionStatus.LEFT;
}