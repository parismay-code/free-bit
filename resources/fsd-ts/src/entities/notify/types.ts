export enum NotifyTypes {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info',
    WARNING = 'warning',
}

export type Notify = {
    type: NotifyTypes;
    text: string;
    duration: number;
};
