import classNames from "classnames";
import HelperText from "components/HelperText";
import Label from "components/Label";
import { ReactNode } from "react";
import { Control, Controller, FieldPath, RegisterOptions } from "react-hook-form";
import { NumericFormat } from "react-number-format";

interface IProps<T extends Record<string, any>> {
    control: Control<T>;
    name: FieldPath<T>;
    placeholder?: string;
    label?: string;
    showError?: boolean;
    decimalScale?: number;
    thousandSeparator?: string | boolean;
    prefix?: ReactNode;
    isTextRight?: boolean;
    disabled?: boolean;
    labelRequired?: boolean;
    fixedDecimalScale?: boolean;
    allowNegative?: boolean;
    rules?: Omit<RegisterOptions<T, FieldPath<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
}

const RHFCurrencyInput = <T extends Record<string, any>>({
    control,
    name,
    placeholder,
    label,
    decimalScale,
    thousandSeparator,
    showError = true,
    prefix,
    isTextRight = true,
    disabled = false,
    labelRequired = true,
    fixedDecimalScale = false,
    allowNegative,
    rules,
}: IProps<T>) => {
    return (
        <>
            {label && <Label title={label} htmlFor={name} required={labelRequired} />}
            <Controller
                rules={rules}
                name={name}
                control={control}
                render={({ field: { onChange, onBlur, value, name }, fieldState: { error } }) => (
                    <>
                        <div className="relative flex items-center">
                            {prefix ? (
                                prefix
                            ) : (
                                <div className="text-sm leading-none h-10 w-20 flex items-center justify-center text-gray-600 px-4 border border-r-0 rounded-l-lg bg-white border-gray-300">
                                    $
                                </div>
                            )}
                            <NumericFormat
                                id={name}
                                className={classNames(
                                    "text-sm w-full h-10 text-gray-600 px-4 border rounded-r-lg bg-white border-gray-300 focus:border-blue-500 focus:shadow focus:shadow-blue-500/30 focus:outline-0 placeholder:font-light placeholder:text-gray-300",
                                    {
                                        "text-left": !isTextRight,
                                        "text-right": isTextRight,
                                        "!text-gray-600 !bg-gray-three": disabled,
                                    }
                                )}
                                value={value}
                                isAllowed={(values) => {
                                    const { value } = values;
                                    if (value === "") return true;
                                    if (Number.isNaN(parseFloat(value))) return false;
                                    return true;
                                }}
                                onValueChange={(values: any) => {
                                    onChange(values.value);
                                }}
                                onBlur={onBlur}
                                placeholder={placeholder}
                                decimalScale={decimalScale}
                                thousandSeparator={thousandSeparator}
                                disabled={disabled}
                                fixedDecimalScale={fixedDecimalScale}
                                allowNegative={allowNegative}
                            />
                        </div>
                        {showError && <HelperText message={error?.message || ""} />}
                    </>
                )}
            />
        </>
    );
};

export default RHFCurrencyInput;
