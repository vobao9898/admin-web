import logo from "assets/images/logo.png";
import logoMenu from "assets/images/logoMenu.png";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Header from "./header/Header";
import "./index.css";
import Menu from "./menu";

const Layout = () => {
    const [isCollapsed, set_isCollapsed] = useState(window.innerWidth < 1025);
    const [isDesktop, set_isDesktop] = useState(window.innerWidth > 767);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        function handleResize() {
            if (window.innerWidth < 1025 && !isCollapsed) {
                set_isCollapsed(true);
            }
            set_isDesktop(window.innerWidth > 767);
        }
        window.addEventListener("resize", handleResize, true);

        return () => window.removeEventListener("resize", handleResize, true);
    }, [isCollapsed]);

    return (
        <main className="overflow-x-hidden">
            <Header isCollapsed={isCollapsed} isDesktop={isDesktop} />
            <div
                className={classNames(
                    "flex items-center justify-between text-gray-800 hover:text-gray-500 h-20 fixed top-0 left-0 px-5 font-bold transition-all duration-300 ease-in-out z-20 bg-blue-100",
                    {
                        "w-80": !isCollapsed,
                        "w-20": isCollapsed,
                    }
                )}
            >
                <div>
                    <a href="/" className="flex items-center">
                        {!isCollapsed ? (
                            <img className="w-[60%]" src={logo} alt="" />
                        ) : (
                            <img className="w-[40px] h-[40px]" src={logoMenu} alt="" />
                        )}
                    </a>
                </div>

                <div
                    className={classNames("hamburger", {
                        "is-active": isCollapsed,
                    })}
                    onClick={() => set_isCollapsed(!isCollapsed)}
                >
                    <span className="line" />
                    <span className="line" />
                    <span className="line" />
                </div>
            </div>
            <div
                onMouseEnter={() => {
                    const offsetWidth = document.body.offsetWidth;
                    document.body.style.overflowY = "hidden";
                    document.body.style.paddingRight = document.body.offsetWidth - offsetWidth + "px";
                }}
                onMouseLeave={() => {
                    document.body.style.overflowY = "auto";
                    document.body.style.paddingRight = "";
                }}
                className={classNames(
                    "fixed z-20 top-20 left-0 h-screen bg-blue-100 transition-all duration-300 ease-in-out",
                    {
                        "w-20": isCollapsed,
                        "w-80": !isCollapsed && isDesktop,
                        "w-[320px]": !isCollapsed && !isDesktop,
                        "-left-20": isCollapsed && !isDesktop,
                    }
                )}
            >
                <Menu isCollapsed={isCollapsed} />
            </div>
            <section
                id={"main"}
                className={classNames(
                    "px-5 transition-all duration-300 ease-in-out z-10 h-[calc(100vh-5rem)] relative",
                    {
                        "ml-80": !isCollapsed && isDesktop,
                        "ml-20": isCollapsed && isDesktop,
                    }
                )}
            >
                <Outlet />
            </section>
            <div className="hidden h-7 w-7 leading-7" />
        </main>
    );
};
export default Layout;
