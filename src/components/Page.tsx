import React from "react";
import { forwardRef } from "react";
import { Helmet } from "react-helmet-async";

interface IPageProps {
    children: React.ReactNode;
    title: string;
    meta?: any;
}

const Page = forwardRef(({ children, title = "", meta, ...other }: IPageProps, ref) => (
    <>
        <Helmet>
            <title>{`${title}`}</title>
            {meta}
        </Helmet>
        <div>{children}</div>
    </>
));

export default Page;
