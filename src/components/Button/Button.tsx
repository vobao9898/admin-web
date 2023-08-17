import React from "react";

interface IProps extends React.ComponentPropsWithoutRef<"button"> {
    title: string;
    btnType?: "ok" | "cancel";
    moreClass?: string;
    disabled?: boolean;
    loading?: boolean;
}

const Button: React.FC<IProps> = ({
    title,
    type = "button",
    btnType,
    form,
    moreClass = "",
    loading = false,
    onClick,
    disabled = false,
}) => {
    const generateClass = () => {
        const base = "px-4 py-1.5 text-base font-medium rounded border duration-150 cursor-pointer";
        const normalStyle = "text-blue-500 bg-white border-black/20 hover:opacity-60";
        const cancelStyle = "text-black bg-white border-black/20 hover:opacity-60";
        const okStyle = "text-white bg-blue-500 hover:bg-white hover:text-blue-500 border-blue-500";

        if (disabled) {
            return `${base} ${okStyle} ${moreClass} text-white bg-blue-300 hover:bg-blue-300 hover:text-white`;
        }
        if (btnType === "cancel") {
            return `${base} ${cancelStyle} ${moreClass}`;
        }
        if (btnType === "ok") {
            return `${base} ${okStyle} ${moreClass}`;
        }
        return `${base} ${normalStyle} ${moreClass}`;
    };

    return (
        <button type={type} className={generateClass()} onClick={onClick} disabled={disabled} form={form}>
            {loading ? <i className="las la-spinner mr-1 animate-spin" /> : null}
            {title}
        </button>
    );
};

export default Button;
