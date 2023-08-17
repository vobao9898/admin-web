import IPricingPlan from "interfaces/IPricingPlan";
import IState from "interfaces/IState";
import moment from "moment";
import { REGEX_EMAIL, EPHONE_CODES } from "contants";
import axios, { AxiosError } from "axios";
import Message from "components/Message";

interface IOptions {
    value: number;
    label: string;
}

export interface ValidationErrors {
    message: string;
}

export function handleResponseError(error: AxiosError | Error) {
    if (error instanceof Error || axios.isAxiosError(error)) {
        Message.error({ text: error.message });
    } else {
        Message.error({ text: "Unknow sever error!" });
    }
}

const getOptionsState = (state: IState[]): IOptions[] => {
    const options: IOptions[] = [];

    if (!state || (state && state.length === 0)) return options;

    state.forEach((item) => {
        options.push({
            value: item.stateId,
            label: item.name,
        });
    });
    return options;
};

const getPackageOptions = (packages: IPricingPlan[]): IOptions[] => {
    const options: IOptions[] = [];
    packages.forEach((item) => {
        if (item.isDisabled === 0) {
            options.push({
                value: item.packageId,
                label: item.packageName,
            });
        }
    });
    return options;
};

const testValidPhone = (codePhone: number, value: string) => {
    const lengthPhone = codePhone === EPHONE_CODES.VN ? 9 : 10;
    const phone = value.replace(/[^\d]/g, "");
    if (!phone || phone.length !== lengthPhone) return false;
    return true;
};

const testValidSSN = (value: string) => {
    const phone = value.replace(/[^\d]/g, "");
    if (!phone || phone.length !== 9) return false;
    return true;
};

const cleanPhoneNumber = (value: string) => {
    if (!value) return "";
    const phone = value.replace(/[^\d]/g, "");
    return phone;
};

const cleanSSN = (value: string) => {
    if (!value) return "";
    const phone = value.replace(/[^\d]/g, "");
    return phone;
};

const DURATION_ABOUT_TO_EXPIRE = 14 * 24 * 60 * 60 * 1000; // 14 DAYS

const isMerchantExpiredDate = (expiredDate: Date) => {
    if (expiredDate === null) return false;

    const isValid = moment(expiredDate).isValid();

    if (!isValid) return false;

    const expiredTime = new Date(expiredDate).getTime();

    const nowTime = new Date().getTime();

    if (expiredTime - DURATION_ABOUT_TO_EXPIRE <= nowTime) return true;

    return false;
};

const formatMoney = (currency: string): string => {
    const money = currency.replace(/[^0-9.-]+/g, "");
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });
    return money ? formatter.format(Number(money)) : "";
};

const testValidEmail = (email: string) => {
    return email.toLowerCase().match(REGEX_EMAIL);
};

const maskPhone = (codePhone: number, phoneNumber: string) => {
    const matches = phoneNumber.replace(/(\d{1,3})(\d{1,3})(\d{1,4})/, "$1 $2-$3");
    if (codePhone === -1) return matches;
    return `+${codePhone} ${matches}`;
};

const getCodeAndPhoneNumber = (value: string): [number, string] => {
    if (!value) return [1, ""];
    const phone = value.replace(/[^\d]/g, "");
    const codePhone = phone.startsWith("84") ? 84 : 1;
    const phoneNumber = codePhone === 84 ? phone.slice(2) : codePhone === 1 ? phone.slice(1) : phone;
    return [codePhone, phoneNumber];
};

const isPdfFile = (fileName: string) => {
    if (!fileName) return false;
    const extension = fileName.split(".").pop();
    if (extension === "pdf") return true;
    return false;
};

const convertSSN = (ssn: string) => {
    let arr = [];
    let newSSN = "";
    if (ssn && typeof ssn === "string") {
        newSSN = ssn;
        newSSN = newSSN.replaceAll("-", "");
        arr.push(newSSN.slice(0, 3));
        arr.push(newSSN.slice(3, 5));
        arr.push(newSSN.slice(5, 9));
        arr = arr.filter((x) => x);
        return arr.join("-");
    }
    return ssn;
};

export { formatMoney, testValidSSN, getOptionsState, convertSSN, isMerchantExpiredDate, getPackageOptions, cleanPhoneNumber, testValidEmail, maskPhone, getCodeAndPhoneNumber, isPdfFile, cleanSSN, testValidPhone };
