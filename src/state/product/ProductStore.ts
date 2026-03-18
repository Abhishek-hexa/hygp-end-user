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

    removeProduct(productId: string) {
        if (this._products === null) {
            return;
        }
        this._products = this._products.filter((p) => p.productId !== productId);
    }

    increaseQuantity(productId: string) {
        if (this._products === null) {
            return;
        }
        const product = this._products.find((p) => p.productId === productId);
        if (product) {
            product.qty += 1;
        }
    }

    decreaseQuantity(productId: string) {
        if (this._products === null) {
            return;
        }
        const product = this._products.find((p) => p.productId === productId);
        if (product && product.qty > 1) {
            product.qty -= 1;
        }
    }

}