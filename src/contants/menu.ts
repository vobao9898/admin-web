interface IMenuChild {
    key: string;
    icon: string;
    name: string;
    path: string;
}
interface IMenu {
    key: string;
    icon: string;
    name: string;
    path?: string;
    roles?: string[];
    child?: IMenuChild[];
}

const MENUS: IMenu[] = [
    {
        key: "1",
        icon: "las la-chart-bar",
        name: "Dashboard",
        path: "/dashboard",
        roles: ["Administrator"],
    },
    {
        key: "2",
        icon: "las la-user-plus",
        name: "Request Management",
        child: [
            {
                key: "2.1",
                icon: "las la-user-plus",
                name: "Pending Request",
                path: "/request/pending-request",
            },
            {
                key: "2.2",
                icon: "las la-user-plus",
                name: "Approved Request",
                path: "/request/approved-request",
            },
            {
                key: "2.3",
                icon: "las la-user-plus",
                name: "Rejected Request",
                path: "/request/rejected-request",
            },
        ],
    },
    {
        key: "3",
        icon: "las la-user-circle",
        name: "Merchant",
        path: "/",
    },
    {
        key: "4",
        icon: "las la-user-friends",
        name: "Consumer",
        path: "/consumer",
    },
    {
        key: "5",
        icon: "las la-gift",
        name: "Gift Card",
        child: [
            {
                key: "5.1",
                icon: "las la-gift",
                name: "Template",
                path: "/gift-card/template",
            },
        ],
    },
    {
        key: "6",
        icon: "las la-comment-dollar",
        name: "Pricing Plan",
        path: "/pricing-plan",
    },
    {
        key: "7",
        icon: "las la-store-alt",
        name: "Market Place",
        path: "/market-place",
    },
    {
        key: "8",
        icon: "las la-file-alt",
        name: "Reports",
        child: [
            {
                key: "8.1",
                icon: "las la-file-alt",
                name: "Transactions",
                path: "/reports/transactions",
            },
            {
                key: "8.2",
                icon: "las la-file-alt",
                name: "Consumer Reload Gift Card",
                path: "/reports/consumer-reload-gift-card",
            },
            {
                key: "8.3",
                icon: "las la-file-alt",
                name: "Merchant Batch Settlement",
                path: "/reports/merchant-batch-settlement",
            },
            {
                key: "8.4",
                icon: "las la-file-alt",
                name: "Gift Card Sold",
                path: "/reports/gift-card-sold",
            },
            {
                key: "8.5",
                icon: "las la-file-alt",
                name: "Gift Card Transactions",
                path: "/reports/gift-card-transactions",
            },
        ],
    },
    {
        key: "9",
        icon: "las la-cog",
        name: "Settings",
        roles: ["Administrator"],
        child: [
            {
                key: "9.1",
                icon: "las la-file-alt",
                name: "Maintenance",
                path: "settings/maintenance",
            },
        ],
    },
    {
        key: "10",
        icon: "las la-address-book",
        name: "Accounts",
        child: [
            {
                key: "10.1",
                icon: "las la-address-book",
                name: "Users",
                path: "/accounts/account-users",
            },
            {
                key: "10.2",
                icon: "las la-address-book",
                name: "Logs",
                path: "/accounts/logs",
            },
            {
                key: "10.3",
                icon: "las la-user-shield",
                name: "Roles",
                path: "/accounts/roles",
            },
        ],
    },
    {
        key: "11",
        icon: "las la-user",
        name: "Principal",
        path: "/principal",
    },
];

export { MENUS };
