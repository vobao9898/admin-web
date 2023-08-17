import React from "react";

interface IProps extends React.ComponentPropsWithoutRef<"button"> {
    title: string;
}

const RoundButton: React.FC<IProps> = ({ title, type = "button" }) => {
    return (
        <button
            type={type}
            className="text-white outline-none text-base p-2 w-full rounded-xl hover:bg-blue-400 mt-1 bg-blue-500"
        >
            {title}
        </button>
    );
};

export default RoundButton;
