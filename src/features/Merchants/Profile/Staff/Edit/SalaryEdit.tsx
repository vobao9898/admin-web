import { Modal } from "antd";
import { useEffect } from "react";
import { FieldArrayWithId, useFieldArray, useForm } from "react-hook-form";
import { RHFCheckBox, RHFCurrencyInput, RHFInputNumber } from "components/Form";
import { cleanSSN } from "utils";
import IStaff from "interfaces/IStaff";
import MerchantService from "services/MerchantService";
import Message from "components/Message";
import ModalButton from "components/ModalButton";

interface IProps {
    staff: IStaff;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface SalaryCommission {
    commission: string;
    from: string;
    to: string;
}

type FormInputs = {
    productSalaries: {
        commission: {
            isCheck: boolean;
            value: string;
        };
    };
    salaries: {
        commission: {
            isCheck: boolean;
            value: SalaryCommission[];
        };
        perHour: {
            isCheck: boolean;
            value: string;
        };
    };
    tipFees: {
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

const SalaryEdit: React.FC<IProps> = ({ staff, open, onClose, onSuccess }) => {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        getValues,
        formState: { isSubmitting, isDirty, errors },
    } = useForm<FormInputs>({
        mode: "onBlur",
        defaultValues: {
            salaries: staff.salaries,
            productSalaries: staff.productSalaries,
            tipFees: staff.tipFees,
            cashPercent: staff.cashPercent,
        },
    });

    const salaryCommissionWatch = watch("salaries.commission.isCheck");
    const productCommissionWatch = watch("productSalaries.commission.isCheck");
    const tipFeePercentWatch = watch("tipFees.percent.isCheck");
    const tipFeeAmountWatch = watch("tipFees.fixedAmount.isCheck");

    useEffect(() => {
        if (open) {
            reset({
                salaries: staff.salaries,
                productSalaries: staff.productSalaries,
                tipFees: staff.tipFees,
                cashPercent: staff.cashPercent,
            });
        }
    }, [reset, open, staff]);

    useEffect(() => {
        if (tipFeePercentWatch) {
            setValue("tipFees.fixedAmount.isCheck", false);
            setValue("tipFees.fixedAmount.value", "0");
        }
    }, [tipFeePercentWatch, setValue]);

    useEffect(() => {
        if (tipFeeAmountWatch) {
            setValue("tipFees.percent.isCheck", false);
            setValue("tipFees.percent.value", "0");
        }
    }, [tipFeeAmountWatch, setValue]);

    const onSubmit = async (data: FormInputs) => {
        if (staff) {
            const payload: any = {
                firstName: staff.firstName,
                lastName: staff.lastName,
                displayName: staff.displayName,
                address: {
                    street: staff.address,
                    city: staff.city,
                    zip: staff.zip,
                    state: staff.stateId,
                    stateId: staff.stateId,
                },
                cellphone: staff.phone,
                email: staff.email,
                pin: staff.pin,
                isActive: staff.isActive,
                roles: {
                    nameRole: staff.roleName,
                    statusRole: "",
                },
                isDisabled: staff.isDisabled,
                fileId: staff.fileId,
                driverLicense: staff.driverLicense,
                socialSecurityNumber: cleanSSN(staff.socialSecurityNumber),
                professionalLicense: staff.professionalLicense,
                workingTime: staff.workingTimes,
                salary: {
                    commission: {
                        isCheck: data.salaries.commission.isCheck,
                        value:
                            data.salaries.commission.value && data.salaries.commission.value.length
                                ? data.salaries.commission.value
                                : [{ from: 0, to: 0, salaryPercent: 0, commission: 0 }],
                    },
                    perHour: data.salaries.perHour,
                },
                productSalary: data.productSalaries,
                cashPercent: data.cashPercent,
                tipFee: data.tipFees,
                categories: staff?.categories,
            };

            try {
                const message = await MerchantService.editGeneralStaff(payload, staff?.staffId);
                Message.success({ text: message });
                onSuccess();
            } catch (error) {
                reset(data);
            }
        }
    };

    const afterClose = () => {
        reset();
    };

    const { fields, append, remove } = useFieldArray({
        control,
        name: "salaries.commission.value",
    });

    const DEFAULT_EXTRA: SalaryCommission = {
        commission: "0",
        from: "0",
        to: "0",
    };

    const addSalary = () => {
        if (salaryCommissionWatch) {
            append(DEFAULT_EXTRA);
        }
    };

    const renderIncome = (item: FieldArrayWithId<FormInputs, "salaries.commission.value", "id">, index: number) => {
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
                                        name={`salaries.commission.value.${index}.from`}
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
                                    {errors.salaries?.commission?.value?.[index]?.from?.message || ""}
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
                                                        `salaries.commission.value.${index}.from`
                                                    );
                                                    return (
                                                        parseFloat(fromValue) <= parseFloat(value as string) ||
                                                        "The to number cannot be less than the from number!"
                                                    );
                                                },
                                            },
                                        }}
                                        control={control}
                                        name={`salaries.commission.value.${index}.to`}
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
                                    {errors.salaries?.commission?.value?.[index]?.to?.message || ""}
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
                                        name={`salaries.commission.value.${index}.commission`}
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
                                    {errors.salaries?.commission?.value?.[index]?.commission?.message || ""}
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
        <Modal
            centered={true}
            width={900}
            maskClosable={false}
            destroyOnClose={true}
            open={open}
            title={<p className="font-bold text-lg">{"Edit"}</p>}
            afterClose={afterClose}
            onCancel={onClose}
            footer={
                <div className="flex justify-end gap-x-2">
                    <ModalButton
                        disabled={isSubmitting}
                        title="Cancel"
                        type={"button"}
                        btnType="cancel"
                        onClick={onClose}
                    />
                    <ModalButton
                        loading={isSubmitting}
                        disabled={isSubmitting || !isDirty}
                        title="Save"
                        type={"submit"}
                        btnType="save"
                        onClick={handleSubmit(onSubmit)}
                    />
                </div>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-x-5 gap-y-2 grid-cols-12 mb-5">
                    <div className="col-span-12">
                        <h3 className="font-bold text-lg text-blue-500">Salary</h3>
                    </div>
                    <div className="col-span-6">
                        <div className="flex items-center">
                            <RHFCheckBox<FormInputs> control={control} name={`salaries.perHour.isCheck`} />
                            <div className="text-sm leading-none ml-2">Salary Per Hour</div>
                        </div>
                    </div>
                    <div className="col-span-6">
                        <RHFCurrencyInput<FormInputs>
                            control={control}
                            name={"salaries.perHour.value"}
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
                            <RHFCheckBox<FormInputs> control={control} name={`salaries.commission.isCheck`} />
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
                            <RHFCheckBox<FormInputs> control={control} name={`productSalaries.commission.isCheck`} />
                            <div className="text-sm leading-none ml-2">Product Commission</div>
                        </div>
                    </div>
                    <div className="col-span-6">
                        <RHFCurrencyInput<FormInputs>
                            control={control}
                            name={"productSalaries.commission.value"}
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
                            <RHFCheckBox<FormInputs> control={control} name={`tipFees.percent.isCheck`} />
                            <div className="text-sm leading-none ml-2">Tip Percent</div>
                        </div>
                    </div>
                    <div className="col-span-6">
                        <RHFCurrencyInput<FormInputs>
                            control={control}
                            name={"tipFees.percent.value"}
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
                            <RHFCheckBox<FormInputs> control={control} name={`tipFees.fixedAmount.isCheck`} />
                            <div className="text-sm leading-none ml-2">Tip Fixed Amount</div>
                        </div>
                    </div>
                    <div className="col-span-6">
                        <RHFCurrencyInput<FormInputs>
                            control={control}
                            name={"tipFees.fixedAmount.value"}
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
            </form>
        </Modal>
    );
};

export default SalaryEdit;
