export default function Checkout() {
  return (
    <div className="card checkout">
      <label className="title">Checkout</label>
      <div className="details">
        <span>Your cart subtotal:</span>
        <span>47.99$</span>
        <span>Discount through applied coupons:</span>
        <span>3.99$</span>
        <span>Shipping fees:</span>
        <span>4.99$</span>
      </div>
      <div className="checkout--footer">
        <label className="price">
          <sup>$</sup>57.99
        </label>
        <button className="checkout-btn">Checkout</button>
      </div>
    </div>
  );
}
