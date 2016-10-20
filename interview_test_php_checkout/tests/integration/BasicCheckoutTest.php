<?php
	namespace Tests\Integration\Checkout\Checkout;


	use Checkout\Cart\BasicCart;
	use Checkout\Checkout\BasicCheckout;
	use Checkout\Item\BasicItem;
	

	class BasicCheckoutTest extends \PHPUnit_Framework_TestCase
	{
		public function test()
		{
			$checkout = BasicCheckout::createBasicCheckout();
			$cart = BasicCart::create();

			$cart->addItem(new BasicItem('AAA'), 4);
			$cart->addItem(new BasicItem('BBB'), 4);
			$cart->addItem(new BasicItem('AAA'), 2);
			$cart->addItem(new BasicItem('DDD'), 1);
			$cart->addItem(new BasicItem('CCC'), 6);
			$cart->addItem(new BasicItem('DDD'), 1);

			$price = $checkout->calculate($cart);
			
			$this->assertEquals(804, $price, 'Price calculation is not right');
		}
	}