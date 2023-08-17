import { Switch } from "antd";
import { Control, Controller, FieldPath } from "react-hook-form";
import HelperText from "components/HelperText";
import Label from "components/Label";

interface IProps<T extends Record<string, any>> {
    control: Control<T>;
    name: FieldPath<T>;
    placeholder?: string;
    label?: string;
    showError?: boolean;
    labelRequired?: boolean;
    className?: string;
    onChangeSwitch?: (value: any) => void;
}

const RHFSwitch = <T extends Record<string, any>>({
    control,
    name,
    label,
    showError = true,
    labelRequired = true,
    className = "",
    onChangeSwitch,
}: IProps<T>) => {
    return (
        <>
            {label && <Label title={label} htmlFor={name} required={labelRequired} />}
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value, name }, fieldState: { error } }) => (
                    <>
                        <Switch
                            id={name}
                            checked={Boolean(value)}
                            onChange={(checked: any) => {
                                onChange(checked);
                                if (onChangeSwitch) {
                                    onChangeSwitch(checked);
                                }
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

export default RHFSwitch;
