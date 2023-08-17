import React from "react";
import classNames from "classnames";

interface IProps extends React.ComponentPropsWithoutRef<"input"> {
    onClear?: () => void;
    className?: string;
}

const SearchInput: React.FC<IProps> = ({ placeholder, value, className = "", onChange, onClear }) => {
    const handleClear = () => {
        if (onClear && value) onClear();
    };

    return (
        <div className={classNames("relative w-52", className)}>
            <input
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className="w-full h-10 rounded-xl text-gray-600 bg-white border border-solid border-gray-100 pr-9 pl-4 focus:border-blue-500 focus:shadow focus:shadow-blue-500/30 focus:outline-0"
                type="text"
            />
            <i
                onClick={handleClear}
                className={classNames(
                    "text-lg las absolute top-1.5 right-3 z-10 cursor-pointer",
                    { "la-search": !value },
                    { "la-times": value }
                )}
            ></i>
        </div>
    );
};

export default SearchInput;
