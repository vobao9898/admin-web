import React from "react";
import classNames from "classnames";

interface IProps extends React.ComponentPropsWithoutRef<"label"> {
    required: boolean;
}

const Label: React.FC<IProps> = ({ htmlFor, title, required = true }) => {
    return (
        <div className="pb-2 pr-2">
            <label
                className={classNames("text-sm leading-none", { "after:content-['*'] after:text-red-500": required })}
                htmlFor={htmlFor}
                title={title}
            >
                {title}
            </label>
        </div>
    );
};

export default Label;
