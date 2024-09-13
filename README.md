# Shopping Cart Module Documentation

This document describes the `cartModule.js` which provides functionalities for managing a shopping cart.

## Imports

The module imports functions from `helpTemplate.js`:

- **realTimeData**: Handles data manipulation and communication.
- **alert**: Manages displaying alerts (success or error).

## Classes

The module defines three classes:

### CartManager (Base Class)

Provides core functionalities for managing the cart.

#### Constructor:

- **objectUpdateElements**: An object containing class names used for DOM manipulation.
- **classNameForProduct**: Class name for each product element in the cart.
- **classNameForPostionProducts**: Class name of the container element for all products.
- **classNameForTotalPrice**: Class name of the element displaying the total price.
- **classNameForLoading**: Class name used for loading indicators (optional).
- **classNameForLengthProductNavbar** (optional): Class name of the element displaying the number of items in the navbar.

#### Methods:

- **updateProducts**:
  - Retrieves product data from the cart page using `realTimeData.cutDataXmlText`.
  - Updates the product list (`classNameForPostionProducts`) with the retrieved data using `realTimeData.loopAndShow`.
  - If no products are found, reloads the page.

- **updateTotalPrice**:
  - Retrieves the total price from the cart page using `realTimeData.cutDataXmlText`.
  - Updates the element displaying the total price (`classNameForTotalPrice`).

- **showNewData**:
  - Receives new cart data.
  - Calls various methods to update the cart based on the data:
    - `handleConditions`: Manages displaying success/error messages.
    - `updateProducts`: Updates product list.
    - `updateTotalPrice`: Updates total price.
    - `callback`: Executes a user-defined callback function (optional).
    - `handleProductDeletion`: Attaches event listeners for product deletion.
    - `handleQuantityChange`: Attaches event listeners for quantity changes.
    - `updateLengthInNavbar` (optional): Updates the number of items in the navbar.

- **updateLengthInNavbar**:
  - Retrieves the number of items from the cart data using `realTimeData.cutDataXmlText`.
  - Updates the element displaying the number of items (`classNameForLengthProductNavbar`).

- **handleConditions**:
  - Retrieves error and success messages from the cart data using `realTimeData.cutDataXmlText`.
  - Removes existing alerts using `alert.removeAll`.
  - Displays the appropriate message (error or success) based on data availability.

### ShoppingCart (Extends CartManager)

Handles events and updates within the cart.

#### Constructor:

- Inherits properties from `CartManager`.
- **objElementsEvents**: An object containing class names for event listeners.
- **classNameButtonForQuantity**: Class name for buttons used to change product quantity.
- **classNameForDeleteButton**: Class name for buttons used to delete products.
- **classNameToForm**: Class name of the form element representing the cart.

#### Methods:

- **showLoading**:
  - Shows a loading indicator when a quantity change button is clicked.
  - Uses `objElementsEvents.classNameForLoading` to identify the loading indicator class.
  - Requires the button to have a `data-index` attribute specifying the product index.

- **handleQuantityChange**:
  - Attaches event listeners to buttons for changing product quantity (`classNameButtonForQuantity`).
  - Triggers `submitFormData` on button click.
  - Calls `showLoading` to display the loading indicator.

- **submitFormData**:
  - Submits the cart form data using `realTimeData.postFormRealTime`.
  - Updates the cart with the received data using `showNewData`.

- **handleProductDeletion**:
  - Attaches event listeners to buttons for deleting products (`classNameForDeleteButton`).
  - Prevents default form submission on button click.
  - Retrieves the product index from the button's `data-index` attribute.
  - Creates a new `FormData` object from the cart form.
  - Sets the quantity of the product to be deleted to 0.
  - Calls `submitFormDataOnDelete` to submit the modified form data.
  - Calls `showLoading` to display the loading indicator.

- **submitFormDataOnDelete**:
  - Submits the modified form data (product quantity set to 0) using `realTimeData.postFormDataRealTime`.
  - Updates the cart with the received data using `showNewData`.

### CartBuilder

Configures and builds the `ShoppingCart` instance.

#### Constructor:

- Initializes properties for `objElementsEvents`, `objectUpdateElements`, and `callback`.

#### Setters:

- **objElementsEvents**: Validates class names and sets the property.
- **objectUpdateElements**: Validates class names and sets the property.
- **callback**: Validates the callback function and sets the property.

#### Methods:

- **build**:
  - Validates if all required properties are set.
  - Creates a new `ShoppingCart` instance using the configured values.

## Usage

1. Import the `CartBuilder` class.
2. Create a new `CartBuilder` instance.
3. Set the `objElementsEvents` and `objectUpdateElements` properties with the appropriate class names.
4. Set the `callback` function to handle updates after the cart is built.
5. Call the `build` method to create the `ShoppingCart` instance.

### Example:

```javascript
import { CartBuilder } from './cartModule.js';

const cartBuilder = new CartBuilder();
cartBuilder.objElementsEvents = {
    classNameButtonForQuantity: 'quantity-button',
    classNameForDeleteButton: 'delete-button',
    classNameToForm: 'cart-form',
    classNameForLoading: 'loading-indicator'
};
cartBuilder.objectUpdateElements = {
    classNameForProduct: 'product-item',
    classNameForPostionProducts: 'product-list',
    classNameForTotalPrice: 'total-price',
    classNameForLengthProductNavbar: 'cart-item-count'
};
cartBuilder.callback = () => {
    // Handle updates after the cart is built
};

const shoppingCart = cartBuilder.build();

