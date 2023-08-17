import { Checkbox } from "antd";
import { Control, Controller, FieldPath } from "react-hook-form";
import HelperText from "components/HelperText";
import Label from "components/Label";
import { CheckboxChangeEvent } from "antd/es/checkbox";

interface IProps<T extends Record<string, any>> {
    control: Control<T>;
    name: FieldPath<T>;
    placeholder?: string;
    label?: string;
    showError?: boolean;
    labelRequired?: boolean;
    className?: string;
    onHandleChange?: (checked: boolean) => void;
}

const RHFCheckBox = <T extends Record<string, any>>({
    control,
    name,
    label,
    showError = true,
    labelRequired = true,
    className = "",
    onHandleChange,
}: IProps<T>) => {
    const handleChange = (event: CheckboxChangeEvent) => {
        const { checked } = event?.target;
        if (onHandleChange) onHandleChange(checked);
    };
    return (
        <>
            {label && <Label title={label} htmlFor={name} required={labelRequired} />}
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value, name }, fieldState: { error } }) => (
                    <>
                        <Checkbox
                            id={name}
                            checked={Boolean(value)}
                            onChange={(checked: any) => {
                                onChange(checked);
                                handleChange(checked);
                            }}
                            className={className}
                        />
                        {showError && <HelperText message={error?.message || ""} />}
                    </>
                )}
            />
        </>
    );
};

export default RHFCheckBox;
