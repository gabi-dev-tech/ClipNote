export default function Checkout() {
  return (
    <div class="card checkout">
      <label class="title">Checkout</label>
      <div class="details">
        <span>Your cart subtotal:</span>
        <span>47.99$</span>
        <span>Discount through applied coupons:</span>
        <span>3.99$</span>
        <span>Shipping fees:</span>
        <span>4.99$</span>
      </div>
      <div class="checkout--footer">
        <label class="price">
          <sup>$</sup>57.99
        </label>
        <button class="checkout-btn">Checkout</button>
      </div>
    </div>
  );
}
