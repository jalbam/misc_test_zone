<?php
	namespace Checkout;


	interface Checkout
	{
		/**
		 * @param Cart $cart
		 *
		 * @return float
		 */
		public function calculate(Cart $cart) : float;
	}