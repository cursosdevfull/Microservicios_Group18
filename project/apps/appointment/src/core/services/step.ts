export interface IStep {
    name: string;
    execute(): Promise<any>;
    compensate(): Promise<any>;
}