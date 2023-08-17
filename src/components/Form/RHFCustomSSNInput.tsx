import HelperText from "components/HelperText";
import Label from "components/Label";
import InputMask from "react-input-mask";
import classNames from "classnames";
import { Input } from "antd";
import { Control, Controller, FieldPath, RegisterOptions } from "react-hook-form";
import { MASK_SOCIAL_SECURITY_NUMBER } from "contants";
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
    handleOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleOnBlur?: (value: string) => void;
}

const RHFCustomSSNInput = <T extends Record<string, any>>({
    control,
    name,
    mask = MASK_SOCIAL_SECURITY_NUMBER,
    placeholder,
    label,
    showError = true,
    labelRequired = true,
    rules,
    disabled = false,
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
                    <>
                        <InputMask
                            mask={mask}
                            maskChar={null}
                            value={value}
                            onChange={(event) => {
                                onChange(event);
                                handleChange(event);
                            }}
                            onBlur={() => {
                                onBlur();
                                hanldeBlur(value);
                            }}
                            disabled={disabled}
                        >
                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                            {/* @ts-ignore */}
                            {(inputProps: any) => (
                                <Input
                                    id={name}
                                    size="large"
                                    placeholder={placeholder}
                                    {...inputProps}
                                    disabled={disabled}
                                    className={classNames("ssn-css", {
                                        "!text-gray-600 !bg-gray-three": disabled,
                                    })}
                                />
                            )}
                        </InputMask>
                        {showError && <HelperText message={error?.message || ""} />}
                    </>
                )}
            />
        </>
    );
};

export default RHFCustomSSNInput;
