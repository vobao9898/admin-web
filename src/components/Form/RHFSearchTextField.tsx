import HelperText from "components/HelperText";
import Input from "components/Input";
import Label from "components/Label";
import React, { HTMLInputTypeAttribute } from "react";
import { Control, Controller, FieldPath, RegisterOptions } from "react-hook-form";

interface IProps<T extends Record<string, any>> {
    control: Control<T>;
    name: FieldPath<T>;
    rules?: Omit<RegisterOptions<T, FieldPath<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
    placeholder?: string;
    label?: string;
    endAdornment?: React.ReactNode;
    type?: HTMLInputTypeAttribute;
    disabled?: boolean;
    labelRequired?: boolean;
    maxLength?: number;
    handleOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleOnBlur?: (value: string) => void;
}

const RHFSearchTextField = <T extends Record<string, any>>({
    control,
    name,
    placeholder,
    label,
    endAdornment,
    type = "text",
    disabled,
    labelRequired = true,
    maxLength,
    rules,
    handleOnChange,
    handleOnBlur,
}: IProps<T>) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (handleOnChange) {
            handleOnChange(event);
        }
    };

    const hanldeBlur = (value: string) => {
        if (handleOnBlur) handleOnBlur(value);
    };

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
                            maxLength={maxLength}
                            onChange={(event) => {
                                onChange(event);
                                handleChange(event);
                            }}
                            onBlur={() => {
                                onBlur();
                                hanldeBlur(value);
                            }}
                            placeholder={placeholder}
                            endAdornment={endAdornment}
                            disabled={disabled}
                        />
                        <HelperText message={error?.message || ""} />
                    </div>
                )}
            />
        </>
    );
};

export default RHFSearchTextField;
