import HelperText from "components/HelperText";
import TextArea from "components/TextArea";
import Label from "components/Label";
import { HTMLInputTypeAttribute } from "react";
import { Control, Controller, FieldPath, RegisterOptions } from "react-hook-form";

interface IProps<T extends Record<string, any>> {
    control: Control<T>;
    name: FieldPath<T>;
    placeholder?: string;
    label?: string;
    endAdornment?: React.ReactNode;
    type?: HTMLInputTypeAttribute;
    disabled?: boolean;
    labelRequired?: boolean;
    rules?: Omit<RegisterOptions<T, FieldPath<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
}

const RHFTextAreaField = <T extends Record<string, any>>({
    control,
    name,
    placeholder,
    label,
    endAdornment,
    disabled,
    labelRequired = true,
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
                    <div className="flex flex-col gap-y-1">
                        <TextArea
                            name={name}
                            id={name}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
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

export default RHFTextAreaField;
