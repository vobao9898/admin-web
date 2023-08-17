import { Input } from "antd";
import InputMask from "react-input-mask";
import classNames from "classnames";

interface IProps extends React.ComponentPropsWithoutRef<"input"> {
    mask: string;
}

const PhoneInput: React.FC<IProps> = ({ mask, value, placeholder, onChange, onBlur, disabled }) => {
    return (
        <InputMask mask={mask} maskChar={null} value={value} onChange={onChange} onBlur={onBlur} disabled={disabled}>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            {(inputProps: any) => (
                <Input
                    size="large"
                    className={classNames(
                        '"w-full h-10 text-gray-600 px-4 text-3.5 ant-input border rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:shadow focus:shadow-blue-500/30 focus:outline-0 placeholder:font-normal placeholder:text-gray-400',
                        { disabled: disabled }
                    )}
                    placeholder={placeholder}
                    {...inputProps}
                    disabled={disabled}
                />
            )}
        </InputMask>
    );
};

export default PhoneInput;
