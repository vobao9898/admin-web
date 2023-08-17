interface IPaging<T> {
    data: T[];
    count: number;
    pages: number;
    summary?: any;
}

export default IPaging;
