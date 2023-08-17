import { DatePicker } from "antd";
import { Control, Controller, FieldPath, RegisterOptions } from "react-hook-form";
import HelperText from "components/HelperText";
import Label from "components/Label";
import dayjs from "dayjs";
import classNames from "classnames";

interface IProps<T extends Record<string, any>> {
    control: Control<T>;
    name: FieldPath<T>;
    placeholder?: string;
    label?: string;
    showError?: boolean;
    disabled?: boolean;
    disabledDate?: boolean;
    className?: string;
    rules?: Omit<RegisterOptions<T, FieldPath<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
}

const RHFDatePicker = <T extends Record<string, any>>({
    control,
    name,
    placeholder,
    label,
    showError = true,
    disabled = false,
    disabledDate = false,
    className = "",
    rules,
}: IProps<T>) => {
    return (
        <>
            {label && <Label title={label} htmlFor={name} required />}
            <Controller
                name={name}
                rules={rules}
                control={control}
                render={({ field: { onChange, onBlur, value, name }, fieldState: { error } }) => (
                    <>
                        <DatePicker
                            id={name}
                            size="large"
                            allowClear={false}
                            value={dayjs(value)}
                            onBlur={onBlur}
                            onChange={(_, dateString: any) => onChange(dateString)}
                            disabledDate={(current) => {
                                return disabledDate
                                    ? false
                                    : current && (current > dayjs().endOf("day") || current < dayjs("1900-01-01"));
                            }}
                            placeholder={placeholder}
                            className={classNames(`${className}`, {
                                disabled: disabled,
                                "date-css": !disabled,
                            })}
                            disabled={disabled}
                        />
                        {showError && <HelperText message={error?.message || ""} />}
                    </>
                )}
            />
        </>
    );
};

export default RHFDatePicker;
