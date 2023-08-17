import React from "react";
import Notification from "../notifications";
import classNames from "classnames";
import { Dropdown } from "antd";
import Avatar from "components/Avatar/Avatar";
import { useUser } from "hooks/useUser";
import type { MenuProps } from "antd";
import { KEY_USER } from "contants";
import { useNavigate } from "react-router-dom";

interface IGlobalUser {
    token: string;
    userAdmin: {
        firstName: string;
        lastName: string;
        imageUrl: string;
        roleName: string;
        waUserId: number;
    };
}

const Header = ({ isCollapsed = false, isDesktop = true }) => {
    const { userGlobal } = useUser();
    const navigate = useNavigate();
    const user = localStorage.getItem(KEY_USER)
        ? (JSON.parse(localStorage.getItem(KEY_USER) || "null") as IGlobalUser)
        : null;

    const handleSignOut = () => {
        localStorage.clear();
        if (caches) {
            caches.keys().then((names) => {
                for (const name of names) {
                    caches.delete(name);
                }
            });
        }
        window.location.hash = "/login";
        setTimeout(() => {
            window.location.reload();
        });
    };

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <li
                    className="cursor-pointer"
                    onClick={() => {
                        navigate(`/accounts/account-users/${user?.userAdmin.waUserId}`);
                    }}
                >
                    Profile
                </li>
            ),
        },
        {
            key: "2",
            label: (
                <li
                    onClick={handleSignOut}
                >
                    Sign Out
                </li>
            ),
        },
    ];

    return (
        <header
            className={classNames(
                "bg-blue-50 w-full header h-20 transition-all duration-300 ease-in-out sticky top-0 block z-20",
                {
                    "pl-80": !isCollapsed && isDesktop,
                    "pl-32": isCollapsed && isDesktop,
                    "pl-28": !isDesktop,
                }
            )}
        >
            <div className="flex items-center justify-end sm:justify-between px-5 h-20">
                <div></div>
                <div className="flex items-center cursor-pointer">
                    <Notification />
                    <div className="text-right leading-none mr-3 hidden sm:block">
                        <div className="font-bold text-black text-lg leading-snug mb-0.5"></div>
                        <div className="text-cyan-blue font-semibold text-lg">
                            {userGlobal && userGlobal.userAdmin
                                ? `${userGlobal?.userAdmin?.firstName} ${userGlobal?.userAdmin?.lastName}`
                                : ""}
                        </div>
                    </div>
                    <Dropdown trigger={["hover", "click"]} menu={{ items }} placement="bottomRight">
                        <div className="flex" onClick={(e) => e.preventDefault()}>
                            <Avatar src={userGlobal?.userAdmin?.imageUrl || ""} />
                        </div>
                    </Dropdown>
                </div>
            </div>
        </header>
    );
};

export default Header;
