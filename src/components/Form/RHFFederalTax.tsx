import HelperText from "components/HelperText";
import Label from "components/Label";
import InputMask from "react-input-mask";
import classNames from "classnames";
import { Input } from "antd";
import { Control, Controller, FieldPath, RegisterOptions } from "react-hook-form";
import { MASK_FEDERAL_TAX_ID } from "contants";

interface IProps<T extends Record<string, any>> {
    control: Control<T>;
    name: FieldPath<T>;
    mask: string;
    placeholder?: string;
    label?: string;
    showError?: boolean;
    rules?: Omit<RegisterOptions<T, FieldPath<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
    disabled?: boolean;
}

const RHFFederalTax = <T extends Record<string, any>>({
    control,
    name,
    mask = MASK_FEDERAL_TAX_ID,
    placeholder,
    label,
    showError = true,
    rules,
    disabled = false,
}: IProps<T>) => {
    return (
        <>
            {label && <Label title={label} htmlFor={name} required />}
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
                            onChange={onChange}
                            onBlur={onBlur}
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
                                    className={classNames("text-4 ssn-css", {
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

export default RHFFederalTax;
