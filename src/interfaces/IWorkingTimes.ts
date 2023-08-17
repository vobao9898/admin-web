interface day {
    timeStart: string;
    timeEnd: string;
    isCheck: boolean;
}
interface IWorkingTimes {
    Monday: day;
    Tuesday: day;
    Wednesday: day;
    Thursday: day;
    Friday: day;
    Saturday: day;
    Sunday: day;
}

export default IWorkingTimes;
