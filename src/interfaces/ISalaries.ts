interface PerHour {
    value: string;
    isCheck: boolean;
}

interface Value {
    from: string;
    to: string;
    commission: string;
    salaryPercent: string;
}

interface Commission {
    value: Value[];
    isCheck: boolean;
}

interface ISalaries {
    perHour: PerHour;
    commission: Commission;
}

export default ISalaries;
