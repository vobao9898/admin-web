import HelperText from "components/HelperText";
import Label from "components/Label";
import { Control, Controller, FieldPath, RegisterOptions } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import classNames from "classnames";

interface IProps<T extends Record<string, any>> {
    control: Control<T>;
    name: FieldPath<T>;
    placeholder?: string;
    label?: string;
    showError?: boolean;
    decimalScale?: number;
    fixedDecimalScale?: boolean;
    thousandSeparator?: string | boolean;
    max?: number;
    min?: number;
    className?: string;
    disabled?: boolean;
    labelRequired?: boolean;
    allowNegative?: boolean;
    rules?: Omit<RegisterOptions<T, FieldPath<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
}

const RHFInputNumber = <T extends Record<string, any>>({
    control,
    name,
    placeholder,
    decimalScale,
    thousandSeparator,
    label,
    max,
    min,
    showError = true,
    disabled = false,
    labelRequired = true,
    className = "",
    allowNegative,
    fixedDecimalScale = false,
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
                            <NumericFormat
                                id={name}
                                isAllowed={(values) => {
                                    const { floatValue } = values;

                                    if (floatValue === undefined) return true;

                                    if (max !== undefined && min !== undefined)
                                        return floatValue <= max && floatValue >= min;
                                    if (max !== undefined && min === undefined) return floatValue <= max;

                                    if (max === undefined && min !== undefined) return floatValue >= min;

                                    return true;
                                }}
                                className={classNames(
                                    "w-full h-10 text-gray-600 px-4 border rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:shadow focus:shadow-blue-500/30 focus:outline-0 placeholder:font-light placeholder:text-gray-300",
                                    className,
                                    {
                                        "!text-gray-600 !bg-gray-three": disabled,
                                    }
                                )}
                                value={value}
                                max={max}
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

export default RHFInputNumber;
