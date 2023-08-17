import React from "react";

interface IProps extends React.ComponentPropsWithoutRef<"textarea"> {
    endAdornment?: React.ReactNode;
}

const TextArea: React.FC<IProps> = ({ name, id, value, placeholder, endAdornment, onChange, onBlur, rows }) => {
    return (
        <div className="relative ant-input flex items-center">
            <textarea
                id={id}
                name={name}
                value={value}
                className="w-full text-gray-600 px-4 py-4 ant-input border rounded-xl bg-white border-gray-300 focus:border-blue-500 focus:shadow focus:shadow-blue-500/30 focus:outline-0"
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                rows={rows}
            />
            {endAdornment}
        </div>
    );
};

export default TextArea;
