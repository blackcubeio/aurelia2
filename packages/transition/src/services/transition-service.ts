import {DI, IEventAggregator, ILogger, IPlatform, resolve} from 'aurelia';
import {ITransition} from '../interfaces/transition-interface';
import {TransitionChannels, TransitionStatus} from '../enums/transition-enums';

export const ITransitionService =
    DI.createInterface<ITransitionService>('ITransitionService', (x) =>
        x.singleton(TransitionService)
    );
export interface ITransitionService extends TransitionService {}
class TransitionService
{
    public constructor(
        private readonly logger: ILogger = resolve(ILogger).scopeTo('TransitionService'),
        private readonly platform: IPlatform = resolve(IPlatform),
        private readonly ea: IEventAggregator = resolve(IEventAggregator),
    ) {
        this.logger.trace('Constructing');
    }

    public enter(element: HTMLElement|SVGElement, transition: ITransition, eventName = undefined, noTransition = false)
    {
        if (noTransition) {
            return this.enterWithoutTransition(element, transition, eventName);
        } else {
            return this.enterWithTransition(element, transition, eventName);
        }
    }
    public leave(element: HTMLElement|SVGElement, transition: ITransition, eventName = undefined, noTransition = false)
    {
        if (noTransition) {
            return this.leaveWithoutTransition(element, transition, eventName);
        } else {
            return this.leaveWithTransition(element, transition, eventName);
        }
    }

    private enterWithTransition(element: HTMLElement|SVGElement, transition: ITransition, eventName = undefined)
    {
        if (eventName) {
            this.ea.publish(TransitionChannels.progress, {
                name: eventName,
                status: TransitionStatus.ENTERING
            });
        }
        let transitionRunningTimeout;
        let transitionFinished = false;
        const onTransitionEnterRun = (evt: TransitionEvent) => {
            if (evt.target === element) {
                evt.stopPropagation();
                element.removeEventListener('transitionrun', onTransitionEnterRun);
                if (transitionRunningTimeout) {
                    this.platform.clearTimeout(transitionRunningTimeout);
                    transitionRunningTimeout = undefined;
                }
                return Promise.resolve();
            }
        };
        const onTransitionEnterEnd = (evt: TransitionEvent) => {
            if (evt.target === element) {
                evt.stopPropagation();
                element.removeEventListener('transitionend', onTransitionEnterEnd);
                element.removeEventListener('transitioncancel', onTransitionEnterEnd);
                transition.transition.split(/\s+/)
                    .forEach((className) => element.classList.remove(className));
                transitionFinished = true;
                return Promise.resolve();
            }
        };
        element.addEventListener('transitionend', onTransitionEnterEnd);
        element.addEventListener('transitioncancel', onTransitionEnterEnd);
        element.addEventListener('transitionrun', onTransitionEnterRun);
        return this.cleanupTransition(element, transition)
            .then(() => {
                if (transition.show) {
                    element.style.display = transition.show;
                    return this.waitAnimationFrame();
                } else {
                    return Promise.resolve();
                }
            })
            .then(() => {
                transition.transition.split(/\s+/)
                    .forEach((className) => element.classList.add(className));
                return Promise.resolve();
            })
            .then(() => {
                return this.waitAnimationFrame();
            })
            .then(() => {
                transitionRunningTimeout = this.platform.setTimeout(() => {
                    this.logger.warn('Transition timeout - Detach events handler and cleanup');
                    element.removeEventListener('transitionend', onTransitionEnterEnd);
                    element.removeEventListener('transitioncancel', onTransitionEnterEnd);
                    element.removeEventListener('transitionrun', onTransitionEnterRun);
                    transition.transition.split(/\s+/)
                        .forEach((className) => element.classList.remove(className));
                }, 250);
                transition.from.split(/\s+/)
                    .forEach((className) => element.classList.remove(className));
                transition.to.split(/\s+/)
                    .forEach((className) => element.classList.add(className));
                return Promise.resolve();
            })
            .then(() => {
                return new Promise((resolve, reject) => {
                    let t = this.platform.setInterval(() => {
                        if (transitionFinished) {
                            this.platform.clearInterval(t);
                            if (eventName) {
                                this.ea.publish(TransitionChannels.progress, {
                                    name: eventName,
                                    status: TransitionStatus.ENTERED
                                });
                                this.ea.publish(TransitionChannels.ended, {
                                    name: eventName,
                                    status: TransitionStatus.ENTERED
                                });
                            }
                            resolve(void 0);
                        }
                    }, 100);
                });
            });
    }
    private enterWithoutTransition(element: HTMLElement|SVGElement, transition: ITransition, eventName = undefined)
    {
        if (eventName) {
            this.ea.publish(TransitionChannels.progress, {
                name: eventName,
                status: TransitionStatus.ENTERING
            });
        }
        return this.cleanupTransition(element, transition)
            .then(() => {
                transition.from.split(/\s+/)
                    .forEach((className) => element.classList.remove(className));
                transition.to.split(/\s+/)
                    .forEach((className) => element.classList.add(className));
                if (transition.show) {
                    element.style.display = transition.show;
                }
                if (eventName) {
                    this.ea.publish(TransitionChannels.progress, {
                        name: eventName,
                        status: TransitionStatus.ENTERED
                    });
                    this.ea.publish(TransitionChannels.ended, {
                        name: eventName,
                        status: TransitionStatus.ENTERED
                    });
                }
                return this.waitAnimationFrame();
            });
    }


    private leaveWithTransition(element: HTMLElement|SVGElement, transition: ITransition, eventName = undefined)
    {
        if (eventName) {
            this.ea.publish(TransitionChannels.progress, {
                name: eventName,
                status: TransitionStatus.LEAVING
            });
        }
        let transitionRunningTimeout;
        let transitionFinished = false;
        const onTransitionLeaveRun = (evt: TransitionEvent) => {
            if (evt.target === element) {
                evt.stopPropagation();
                element.removeEventListener('transitionrun', onTransitionLeaveRun);
                if (transitionRunningTimeout) {
                    this.platform.clearTimeout(transitionRunningTimeout);
                    transitionRunningTimeout = undefined;
                }
                return Promise.resolve();
            }
        };
        const onTransitionLeaveEnd = (evt: TransitionEvent) => {
            if (evt.target === element) {
                evt.stopPropagation();
                element.removeEventListener('transitionend', onTransitionLeaveEnd);
                element.removeEventListener('transitioncancel', onTransitionLeaveEnd);
                const t = transition.transitionLeaving || transition.transition;
                t.split(/\s+/)
                    .forEach((className) => element.classList.remove(className));
                if (transition.hide) {
                    element.style.display = transition.hide;
                    // wait next frame
                    transitionFinished = true;
                    return this.waitAnimationFrame();
                } else {
                    transitionFinished = true;
                    return Promise.resolve();
                }
            }
        };
        element.addEventListener('transitionend', onTransitionLeaveEnd);
        element.addEventListener('transitioncancel', onTransitionLeaveEnd);
        element.addEventListener('transitionrun', onTransitionLeaveRun);
        return this.cleanupTransition(element, transition)
            .then(() => {
                const t = transition.transitionLeaving || transition.transition;
                t.split(/\s+/)
                    .forEach((className) => element.classList.add(className));
                return Promise.resolve();
            })
            .then(() => {
                return this.waitAnimationFrame();
            })
            .then(() => {
                transitionRunningTimeout = this.platform.setTimeout(() => {
                    this.logger.warn('Transition timeout - Detach events handler and cleanup');
                    element.removeEventListener('transitionend', onTransitionLeaveEnd);
                    element.removeEventListener('transitioncancel', onTransitionLeaveEnd);
                    element.removeEventListener('transitionrun', onTransitionLeaveRun);
                    const t = transition.transitionLeaving || transition.transition;
                    t.split(/\s+/)
                        .forEach((className) => element.classList.add(className));
                }, 250);
                transition.to.split(/\s+/)
                    .forEach((className) => element.classList.remove(className));
                transition.from.split(/\s+/)
                    .forEach((className) => element.classList.add(className));
                return Promise.resolve();
            })
            .then(() => {
                return new Promise((resolve, reject) => {
                    let t = this.platform.setInterval(() => {
                        if (transitionFinished) {
                            this.platform.clearInterval(t);
                            if (eventName) {
                                this.ea.publish(TransitionChannels.progress, {
                                    name: eventName,
                                    status: TransitionStatus.LEFT
                                });
                                this.ea.publish(TransitionChannels.ended, {
                                    name: eventName,
                                    status: TransitionStatus.LEFT
                                });
                            }
                            resolve(void 0);
                        }
                    }, 100);
                });
            });
    }
    private leaveWithoutTransition(element: HTMLElement|SVGElement, transition: ITransition, eventName = undefined)
    {
        if (eventName) {
            this.ea.publish(TransitionChannels.progress, {
                name: eventName,
                status: TransitionStatus.LEAVING
            });
        }
        return this.cleanupTransition(element, transition)
            .then(() => {
                transition.to.split(/\s+/)
                    .forEach((className) => element.classList.remove(className));
                transition.from.split(/\s+/)
                    .forEach((className) => element.classList.add(className));
                if (transition.hide) {
                    element.style.display = transition.hide;
                }
                if (eventName) {
                    this.ea.publish(TransitionChannels.progress, {
                        name: eventName,
                        status: TransitionStatus.LEFT
                    });
                    this.ea.publish(TransitionChannels.ended, {
                        name: eventName,
                        status: TransitionStatus.LEFT
                    });
                }
                return this.waitAnimationFrame();
            });
    }

    private cleanupTransition(element: HTMLElement|SVGElement, transition: ITransition): Promise<void>
    {
        transition.transition.split(/\s+/).forEach((className) => {
            element.classList.remove(className)
        });
        if (transition.transitionLeaving) {
            transition.transitionLeaving.split(/\s+/).forEach((className) => {
                element.classList.remove(className)
            });
        }
        return Promise.resolve();
    }

    private waitAnimationFrame(): Promise<void>
    {
        return new Promise((resolve) => {
            this.platform.requestAnimationFrame(() => {
                resolve(void 0);
            });
        });
    }
}

export {TransitionService}
