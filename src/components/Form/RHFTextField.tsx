import HelperText from "components/HelperText";
import Input from "components/Input";
import Label from "components/Label";
import { HTMLInputTypeAttribute } from "react";
import { Control, Controller, FieldPath, RegisterOptions } from "react-hook-form";

interface IProps<T extends Record<string, any>> {
    control: Control<T>;
    name: FieldPath<T>;
    rules?: Omit<RegisterOptions<T, FieldPath<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
    placeholder?: string;
    label?: string;
    labelRequired?: boolean;
    endAdornment?: React.ReactNode;
    type?: HTMLInputTypeAttribute;
    disabled?: boolean;
    maxLength?: number;
}

const RHFTextField = <T extends Record<string, any>>({
    control,
    name,
    placeholder,
    label,
    labelRequired = true,
    endAdornment,
    type = "text",
    disabled,
    rules,
    maxLength,
}: IProps<T>) => {
    return (
        <>
            {label && <Label title={label} htmlFor={name} required={labelRequired} />}
            <Controller
                rules={rules}
                name={name}
                control={control}
                render={({ field: { onChange, onBlur, value, name }, fieldState: { error } }) => (
                    <div className="flex flex-col gap-y-1">
                        <Input
                            type={type}
                            name={name}
                            id={name}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            endAdornment={endAdornment}
                            disabled={disabled}
                            maxLength={maxLength}
                        />
                        <HelperText message={error?.message || ""} />
                    </div>
                )}
            />
        </>
    );
};

export default RHFTextField;
