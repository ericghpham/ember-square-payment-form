import Component from '@ember/component';
import { equal } from '@ember/object/computed';
import { assert } from '@ember/debug';
import template from '../templates/components/square-payment-form-styled';
import { computed } from '@ember/object';

const SquarePaymentFormStyledStyles = {
  light: 'light',
  dark: 'dark'
};

const PAYMENT_FORM_BASE_INPUT_STYLE = {
  backgroundColor: 'transparent',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '16px',
  _webkitFontSmoothing: 'antialiased',
  _mozOsxFontSmoothing: 'grayscale'
};

const LIGHT_PAYMENT_FORM_INPUT_STYLES = [
  Object.assign({}, PAYMENT_FORM_BASE_INPUT_STYLE, {
    color: '#000000',
    placeholderColor: '#CCCCCC'
  })
];

const DARK_PAYMENT_FORM_INPUT_STYLES = [
  Object.assign({}, PAYMENT_FORM_BASE_INPUT_STYLE, {
    color: '#ffffff',
    placeholderColor: '#5C6B7D'
  })
];

/**
 * The styled Square Payment Form component lets you get up and running quickly with Square
 * by providing a beautiful customer payment experience out of the box.
 *
 * It has full support for digital wallets and conventional credit cards, while saving you
 * time on CSS and JS styling.
 *
 * All you need to use this component are:
 *
 * - An `applicationId` and a `locationId` from the [Square Developer Dashboard](https://connect.squareup.com/apps)
 * - An `onCardNonceResponseReceived` action to handle the nonce generated by the form and send it to your backend,
 *    so you can make a server-side charge request to Square.
 *
 * ..and one additional argument for digital wallets:
 *
 * - A `createPaymentRequest` action to return data to show information about the payment in the
 *   Apple Pay, Google Pay, and Masterpass interfaces.
 *
 * **Example: Basic Payment Form**
 *
 * ```hbs
 * {{square-payment-form-styled
 *   acceptCreditCards=true
 *   applicationId="my-app-id"
 *   locationId="my-location-id"
 *   onCardNonceResponseReceived=(action "handleCardNonce")
 * }}
 * ```
 *
 * @class SquarePaymentFormStyled
 */
export default Component.extend({
  layout: template,

  /**
   * Toggles "Pay with Apple Pay" button.
   *
   * Note: The Apple Pay button will only show if all of the following are true:
   *
   * - This flag is enabled
   * - Customer is using the Safari web browser
   * - Your site is served with HTTPS
   * - You're using production credentials for the Square Payment Form
   * - You've provided a payment request creation callback
   * - You've provided a card nonce received callback
   * - You've verified your domain for Apple Pay in the [Square Developer Dashboard](https://developer.squareup.com/apps)
   *
   * @argument acceptApplePay
   * @type Boolean
   * @default false
   */
  acceptApplePay: false,

  /**
   * Toggles visibility of credit card fields (credit card number, expiration date, CVV, and postal code).
   */
  acceptCreditCards: false,

  /**
   * Toggles "Pay with Google Pay" button
   *
   * Note: The Google Pay button will only show if all of the following are true:
   *
   * - This flag is enabled
   * - Your site is served with HTTPS
   * - You're using production credentials for the Square Payment Form
   * - You've provided a payment request creation callback
   * - You've provided a card nonce received callback
   *
   * @argument acceptGooglePay
   * @type Boolean
   * @default false
   */
  acceptGooglePay: false,

  /**
   * Toggles "Pay with Masterpass" button
   *
   * Note: The Masterpass button will only show if all of the following are true:
   *
   * - This flag is enabled
   * - Your site is served with HTTPS
   * - You're using production credentials for the Square Payment Form
   * - You've provided a payment request creation callback
   * - You've provided a card nonce received callback
   *
   * @argument acceptMasterpass
   * @type Boolean
   * @default false
   */
  acceptMasterpass: false,

  /**
   * Text to put inside of the "Charge" button, which is present when
   * credit cards are accepted.
   *
   * @argument digitalWalletsDividerText
   * @type String
   * @default Pay with Card
   */
  creditCardPayButtonText: 'Pay with Card',

  /**
   * Text to put inside of the divider present when digital wallets are enabled.
   *
   * @argument digitalWalletsDividerText
   * @type String
   * @default Or
   */
  digitalWalletsDividerText: 'Or',

  /**
   * What style colors to use for the Payment Form.
   *
   * | Value   | Description                  |
   * | ------- | ---------------------------- |
   * | `light` | For use on light backgrounds |
   * | `dark` | For use on dark backgrounds  |
   *
   * @argument style
   * @type String
   * @default light
   */
  style: SquarePaymentFormStyledStyles.light,

  /**
   * **Required**: callback that gets fired when a nonce is received from the SqPaymentForm JS library.
   * You can then pass this nonce to a your back-end server to make a "charge" request to Square.
   *
   * **Example**: Sample function to send the nonce to your server.
   *
   * ```js
   * (errors, nonce, cardData, billingContact, shippingContact, shippingOption) => {
    *   if (errors && errors.length > 0) {
    *     return alert('Error while processing credit card.');
    *   }
    *
    *   // Send nonce to your server
    *   fetch('https://example.com/charge', {
    *     body: JSON.stringify({ nonce }),
    *     method: 'POST'
    *   });
    * }
    * ```
   *
   * **Method Signature**
   *
   * Example:
   *
   * ```js
   * function(errors, nonce, cardData, billingContact, shippingContact, shippingOption) {
   *   // Handle callback
   * }
   * ```
   *
   * Schema:
   *
   * | Parameter         | Type           | Description                                                |
   * | ----------------- | -------------- | ---------------------------------------------------------- |
   * | `errors`          | Error[]        | An array of errors. Empty if nonce request succeeded.      |
   * | `nonce`           | string         | Nonce to send to back-end server to make charge request    |
   * | `cardData`        | CardData       | Basic credit card data, such as brand, last 4 digits, etc. |
   * | `billingContact`  | Contact        | Digital wallets only. Billing address / info for customer  |
   * | `shippingContact` | Contact        | Digital wallets only. Shipping address / info for customer |
   * | `shippingOption`  | ShippingOption | Apple Pay only. Shipping option selected by customer       |
   *
   * **Error Object**
   *
   * | Property  | Type   | Description                                                |
   * | --------- | ------ | ---------------------------------------------------------- |
   * | `field`   | string | An array of errors. Empty if nonce request succeeded.      |
   * | `message` | string | Nonce to send to back-end server to make charge request    |
   * | `type`    | string | Basic credit card data, such as brand, last 4 digits, etc. |
   *
   * **Error Types**
   *
   * | Error Type               | Description
   * | ------------------------ | ------------------------------------------------------------------------------------- |
   * | `INVALID_APPLICATION_ID` | The application ID provided when initializing the payment form is invalid             |
   * | `MISSING_APPLICATION_ID` | An application ID was not provided when initializing the payment form                 |
   * | `MISSING_CARD_DATA`      | One or more card data fields was not filled out in the payment form                   |
   * | `TOO_MANY_REQUESTS`      | Your application has generated too many nonce generation requests in too short a time |
   * | `UNAUTHORIZED`           | Your application is not authorized to use the Connect API to accept online payments   |
   * | `UNSUPPORTED_CARD_BRAND` | Card is not supported                                                                 |
   * | `UNKNOWN`                | An unknown error occurred                                                             |
   * | `VALIDATION_ERROR`       | The provided data is invalid                                                          |
   *
   * **Error Fields**
   *
   * Two errors can be associated with a particular field:
   *
   * - `UNSUPPORTED_CARD_BRAND` (`cardNumber`)
   * - `VALIDATION_ERROR` (`cardNumber`, `cvv`, `expirationDate`, or `cvv`)
   *
   * If the error can be associated with a field, it will be one of these values, as
   * listed above:
   *
   * - `cardNumber`: Credit card number is not valid
   * - `expirationDate`: Expiration date is not valid
   * - `postalCode`: Expiration date is not valid
   * - `cvv`: CVV is not valid
   *
   * **Contact Object (Digital Wallets Only)**
   *
   * | Property       | Type     | Description                                                                         |
   * | -------------- | -------- | ----------------------------------------------------------------------------------- |
   * | `familyName`   | string   | Last name of the contact                                                            |
   * | `givenName`    | string   | First name of the contact                                                           |
   * | `email`        | string   | Email address of the contact                                                        |
   * | `country`      | string   | A 2-letter string containing the ISO 3166-1 country code of the contact address     |
   * | `countryName`  | string   | The full country name of the contact. Read only.                                    |
   * | `region`       | string   | The applicable administrative region (e.g., province, state) of the contact address |
   * | `city`         | string   | The city name of the contact address                                                |
   * | `addressLines` | string[] | The street address lines of the contact address                                     |
   * | `postalCode`   | string   | The postal code of the contact address                                              |
   * | `phone`        | string   | The telephone number of the contact                                                 |
   *
   * **Shipping Option Object (Apple Pay Only)**
   *
   * | Name   | Type   | Description                                                                                     |
   * | ------ | ------ | ----------------------------------------------------------------------------------------------- |
   * | id     | string | A unique ID to reference this shipping option                                                   |
   * | label  | string | A short title for this shipping option. Shown in the Apple Pay interface                        |
   * | amount | string | The cost of this shipping option as a string representation of a float. The value can be "0.00" |
   *
   * @action
   * @argument onCardNonceResponseReceived
   * @type Action
   * @required
   */
  onCardNonceResponseReceived: null,

  /**
   * **Required for Digital Wallets**: callback that gets fired when a digital wallet button is pressed.
   * This callback returns data to show information about the payment in the Apple Pay, Google Pay,
   * and Masterpass interfaces.
   *
   * This method **must** return a `PaymentRequest` object.
   *
   * **Example**: Sample function to create a payment request.
   *
   * ```js
   * function() {
   *   return {
   *     requestShippingAddress: true,
   *     requestBillingInfo: true,
   *     shippingContact: {
   *       familyName: "CUSTOMER LAST NAME",
   *       givenName: "CUSTOMER FIRST NAME",
   *       email: "mycustomer@example.com",
   *       country: "USA",
   *       region: "CA",
   *       city: "San Francisco",
   *       addressLines: [
   *         "1455 Market St #600"
   *       ],
   *       postalCode: "94103"
   *     },
   *     currencyCode: "USD",
   *     countryCode: "US",
   *     total: {
   *       label: "MERCHANT NAME",
   *       amount: "TOTAL AMOUNT",
   *       pending: false
   *     },
   *     lineItems: [
   *       {
   *         label: "Subtotal",
   *         amount: "SUBTOTAL AMOUNT",
   *         pending: false
   *       },
   *       {
   *         label: "Shipping",
   *         amount: "SHIPPING AMOUNT",
   *         pending: true
   *       },
   *       {
   *         label: "Tax",
   *         amount: "TAX AMOUNT",
   *         pending: false
   *       }
   *     ]
   *   }
   * }
   * ```
   *
   * **Payment Request Object (Digital Wallets Only)**
   *
   * | Property                 | Type       | Description                                                                                         |
   * | ------------------------ | ---------- | --------------------------------------------------------------------------------------------------- |
   * | `requestShippingAddress` |	boolean    | Lets customers select a shipping address in the digital wallet UI.                                  |
   * | `requestBillingInfo`     | boolean    | Lets customers select a billing address in the digital wallet UI.                                   |
   * | `shippingContact`        | Contact    | Optional. Default shipping information to display in the digital wallet UI.                         |
   * | `countryCode`            | string     | 2-letter ISO 3166-1 alpha-2 country code                                                            |
   * | `currencyCode`           | string     | 3-letter ISO 4217 currency code                                                                     |
   * | `lineItems`              | LineItem[] | List of items included in the transaction. Typically displayed in digital wallet UI.                |
   * | `total`                  | LineItem   | Merchant name, status, and total cost of the transaction. Typically displayed in digital wallet UI. |
   *
   * **Contact Object (Digital Wallets Only)**
   *
   * | Property       | Type     | Description                                                                         |
   * | -------------- | -------- | ----------------------------------------------------------------------------------- |
   * | `familyName`   | string   | Last name of the contact                                                            |
   * | `givenName`    | string   | First name of the contact                                                           |
   * | `email`        | string   | Email address of the contact                                                        |
   * | `country`      | string   | A 2-letter string containing the ISO 3166-1 country code of the contact address     |
   * | `countryName`  | string   | The full country name of the contact. Read only.                                    |
   * | `region`       | string   | The applicable administrative region (e.g., province, state) of the contact address |
   * | `city`         | string   | The city name of the contact address                                                |
   * | `addressLines` | string[] | The street address lines of the contact address                                     |
   * | `postalCode`   | string   | The postal code of the contact address                                              |
   * | `phone`        | string   | The telephone number of the contact                                                 |
   *
   * **Line Item Object (Digital Wallets Only)**
   *
   * | Name    | Type    | Description |
   * | ------- | ------- | ----------- |
   * | label   | string  | Human-readable string that explains the purpose of the amount. For a line item, this is typically the name of the charge or object purchased. For the total field, this is typically the merchant name. |
   * | amount  | string  | The cost of the object as a string representation of a float with 2 decimal places. (e.g., "15.00"). For a line item, this is typically the cost of the object, a subtotal, or additional charge (e.g., taxes, shipping). For the total field, this is the total charge of the transaction and should equal the sum of the line item amounts. |
   * | pending | boolean | Optional. A boolean indicating whether or not the value in the amount field represents an estimated or unknown cost. Typically, this field is false. |
   *
   * @action
   * @argument createPaymentRequest
   * @type Action
   */
  createPaymentRequest: null,

  /**
   * Callback that gets fired when a customer selects a new shipping address in a Apple Pay.
   *
   * Use this callback to validate a the buyer shipping contact. If validation indicates a problem, return
   * an error message for the buyer. Update payment request details if a change in shipping address requires it.
   *
   * You **must** call `done` when using this callback.
   *
   * **Example**
   *
   * ```js
   * function (shippingContact, done) {
   *  var valid = true;
   *  var shippingErrors = {};
   *
   *  if (!shippingContact.postalCode) {
   *    shippingErrors.postalCode = "postal code is required";
   *    valid = false;
   *  }
   *  if (!shippingContact.addressLines) {
   *    shippingErrors.addressLines = "address lines are required";
   *    valid = false;
   *  }
   *
   *  if (!valid) {
   *    done({shippingContactErrors: shippingErrors});
   *    return;
   *  }
   *
   *  // Shipping address unserviceable.
   *  if (shippingContact.country !== 'US' || shippingContact.country !== 'CA') {
   *    done({error: 'Shipping to outside of the U.S. and Canada is not available.'});
   *    return;
   *  }
   *
   *  // Update total, lineItems, and shippingOptions for Canadian address.
   *  if (shippingContact.country === 'CA') {
   *    done({
   *      total: {
   *        label: "Total",
   *        amount: "UPDATED AMOUNT",
   *        pending: false
   *      },
   *     // Note: lineItems REPLACES the set of the line items in the PaymentRequest
   *      lineItems: [
   *        ...
   *
   *        {
   *          label: "Tax",
   *          amount: "UPDATED AMOUNT",
   *          pending: false
   *        }
   *      ],
   *      shippingOptions: [
   *        {
   *          id: "1",
   *          label: "SHIPPING LABEL",
   *          amount: "SHIPPING AMOUNT"
   *        }
   *      ]
   *    });
   *    return;
   *  }
   *
   *  // No changes are necessary.
   *  done();
   * }
   * ```
   *
   * **Parameters**
   *
   * | Name              | Type                           | Description |
   * | ----------------- | ------------------------------ | ----------- |
   * | `shippingContact` | RedactedShippingContact        | Redacted shipping contact that buyer selected in the Apple Pay payment sheet. |
   * | `done`            | function(PaymentDetailsObject) | Use to update the payment amount after taxes, service fees, or similar charges are recalculated. |
   *
   * **Payment Details Update Object (Digital Wallets Only)**
   *
   * | Name                  | Type             | Description |
   * | --------------------- | ---------------- | ----------- |
   * | `error`                 | string           | Optional. Use this error if the shipping address is valid but the item cannot be shipped to that address. |
   * | `shippingContactErrors` | ShippingErrors   | Optional. Allows for granular validation errors for addressLine, country, city, region and postal code. |
   * | `total`                 | LineItem         | Optional. Change the total amount of the transaction |
   * | `lineItems`             | LineItem[]       | Optional. To update the line items - most common updates are to add the cost of shipping and the sales tax based on the buyer’s shipping address. |
   * | `shippingOptions`       | ShippingOption[] | Optional. This is updated in response to the customer choosing a new shipping address |
   *
   * **Redacted Shipping Contact Object (Digital Wallets Only)**
   *
   * | Property       | Type     | Description                                                                         |
   * | -------------- | -------- | ----------------------------------------------------------------------------------- |
   * | `country`      | string   | A 2-letter string containing the ISO 3166-1 country code of the contact address     |
   * | `countryName`  | string   | The full country name of the contact. Read only.                                    |
   * | `region`       | string   | The applicable administrative region (e.g., province, state) of the contact address |
   * | `city`         | string   | The city name of the contact address                                                |
   * | `postalCode`   | string   | The postal code of the contact address                                              |
   *
   * **Line Item Object (Digital Wallets Only)**
   *
   * | Name      | Type    | Description |
   * | --------- | ------- | ----------- |
   * | `label`   | string  | Human-readable string that explains the purpose of the amount. For a line item, this is typically the name of the charge or object purchased. For the total field, this is typically the merchant name. |
   * | `amount`  | string  | The cost of the object as a string representation of a float with 2 decimal places. (e.g., "15.00"). For a line item, this is typically the cost of the object, a subtotal, or additional charge (e.g., taxes, shipping). For the total field, this is the total charge of the transaction and should equal the sum of the line item amounts. |
   * | `pending` | boolean | Optional. A boolean indicating whether or not the value in the amount field represents an estimated or unknown cost. Typically, this field is false. |
   *
   * **Shipping Errors Object (Apple Pay Only)**
   *
   * | Name      | Type    | Description |
   * | --------- | ------- | ----------- |
   * | `label`   | string  | Human-readable string that explains the purpose of the amount. For a line item, this is typically the name of the charge or object purchased. For the total field, this is typically the merchant name. |
   * | `amount`  | string  | The cost of the object as a string representation of a float with 2 decimal places. (e.g., "15.00"). For a line item, this is typically the cost of the object, a subtotal, or additional charge (e.g., taxes, shipping). For the total field, this is the total charge of the transaction and should equal the sum of the line item amounts. |
   * | `pending` | boolean | Optional. A boolean indicating whether or not the value in the amount field represents an estimated or unknown cost. Typically, this field is false. |
   *
   * @action
   * @argument onCardNonceResponseReceived
   * @type Action
   */
  shippingContactChanged: null,

  /**
   * Callback that gets fired when a customer selects a new shipping option in Apple Pay.
   *
   * You can use this to recalculate and update fields such as taxes or the total cost. You **must** call
   * `done` when using this callback.
   *
   * **Example**
   *
   * ```js
   * function(shippingOption, done) {
   *   // Creates a new array of line items that includes only 1 line
   *   // item. The item for a shipping option. Production code would get the
   *   // array of line items from the original PaymentRequest and add/update a line
   *   // item for the shippingOption argument of this callback.
   *   const newLineItems = [{
   *     label: shippingOption.label,
   *     amount: shippingOption.amount,
   *     pending: false
   *   }];
   *   const newTotal = {
   *     label: "Total",
   *
   *     // TODO: total amount to be calc'd based on difference between old and new
   *     // amount of this shippingOption.amount if shippingOption.amount was updated.
   *     // -- OR --
   *     // Increase total amount if the line item for this shippingOption is new.
   *     amount: "SOME_AMOUNT + shippingOption.amount",
   *     pending: false
   *   };
   *
   *   done({
   *   // Note: newLineItems REPLACES the set of the line items in the PaymentRequest
   *   // newTotal REPLACES the original payment total.
   *   lineItems: newLineItems,
   *   total: newTotal
   * };
   * ```
   *
   * **Parameters**
   *
   * | Name             | Type                           | Description |
   * | ---------------- | ------------------------------ | ----------- |
   * | `shippingOption` | ShippingOption                 | The shipping option the buyer selected in the Apple Pay payment sheet. |
   * | `done`           | function(PaymentDetailsObject) | Use to update the payment amount after taxes, service fees, or similar charges are recalculated. |
   *
   * **Shipping Option Object (Apple Pay Only)**
   *
   * | Name   | Type   | Description                                                                                     |
   * | ------ | ------ | ----------------------------------------------------------------------------------------------- |
   * | id     | string | A unique ID to reference this shipping option                                                   |
   * | label  | string | A short title for this shipping option. Shown in the Apple Pay interface                        |
   * | amount | string | The cost of this shipping option as a string representation of a float. The value can be "0.00" |
   *
   * **Payment Details Update Object (Digital Wallets Only)**
   *
   * Note, this object has a limited selection of fields compared to the `shippingContactChanged` callback.
   *
   * | Name                  | Type             | Description |
   * | --------------------- | ---------------- | ----------- |
   * | `total`                 | LineItem         | Optional. Change the total amount of the transaction |
   * | `lineItems`             | LineItem[]       | Optional. To update the line items - most common updates are to add the cost of shipping and the sales tax based on the buyer’s shipping address. |
   *
   * @action
   * @argument shippingOptionChanged
   * @type Action
   */
  shippingOptionChanged: null,

  // ADDON INTERNALS

  env: null,

  /**
   * Boolean computed property that checks if the style property is set to "light".
   * @private
   */
  isStyleLight: equal('style', 'light'),

  /**
   * Determines whether to use the light payment form input styles or dark payment form input styles
   * that get passed directly to the Square Payment Form component.
   * @private
   */
  styledFormInputStyles: computed('isStyleLight', function() {
    return this.isStyleLight ? LIGHT_PAYMENT_FORM_INPUT_STYLES : DARK_PAYMENT_FORM_INPUT_STYLES;
  }),

  /**
   * Checks if the form is to configured to accept any digital wallet payment methods
   * @private
   */
  acceptDigitalWallets: computed('acceptApplePay', 'acceptGooglePay', 'acceptMasterpass', function() {
    return this.acceptApplePay || this.acceptGooglePay || this.acceptMasterpass;
  }),

  /**
   * Action that does nothing. Used for null callback values.
   * @private
   */
  actions: {
    doNothing() {}
  },

  /**
   * Runs assertions to make sure that at least one payment method is enabled.
   * @private
   */
  didReceiveAttrs() {
    assert(
      'Must accept Apple Pay, credit cards, Google Pay, or Masterpass when using the Square Styled Payment Form',
      this.acceptApplePay || this.acceptCreditCards || this.acceptGooglePay || this.acceptMasterpass
    );
    assert('Must provide an onCardNonceResponseReceived action', !!this.onCardNonceResponseReceived);
    assert(
      'Must provide a createPaymentRequest action for digital wallet integrations',
      (!this.acceptApplePay && !this.acceptGooglePay && !this.acceptMasterpass) || !!this.createPaymentRequest
    );
  }
});
