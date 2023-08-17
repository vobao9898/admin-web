import HelperText from "components/HelperText";
import Label from "components/Label";
import PhoneInput from "components/PhoneInput";
import { Control, Controller, FieldPath, RegisterOptions } from "react-hook-form";

interface IProps<T extends Record<string, any>> {
    control: Control<T>;
    name: FieldPath<T>;
    mask: string;
    placeholder?: string;
    label?: string;
    showError?: boolean;
    rules?: Omit<RegisterOptions<T, FieldPath<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
    disabled?: boolean;
    labelRequired?: boolean;
}

const RHFPhoneInput = <T extends Record<string, any>>({
    control,
    name,
    mask,
    placeholder,
    label,
    showError = true,
    rules,
    disabled = false,
    labelRequired = true,
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
                        <PhoneInput
                            id={name}
                            name={name}
                            mask={mask}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            disabled={disabled}
                        />
                        {showError && <HelperText message={error?.message || ""} />}
                    </>
                )}
            />
        </>
    );
};

export default RHFPhoneInput;
