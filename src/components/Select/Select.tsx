import React from "react";
import { Select as AntSelect, SelectProps } from "antd";
import classNames from "classnames";

export interface ISelectProps extends SelectProps {
    className?: string;
}

const Select: React.FC<ISelectProps> = ({
    options,
    placeholder,
    value,
    showSearch = true,
    disabled = false,
    className = "",
    mode,
    onChange,
    onBlur,
}) => {
    return (
        <AntSelect
            showSearch={showSearch}
            className={classNames(`${className}`, { "text-black": disabled })}
            size="large"
            value={value}
            options={options}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholder}
            filterOption={(input, option) =>
                (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
            }
            disabled={disabled}
            mode={mode}
        />
    );
};

export default Select;
