import { makeAutoObservable } from "mobx";
import { SerializedProductConfiguration } from "./types";

export class ProductStore {
    private _products: SerializedProductConfiguration[] | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get products() {
        return this._products;
    }

    get totalPrice() {
        if (this._products === null) {
            return '0';
        }
        return String(this._products.reduce((total, product) => total + (parseFloat(product.price || '0') * product.qty), 0).toFixed(2));
    }


    addProduct(product: SerializedProductConfiguration) {
        if (this._products === null) {
            this._products = [product];
        } else {
            this._products.push(product);
        }
    }

    removeProduct(productKey: string) {
        if (this._products === null) {
            return;
        }
        this._products = this._products.filter((p) => p.key !== productKey);
    }

    increaseQuantity(productKey: string) {
        if (this._products === null) {
            return;
        }
        const product = this._products.find((p) => p.key === productKey);
        if (product) {
            product.qty += 1;
        }
    }

    decreaseQuantity(productKey: string) {
        if (this._products === null) {
            return;
        }
        const product = this._products.find((p) => p.key === productKey);
        if (product && product.qty > 1) {
            product.qty -= 1;
        }
    }

}
