import { Radio, RadioGroupProps } from "antd";
import { Control, Controller, FieldPath } from "react-hook-form";
import HelperText from "components/HelperText";
import Label from "components/Label";

interface IProps<T extends Record<string, any>> extends RadioGroupProps {
    control: Control<T>;
    name: FieldPath<T>;
    placeholder?: string;
    label?: string;
    showError?: boolean;
    className?: string;
}

const RHFRadioGroup = <T extends Record<string, any>>({
    control,
    name,
    options,
    label,
    showError = true,
    className = "",
}: IProps<T>) => {
    return (
        <>
            {label && <Label title={label} htmlFor={name} required />}
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value, name }, fieldState: { error } }) => (
                    <>
                        <Radio.Group
                            id={name}
                            className={className}
                            value={value}
                            options={options}
                            onChange={(event) => {
                                const { value } = event.target;
                                onChange(value);
                            }}
                        />
                        {showError && <HelperText message={error?.message || ""} />}
                    </>
                )}
            />
        </>
    );
};

export default RHFRadioGroup;
