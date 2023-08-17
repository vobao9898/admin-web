import IExtra from "./IExtra";
import IGiftCard from "./IGiftCard";
import IProduct from "./IProduct";
import IService from "./IService";

interface IBasket {
    services: IService[];
    products: IProduct[];
    extras: IExtra[];
    giftCards: IGiftCard[];
}

export default IBasket;
