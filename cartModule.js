// cartModule.js

import { realTimeData, alert } from '../helpTemplate.js';

// Base class for managing the cart
export class CartManager {
    constructor(objectUpdateElements) {
        this.classNameForProduct = objectUpdateElements.classNameForProduct;
        this.positionProducts = document.querySelector(objectUpdateElements.classNameForPostionProducts);
        this.classNameForTotalPrice = objectUpdateElements.classNameForTotalPrice;
        this.classNameForLoading = objectUpdateElements.classNameForLoading;
        this.objectUpdateElements = objectUpdateElements;
        this.body = document.body;
    }

    updateProducts() {
        let arrayOfProducts = realTimeData.cutDataXmlText(this.allDataFromCartPage, this.classNameForProduct);
        if (arrayOfProducts.length > 0) {
            realTimeData.loopAndShow(arrayOfProducts, this.positionProducts);
        } else {
            location.reload();
        }
    }

    updateTotalPrice() {
        if (this.classNameForTotalPrice) {
            let totalPrice = realTimeData.cutDataXmlText(this.allDataFromCartPage, this.classNameForTotalPrice),
                element = document.querySelector(this.classNameForTotalPrice);
            element.innerText = totalPrice[0].innerText;
        }
    }

    showNewData(data) {
        this.allDataFromCartPage = data;
        this.handleConditions();
        this.updateProducts();
        this.updateTotalPrice();
        this.callback();
        this.handleProductDeletion();
        this.handleQuantityChange();
        this.updateLengthInNavbar();
    }

    updateLengthInNavbar() {
        let item = this.objectUpdateElements.classNameForLengthProductNavbar;
        if (item) {
            let lengthNew = realTimeData.cutDataXmlText(this.allDataFromCartPage, item);
            document.querySelector(item).innerHTML = lengthNew[0].innerHTML;
        }
    }

    handleConditions() {
        let e = realTimeData.cutDataXmlText(this.allDataFromCartPage, ".error"),
            s = realTimeData.cutDataXmlText(this.allDataFromCartPage, ".success");
        alert.removeAll();
        e.length >= 1 ? (this.body.appendChild(e[0])) : ((s[0].style.transform = "scaleY(1)"), this.body.appendChild(s[0]));
    }
}

// Class for managing events in the cart
export class ShoppingCart extends CartManager {
    constructor(objElementsEvents, objectUpdateElements, callback) {
        super(objectUpdateElements);
        this.objElementsEvents = objElementsEvents;
        this.objectUpdateElements = objectUpdateElements;
        this.buttonForQuantity = objElementsEvents.classNameButtonForQuantity;
        this.buttonsForDelete = objElementsEvents.classNameForDeleteButton;
        this.formForCart = document.querySelector(objElementsEvents.classNameToForm);
        this.handleQuantityChange();
        this.handleProductDeletion();
        this.callback = callback;
    }

    showLoading(button) {
        if (this.objElementsEvents.classNameForLoading) {
            let index = button.getAttribute("data-index");
            if (index) {
                let sectionLoading = document.querySelectorAll(this.objElementsEvents.classNameForLoading)[index];
                sectionLoading.style.display = "flex";
            } else {
                console.warn("Button must have data-index attribute for product index");
            }
        }
    }

    handleQuantityChange() {
        this.buttons = document.querySelectorAll(`${this.buttonForQuantity}`);
        this.buttons.forEach(button => {
            button.addEventListener("click", () => {
                this.submitFormData();
                this.showLoading(button);
            });
        });
    }

    submitFormData() {
        realTimeData.postFormRealTime(this.formForCart, "/cart").then(data => {
            this.showNewData(data);
        });
    }

    handleProductDeletion() {
        let buttons = document.querySelectorAll(`${this.buttonsForDelete}`);
        buttons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                let index = button.getAttribute("data-index"),
                    formData = new FormData(this.formForCart);
                formData.set(`CartAdd[${index}].CartAddVariantAddQty`, 0);
                this.submitFormDataOnDelete(formData);
                this.showLoading(button);
            });
        });
    }

    submitFormDataOnDelete(formData) {
        realTimeData.postFormDataRealTime(formData, "/cart").then(data => {
            this.showNewData(data);
        });
    }
}

// Class for building and configuring the cart
export class CartBuilder {
    constructor() {
        this.objElementsEvents = {};
        this.objectUpdateElements = {};
        this.callback = () => {};
    }

    set objElementsEvents(objElementsEvents) {
        const { valid, invalidClasses } = this.validateClasses(objElementsEvents);
        if (!valid) {
            throw new Error(`Invalid class names provided for objElementsEvents: ${invalidClasses.join(', ')}`);
        }
        this._objElementsEvents = objElementsEvents;
    }

    set objectUpdateElements(objectUpdateElements) {
        const { valid, invalidClasses } = this.validateClasses(objectUpdateElements);
        if (!valid) {
            throw new Error(`Invalid class names provided for objectUpdateElements: ${invalidClasses.join(', ')}`);
        }
        this._objectUpdateElements = objectUpdateElements;
    }

    set callback(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        this._callback = callback;
    }

    build() {
        if (!this._objElementsEvents || !this._objectUpdateElements || !this._callback) {
            throw new Error('Incomplete builder configuration');
        }
        return new ShoppingCart(this._objElementsEvents, this._objectUpdateElements, this._callback);
    }

    validateClasses(classNames) {
        const invalidClasses = [];
        for (const className of Object.values(classNames)) {
            const element = document.querySelector(className);
            if (!element) {
                invalidClasses.push(className);
            }
        }
        const valid = invalidClasses.length === 0;
        return { valid, invalidClasses };
    }
}

