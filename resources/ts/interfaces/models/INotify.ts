export default interface INotify {
    type: NotifyTypes;
    text: string;
    duration: number;
}

export enum NotifyTypes {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info',
    WARNING = 'warning',
}
