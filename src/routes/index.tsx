import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "layouts/admin";
import PrivateRoute from "./PrivateRoute";
import LoadingScreen from "components/LoadingScreen";

const LoginPage = lazy(() => import("features/Login"));
const VerifyPage = lazy(() => import("features/Verify"));
const Dashboard = lazy(() => import("features/Dashboard/DashBoard"));
const PrincipalPage = lazy(() => import("features/Principal"));
const PrincipalPageDetail = lazy(() => import("features/Principal/Profile"));
const PendingRequest = lazy(() => import("features/RequestManagement/PendingRequest"));
const PendingRequestDetail = lazy(() => import("features/RequestManagement/PendingRequest/Profile"));
const MerchantPage = lazy(() => import("features/Merchants"));
const AccountUsers = lazy(() => import("features/Accounts/Users"));
const AccountUserProfile = lazy(() => import("features/Accounts/Users/Profile"));
const AccountRoles = lazy(() => import("features/Accounts/Roles"));
const AccountLogs = lazy(() => import("features/Accounts/Logs"));
const AccountCreateUser = lazy(() => import("features/Accounts/Users/Create"));
const ApprovedRequest = lazy(() => import("features/RequestManagement/ApprovedRequest"));
const ApprovedRequestDetail = lazy(() => import("features/RequestManagement/ApprovedRequest/Profile"));
const RejectRequest = lazy(() => import("features/RequestManagement/RejectRequest"));
const RejectRequestDetail = lazy(() => import("features/RequestManagement/RejectRequest/Profile"));
const ReportTransactions = lazy(() => import("features/Report/Transactions"));
const MarketPlace = lazy(() => import("features/MarketPlace"));
const ConsumerReloadGiftCard = lazy(() => import("features/Report/ConsumerReloadGiftCard"));
const MerchantBatchSettlement = lazy(() => import("features/Report/MerchantBatchSettlement"));
const MerchantBatchSettlementDetail = lazy(() => import("features/Report/MerchantBatchSettlement/Detail/index"));
const MerchantBatchSettlementClose = lazy(() => import("features/Report/MerchantBatchSettlement/Close"));
const GiftCardSold = lazy(() => import("features/Report/GiftCardSold"));
const GiftCardSoldDetail = lazy(() => import("features/Report/GiftCardSold/Detail"));
const GiftCardTransaction = lazy(() => import("features/Report/GiftCardTransactions"));
const MarketPlaceProfile = lazy(() => import("features/MarketPlace/Profile/index"));
const Consumer = lazy(() => import("features/Consumer"));
const PricingPlan = lazy(() => import("features/PricingPlan"));
const Maintenance = lazy(() => import("features/Setting/Maintenance"));
const GiftCardTemplate = lazy(() => import("features/GiftCard/GiftCardTemplate"));
const ConsumerProfile = lazy(() => import("features/Consumer/Profile"));
const MerchantCreate = lazy(() => import("features/Merchants/Create"));
const MerchantProfile = lazy(() => import("features/Merchants/Profile"));

const PRIVATE_ROUTES = [
    {
        path: "/",
        element: <MerchantPage />,
    },
    {
        path: "/:id",
        element: <MerchantProfile />,
    },
    {
        path: "/merchant/add",
        element: <MerchantCreate />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
        roles: ["Administrator"],
    },
    {
        path: "/principal",
        element: <PrincipalPage />,
    },
    {
        path: "/principal/:principalId",
        element: <PrincipalPageDetail />,
    },
    {
        path: "/accounts/account-users/",
        element: <AccountUsers />,
    },
    {
        path: "/accounts/account-users/:id",
        element: <AccountUserProfile />,
    },
    {
        path: "/accounts/account-users/new",
        element: <AccountCreateUser />,
    },
    {
        path: "/accounts/roles",
        element: <AccountRoles />,
    },
    {
        path: "/accounts/logs",
        element: <AccountLogs />,
    },

    {
        path: "/request/pending-request",
        element: <PendingRequest />,
    },
    {
        path: "/request/pending-request/:merchantId",
        element: <PendingRequestDetail />,
    },

    {
        path: "/request/approved-request",
        element: <ApprovedRequest />,
    },
    {
        path: "/request/approved-request/:merchantId",
        element: <ApprovedRequestDetail />,
    },

    {
        path: "/request/rejected-request",
        element: <RejectRequest />,
    },
    {
        path: "/request/rejected-request/:merchantId",
        element: <RejectRequestDetail />,
    },
    {
        path: "/reports/transactions",
        element: <ReportTransactions />,
    },
    {
        path: "/market-place",
        element: <MarketPlace />,
    },
    {
        path: "/market-place/:id",
        element: <MarketPlaceProfile />,
    },
    {
        path: "/reports/consumer-reload-gift-card",
        element: <ConsumerReloadGiftCard />,
    },
    {
        path: "/reports/merchant-batch-settlement",
        element: <MerchantBatchSettlement />,
    },
    {
        path: "/reports/merchant-batch-settlement/close",
        element: <MerchantBatchSettlementClose />,
    },
    {
        path: "/reports/merchant-batch-settlement/:settlementId/:merchantId",
        element: <MerchantBatchSettlementDetail />,
    },
    {
        path: "/reports/gift-card-sold",
        element: <GiftCardSold />,
    },
    {
        path: "/reports/gift-card-sold/:merchantId",
        element: <GiftCardSoldDetail />,
    },
    {
        path: "/reports/gift-card-transactions",
        element: <GiftCardTransaction />,
    },
    {
        path: "/consumer",
        element: <Consumer />,
    },
    {
        path: "/consumer/:id",
        element: <ConsumerProfile />,
    },
    {
        path: "/pricing-plan",
        element: <PricingPlan />,
    },
    {
        path: "/settings/maintenance",
        element: <Maintenance />,
        roles: ["Administrator"],
    },
    {
        path: "/gift-card/template",
        element: <GiftCardTemplate />,
    },
];

export default function routes() {
    return (
        <React.Suspense fallback={null}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/verify" element={<VerifyPage />} />
                <Route path="/" element={<MainLayout />}>
                    {PRIVATE_ROUTES.map((item) => {
                        return (
                            <Route key={item.path} element={<PrivateRoute roles={item.roles} />}>
                                <Route
                                    path={item.path}
                                    element={
                                        <React.Suspense fallback={<LoadingScreen />}>{item.element}</React.Suspense>
                                    }
                                />
                            </Route>
                        );
                    })}
                </Route>
            </Routes>
        </React.Suspense>
    );
}
