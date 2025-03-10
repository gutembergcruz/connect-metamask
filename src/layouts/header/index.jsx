import { useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useWalletManager } from "@noahsaso/cosmodal";
import Logo from "@components/logo";
import MainMenu from "@components/menu/main-menu";
import MobileMenu from "@components/menu/mobile-menu";
import Anchor from "@ui/anchor";
// import SearchForm from "@components/search-form/layout-01";
// import FlyoutSearchForm from "@components/search-form/layout-02";
import UserDropdown from "@components/user-dropdown";
import ColorSwitcher from "@components/color-switcher";
import BurgerButton from "@ui/burger-button";
import Button from "@ui/button";
import { ethers } from "ethers";

import {
    useOffcanvas,
    // useSticky,
    // useFlyoutSearch
} from "@hooks";
import { checkKeplr } from "src/context/WalletProvider";
import { useAppSelector, useAppDispatch } from "@app/hooks";
import { setUserInfo } from "@app/userSlice";
import { getUserInfo } from "./hooks";
// import { CustomWalletContext } from "@context";

const headerData = {
    id: "header-data-1",
    logo: [
        {
            src: "/images/logo/logo-white.png",
        },
        {
            src: "/images/logo/logo-dark.png",
        },
    ],
    activity_link: "/activity",
};

const menuData = [
    {
        id: 1,
        text: "Home",
        path: "/",
    },
    {
        id: 2,
        text: "About",
        path: "/about-us",
    },
    {
        id: 3,
        text: "Explore",
        path: "",
        submenu: [
            {
                id: 31,
                text: "All NFTs",
                path: "/explore/all-nfts",
            },
            {
                id: 32,
                text: "Collections",
                path: "/explore/collections",
            },
        ],
    },
    {
        id: 4,
        text: "Mint",
        path: "/mint",
    },
    // {
    //     id: 5,
    //     text: "Create",
    //     path: "/create-nft",
    // submenu: [
    //     // {
    //     //     id: 51,
    //     //     text: "Create Collection",
    //     //     path: "/create-collection",
    //     // },
    //     {
    //         id: 52,
    //         text: "Create NFT",
    //         path: "/create-nft",
    //     },
    // ],
    // },
];

const Header = ({ className }) => {
    // const sticky = useSticky();
    const { offcanvas, offcanvasHandler } = useOffcanvas();
    // const { search, searchHandler } = useFlyoutSearch();
    const { connect, connectedWallet } = useWalletManager();

    async function connectMetaMask() {
        if (!window.ethereum) return alert('No Metamask Wallet found!');

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            if (!accounts || !accounts.length)
                return alert("Wallet not found/allowed!");
        } catch (err) {
            alert("Failed to connect to MetaMask");
        }
    }

    // const { connectedWallet, connect } = useContext(CustomWalletContext);
    const dispatch = useAppDispatch();
    useEffect(() => {
        (async () => {
            if (connectedWallet) {
                const userInfo = await getUserInfo(connectedWallet.address);
                if (userInfo) dispatch(setUserInfo(userInfo));
            }
        })();
    }, [connectedWallet, dispatch]);

    const isAdmin = useAppSelector((state) => state.admin.isAdmin);
    const finalMenuData = useMemo(() => {
        if (connectedWallet) {
            return menuData.concat([
                {
                    id: 5,
                    text: "Create",
                    path: "/create-nft",
                },
            ]);
        }
        if (connectedWallet && isAdmin) {
            return menuData.concat([
                {
                    id: 6,
                    text: "Create Mint",
                    path: "/create-mint",
                },
            ]);
        }
        return menuData;
    }, [connectedWallet, isAdmin]);

    return (
        <>
            <header
                className={clsx(
                    "rn-header haeder-default black-logo-version header--fixed header--sticky",
                    // sticky && "sticky",
                    className
                )}
            >
                <div className="container">
                    <div className="header-inner">
                        <div className="header-left">
                            <Logo logo={headerData.logo} />
                            <div className="mainmenu-wrapper">
                                <nav
                                    id="sideNav"
                                    className="mainmenu-nav d-none d-xl-block"
                                >
                                    <MainMenu menu={finalMenuData} />
                                </nav>
                            </div>
                        </div>
                        <div className="header-right">
                            {/* <div className="setting-option d-none d-lg-block">
                                <SearchForm />
                            </div>
                            <div className="setting-option rn-icon-list d-block d-lg-none">
                                <div className="icon-box search-mobile-icon">
                                    <button
                                        type="button"
                                        aria-label="Click here to open search form"
                                        onClick={searchHandler}
                                    >
                                        <i className="feather-search" />
                                    </button>
                                </div>
                                <FlyoutSearchForm isOpen={search} />
                            </div> */}
                            {!connectedWallet && (
                                <div className="setting-option header-btn">
                                    <div className="icon-box">
                                        <Button
                                            color="primary-alta"
                                            className="connectBtn"
                                            size="small"
                                            // onClick={
                                            //     handleClickConnectWalletButton
                                            // }
                                            onClick={() => connectMetaMask()}
                                        >
                                            Connect Metamask
                                            <i className="feather-arrow-right" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {connectedWallet && (
                                <div className="setting-option header-btn rn-icon-list user-account">
                                    <UserDropdown />
                                </div>
                            )}
                            <div className="setting-option rn-icon-list notification-badge">
                                <div className="icon-box">
                                    <Anchor path="/activity">
                                        <i className="feather-bell" />
                                        {/* <span className="badge">6</span> */}
                                    </Anchor>
                                </div>
                            </div>
                            <div className="setting-option mobile-menu-bar d-block d-xl-none">
                                <div className="hamberger">
                                    <BurgerButton onClick={offcanvasHandler} />
                                </div>
                            </div>
                            <div
                                id="my_switcher"
                                className="setting-option my_switcher"
                            >
                                <ColorSwitcher />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <MobileMenu
                isOpen={offcanvas}
                onClick={offcanvasHandler}
                menu={finalMenuData}
                logo={headerData.logo}
            />
        </>
    );
};

Header.propTypes = {
    className: PropTypes.string,
};

export default Header;
