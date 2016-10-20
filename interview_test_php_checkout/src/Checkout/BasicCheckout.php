<?php

namespace Checkout\Checkout;

use Checkout\Cart;
use Checkout\Checkout;
use \Exception;


class BasicCheckout implements Checkout
{
    /**
     * @return BasicCheckout
     */
    public static function createBasicCheckout()
    {
        return new self();
    }

    
	/**
     * @param Cart $cart
	 *
     * @return float
     */
    public function calculate(Cart $cart) : float
    {
		return $cart->getTotal();
    }
}