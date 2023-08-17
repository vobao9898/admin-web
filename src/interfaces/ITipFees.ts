interface Percent {
    value: string;
    isCheck: boolean;
}

interface FixedAmount {
    value: string;
    isCheck: boolean;
}

interface ITipFees {
    percent: Percent;
    fixedAmount: FixedAmount;
}

export default ITipFees;
