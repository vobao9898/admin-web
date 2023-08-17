import HelperText from "components/HelperText";
import Label from "components/Label";
import Select, { ISelectProps } from "components/Select";
import { Control, Controller, FieldPath, RegisterOptions } from "react-hook-form";

interface IProps<T extends Record<string, any>> extends ISelectProps {
    control: Control<T>;
    name: FieldPath<T>;
    placeholder?: string;
    label?: string;
    showError?: boolean;
    disabled?: boolean;
    labelRequired?: boolean;
    className?: string;
    rules?: Omit<RegisterOptions<T, FieldPath<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
}

const RHFSelect = <T extends Record<string, any>>({
    control,
    name,
    placeholder,
    label,
    options,
    showError = true,
    labelRequired = true,
    disabled = false,
    showSearch,
    className = "",
    mode,
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
                        <Select
                            options={options}
                            id={name}
                            value={value}
                            showSearch={showSearch}
                            onChange={onChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            className={className}
                            disabled={disabled}
                            mode={mode}
                        />
                        {showError && <HelperText message={error?.message || ""} />}
                    </>
                )}
            />
        </>
    );
};

export default RHFSelect;
