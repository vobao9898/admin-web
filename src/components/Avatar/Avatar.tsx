import React from "react";
import classNames from "classnames";
import UserDefaultIcon from "assets/images/user-default.png";

interface IProps {
    src: string;
    className?: string;
}

const Avatar: React.FC<IProps> = ({ src, className }) => {
    return (
        <span className="flex-shrink-0">
            <img
                alt="user-avatar"
                className={classNames("w-10 h-10 rounded-full", className)}
                src={src}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = UserDefaultIcon;
                }}
            />
        </span>
    );
};

export default Avatar;
