import { FieldArrayWithId, useFieldArray, useForm } from "react-hook-form";
import { RHFCheckBox, RHFCurrencyInput, RHFInputNumber } from "components/Form";
import { useEffect } from "react";
import { ISalary } from "./index";
import Button from "components/Button";

interface IProps {
    data?: ISalary;
    onSubmitData: (data: ISalary) => void;
}

interface SalaryCommission {
    from: string;
    to: string;
    commission: string;
    salaryPercent: string;
}

type FormInputs = {
    productSalary: {
        commission: {
            isCheck: boolean;
            value: string;
        };
    };
    salary: {
        commission: {
            isCheck: boolean;
            value: SalaryCommission[];
        };
        perHour: {
            isCheck: boolean;
            value: string;
        };
    };
    tipFee: {
        fixedAmount: {
            isCheck: boolean;
            value: string;
        };
        percent: {
            isCheck: boolean;
            value: string;
        };
    };
    cashPercent: string;
};

const Salary: React.FC<IProps> = ({ onSubmitData, data }) => {
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        getValues,
        formState: { errors },
    } = useForm<FormInputs>({
        mode: "onBlur",
        defaultValues: {
            salary: {
                perHour: {
                    isCheck: data ? data.salary?.perHour?.isCheck : false,
                    value: data ? data.salary?.perHour?.value : "0",
                },
                commission: {
                    isCheck: data ? data.salary.commission?.isCheck : false,
                    value: data ? data.salary.commission.value : [],
                },
            },
            productSalary: {
                commission: {
                    isCheck: data ? data.productSalary?.commission?.isCheck : false,
                    value: data ? data?.productSalary?.commission?.value : "0",
                },
            },
            tipFee: {
                fixedAmount: {
                    isCheck: data ? data?.tipFee?.fixedAmount?.isCheck : false,
                    value: data ? data?.tipFee?.fixedAmount?.value : "0",
                },
                percent: {
                    isCheck: data ? data?.tipFee?.percent?.isCheck : false,
                    value: data ? data?.tipFee?.percent?.value : "0",
                },
            },
            cashPercent: data ? data.cashPercent : "0",
        },
    });

    const salaryCommissionWatch = watch("salary.commission.isCheck");
    const productCommissionWatch = watch("productSalary.commission.isCheck");
    const tipFeePercentWatch = watch("tipFee.percent.isCheck");
    const tipFeeAmountWatch = watch("tipFee.fixedAmount.isCheck");

    useEffect(() => {
        if (tipFeePercentWatch) {
            setValue("tipFee.fixedAmount.isCheck", false);
            setValue("tipFee.fixedAmount.value", "0");
        }
    }, [tipFeePercentWatch, setValue]);

    useEffect(() => {
        if (tipFeeAmountWatch) {
            setValue("tipFee.percent.isCheck", false);
            setValue("tipFee.percent.value", "0");
        }
    }, [tipFeeAmountWatch, setValue]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "salary.commission.value",
    });

    const DEFAULT_EXTRA: SalaryCommission = {
        commission: "0",
        from: "0",
        to: "0",
        salaryPercent: "0",
    };

    const addSalary = () => {
        if (salaryCommissionWatch) {
            append(DEFAULT_EXTRA);
        }
    };

    const onSubmit = (data: FormInputs) => {
        const salary: ISalary = {
            salary: {
                perHour: {
                    isCheck: data.salary.perHour.isCheck,
                    value: data.salary.perHour.value,
                },
                commission: {
                    isCheck: data.salary.commission.isCheck,
                    value: data.salary.commission.value,
                },
            },
            productSalary: {
                commission: {
                    value: data.productSalary.commission.value,
                    isCheck: data.productSalary.commission.isCheck,
                },
            },
            tipFee: {
                percent: {
                    value: data.tipFee.percent.value,
                    isCheck: data.tipFee.percent.isCheck,
                },
                fixedAmount: {
                    value: data.tipFee.fixedAmount.value,
                    isCheck: data.tipFee.fixedAmount.isCheck,
                },
            },
            cashPercent: data.cashPercent,
        };
        onSubmitData(salary);
    };

    const renderIncome = (item: FieldArrayWithId<FormInputs, "salary.commission.value", "id">, index: number) => {
        return (
            <div key={item.id} className="flex">
                <div className="w-12.5 flex justify-center items-center bg-link-water">{index + 1}</div>
                <div className="grid grid-cols-12 flex-1">
                    <div className="col-span-4 border border-gray-primary flex">
                        <div className="p-1 flex">
                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-x-1">
                                    <span className="text-sm">$</span>
                                    <RHFInputNumber<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        control={control}
                                        name={`salary.commission.value.${index}.from`}
                                        thousandSeparator=","
                                        decimalScale={2}
                                        allowNegative={false}
                                        fixedDecimalScale
                                        placeholder="0.00"
                                        showError={false}
                                        className="text-sm border-none focus:shadow-none !px-0 h-8"
                                    />
                                </div>
                                <span className="text-xs leading-none text-[red]">
                                    {errors.salary?.commission?.value?.[index]?.from?.message || ""}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-4 border border-gray-primary flex">
                        <div className="p-1 flex">
                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-x-1">
                                    <span className="text-sm">$</span>
                                    <RHFInputNumber<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                            validate: {
                                                checkInComeValue: (value) => {
                                                    const fromValue = getValues(
                                                        `salary.commission.value.${index}.from`
                                                    );
                                                    return (
                                                        parseFloat(fromValue) <= parseFloat(value as string) ||
                                                        "The to number cannot be less than the from number!"
                                                    );
                                                },
                                            },
                                        }}
                                        control={control}
                                        name={`salary.commission.value.${index}.to`}
                                        thousandSeparator=","
                                        decimalScale={2}
                                        allowNegative={false}
                                        fixedDecimalScale
                                        placeholder="0.00"
                                        showError={false}
                                        className="text-sm border-none focus:shadow-none !px-0 h-8"
                                    />
                                </div>
                                <span className="text-xs leading-none text-[red]">
                                    {errors.salary?.commission?.value?.[index]?.to?.message || ""}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-4 border border-gray-primary flex">
                        <div className="p-1 flex">
                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-x-1">
                                    <span className="text-sm">%</span>
                                    <RHFInputNumber<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        max={100}
                                        control={control}
                                        name={`salary.commission.value.${index}.commission`}
                                        thousandSeparator=","
                                        decimalScale={2}
                                        allowNegative={false}
                                        fixedDecimalScale
                                        placeholder="0.00"
                                        showError={false}
                                        className="text-sm border-none focus:shadow-none !px-0 h-8"
                                    />
                                </div>
                                <span className="text-xs leading-none text-[red]">
                                    {errors.salary?.commission?.value?.[index]?.commission?.message || ""}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-12.5">
                    <div className="flex justify-between items-center">
                        <div>
                            <i
                                onClick={() => remove(index)}
                                className="las la-trash-alt text-red-500 hover:text-red-400 cursor-pointer text-3xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-x-5 gap-y-2 grid-cols-12 mb-5">
                <div className="col-span-12">
                    <h3 className="font-bold text-lg text-blue-500">Salary</h3>
                </div>
                <div className="col-span-6">
                    <div className="flex items-center">
                        <RHFCheckBox<FormInputs> control={control} name={`salary.perHour.isCheck`} />
                        <div className="text-sm leading-none ml-2">Salary Per Hour</div>
                    </div>
                </div>
                <div className="col-span-6">
                    <RHFCurrencyInput<FormInputs>
                        control={control}
                        name={"salary.perHour.value"}
                        label="Salary Per Hour"
                        thousandSeparator=","
                        decimalScale={2}
                        placeholder="Enter salary per hour"
                        isTextRight={false}
                        labelRequired={false}
                        fixedDecimalScale
                        prefix={
                            <div className="text-sm leading-none h-10 w-20 flex items-center justify-center text-gray-600 px-4 border border-r-0 rounded-l-lg bg-white border-gray-300">
                                $
                            </div>
                        }
                    />
                </div>
                <div className="col-span-6">
                    <div className="flex items-center">
                        <RHFCheckBox<FormInputs> control={control} name={`salary.commission.isCheck`} />
                        <div className="text-sm leading-none ml-2">Incomes</div>
                    </div>
                </div>
                <div className="col-span-12">
                    <div className="flex w-full">
                        <div className="text-sm leading-none py-2 w-12.5 flex justify-center items-center bg-link-water border border-gray-primary font-bold text-center">
                            STT
                        </div>
                        <div className="grid grid-cols-12 flex-1">
                            <div className="text-sm leading-none py-2 col-span-4 border border-gray-primary bg-link-water font-bold text-center">
                                From
                            </div>
                            <div className="text-sm leading-none py-2 col-span-4 border border-gray-primary bg-link-water font-bold text-center">
                                To
                            </div>
                            <div className="text-sm leading-none py-2 col-span-4 border border-gray-primary bg-link-water font-bold text-center">
                                Salary percented (%)
                            </div>
                        </div>
                        <div className="w-12.5 "></div>
                    </div>
                    {fields.map((item, index) => {
                        return renderIncome(item, index);
                    })}
                    <div>
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={addSalary}
                                className="rounded-xl text-sm text-white bg-blue-500 hover:bg-blue-400 py-0.5 px-3 my-2"
                            >
                                <i className="las la-plus mr-1 text-lg" />
                                <span className="relative -top-0.5">Add more</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-span-12">
                    <h3 className="font-bold text-lg text-blue-500">Product Salary</h3>
                </div>
                <div className="col-span-6">
                    <div className="flex items-center">
                        <RHFCheckBox<FormInputs> control={control} name={`productSalary.commission.isCheck`} />
                        <div className="text-sm leading-none ml-2">Product Commission</div>
                    </div>
                </div>
                <div className="col-span-6">
                    <RHFCurrencyInput<FormInputs>
                        control={control}
                        name={"productSalary.commission.value"}
                        label="Product Commission"
                        thousandSeparator=","
                        decimalScale={2}
                        placeholder="Enter product commission"
                        disabled={!productCommissionWatch}
                        isTextRight={false}
                        labelRequired={false}
                        fixedDecimalScale
                        prefix={
                            <div className="text-sm leading-none h-10 w-20 flex items-center justify-center text-gray-600 px-4 border border-r-0 rounded-l-lg bg-white border-gray-300">
                                %
                            </div>
                        }
                    />
                </div>

                <div className="col-span-12">
                    <h3 className="font-bold text-lg text-blue-500">Tip Fee</h3>
                </div>
                <div className="col-span-6">
                    <div className="flex items-center">
                        <RHFCheckBox<FormInputs> control={control} name={`tipFee.percent.isCheck`} />
                        <div className="text-sm leading-none ml-2">Tip Percent</div>
                    </div>
                </div>
                <div className="col-span-6">
                    <RHFCurrencyInput<FormInputs>
                        control={control}
                        name={"tipFee.percent.value"}
                        label="Percent"
                        thousandSeparator=","
                        decimalScale={2}
                        placeholder="Enter percent"
                        disabled={!tipFeePercentWatch}
                        isTextRight={false}
                        labelRequired={false}
                        fixedDecimalScale
                        prefix={
                            <div className="text-sm leading-none h-10 w-20 flex items-center justify-center text-gray-600 px-4 border border-r-0 rounded-l-lg bg-white border-gray-300">
                                %
                            </div>
                        }
                    />
                </div>
                <div className="col-span-6">
                    <div className="flex items-center">
                        <RHFCheckBox<FormInputs> control={control} name={`tipFee.fixedAmount.isCheck`} />
                        <div className="text-sm leading-none ml-2">Tip Fixed Amount</div>
                    </div>
                </div>
                <div className="col-span-6">
                    <RHFCurrencyInput<FormInputs>
                        control={control}
                        name={"tipFee.fixedAmount.value"}
                        label="Amount"
                        thousandSeparator=","
                        decimalScale={2}
                        placeholder="Enter amount"
                        disabled={!tipFeeAmountWatch}
                        isTextRight={false}
                        labelRequired={false}
                        fixedDecimalScale
                    />
                </div>
                <div className="col-span-12">
                    <h3 className="font-bold text-lg text-blue-500">Payout by Cash</h3>
                </div>
                <div className="col-span-6">
                    <RHFCurrencyInput<FormInputs>
                        control={control}
                        name={"cashPercent"}
                        label="Percent"
                        thousandSeparator=","
                        decimalScale={2}
                        placeholder="Enter percent"
                        isTextRight={false}
                        labelRequired={false}
                        fixedDecimalScale
                        prefix={
                            <div className="text-sm leading-none h-10 w-20 flex items-center justify-center text-gray-600 px-4 border border-r-0 rounded-l-lg bg-white border-gray-300">
                                %
                            </div>
                        }
                    />
                </div>
            </div>
            <div className="col-span-12">
                <Button type="submit" title="Next" btnType="ok" />
            </div>
        </form>
    );
};

export default Salary;
