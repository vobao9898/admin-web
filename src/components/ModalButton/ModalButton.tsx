import React from "react";
import classNames from "classnames";

interface IProps extends React.ComponentPropsWithoutRef<"button"> {
    btnType: "cancel" | "save";
    title: string;
    loading?: boolean;
    className?: string;
}

const ModalButton: React.FC<IProps> = ({ btnType, type, title, disabled, loading, className, onClick }) => {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={classNames(
                "px-4 py-2.5 rounded-xl inline-flex items-center btn-save",
                {
                    "text-white bg-blue-500 hover:bg-blue-400": btnType === "save",
                },
                {
                    "bg-blue-100  hover:bg-blue-500 hover:text-white": btnType === "cancel",
                },
                {
                    "bg-gray-100 hover:bg-gray-300 hover:text-white !text-gray-400": disabled && btnType === "save",
                },
                className
            )}
        >
            {loading ? <i className="las la-spinner mr-1 animate-spin" /> : null}
            {title}
        </button>
    );
};

export default ModalButton;
