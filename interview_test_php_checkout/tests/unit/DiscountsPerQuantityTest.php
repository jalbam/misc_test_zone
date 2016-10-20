<?php
	namespace Tests\Unit\Checkout;


	use Checkout\Item\DiscountsPerQuantity;
	

	class DiscountsPerQuantityTest extends \PHPUnit_Framework_TestCase
	{
		public function test()
		{
			$dicountPerQuantity = new DiscountsPerQuantity();
			$this->assertEquals(0, $dicountPerQuantity->getDiscountPerQuantity(-1), 'Discount calculated is wrong.');
			$this->assertEquals(0, $dicountPerQuantity->getDiscountPerQuantity(0), 'Discount calculated is wrong.');
			$this->assertEquals(0, $dicountPerQuantity->getDiscountPerQuantity(1), 'Discount calculated is wrong.');
			$this->assertEquals(0, $dicountPerQuantity->getDiscountPerQuantity(3), 'Discount calculated is wrong.');
			$this->assertEquals(0, $dicountPerQuantity->getDiscountPerQuantity(999), 'Discount calculated is wrong.');

			$dicountPerQuantity = new DiscountsPerQuantity();
			$dicountPerQuantity->setDiscountsPerQuantity(NULL);
			$this->assertEquals(0, $dicountPerQuantity->getDiscountPerQuantity(-1), 'Discount calculated is wrong.');
			$this->assertEquals(0, $dicountPerQuantity->getDiscountPerQuantity(0), 'Discount calculated is wrong.');
			$this->assertEquals(0, $dicountPerQuantity->getDiscountPerQuantity(1), 'Discount calculated is wrong.');
			$this->assertEquals(0, $dicountPerQuantity->getDiscountPerQuantity(3), 'Discount calculated is wrong.');
			$this->assertEquals(0, $dicountPerQuantity->getDiscountPerQuantity(999), 'Discount calculated is wrong.');
			
			$dicountPerQuantity = new DiscountsPerQuantity(Array(-1 => 20, 0 => 2, 1 => 1, 3 => 2, 10 => 6));
			$this->assertEquals(0, $dicountPerQuantity->getDiscountPerQuantity(-1), 'Discount calculated is wrong.');
			$this->assertEquals(0, $dicountPerQuantity->getDiscountPerQuantity(0), 'Discount calculated is wrong.');
			$this->assertEquals(1, $dicountPerQuantity->getDiscountPerQuantity(1), 'Discount calculated is wrong.');
			$this->assertEquals(2, $dicountPerQuantity->getDiscountPerQuantity(3), 'Discount calculated is wrong.');
			$this->assertEquals(intval(999/10) * 6, $dicountPerQuantity->getDiscountPerQuantity(999), 'Discount calculated is wrong.');
			
			$dicountPerQuantity = new DiscountsPerQuantity();
			$dicountPerQuantity->setDiscountsPerQuantity(Array(-1 => 20, 0 => 2, 1 => 1, 3 => 2, 10 => 6));
			$this->assertEquals(0, $dicountPerQuantity->getDiscountPerQuantity(-1), 'Discount calculated is wrong.');
			$this->assertEquals(0, $dicountPerQuantity->getDiscountPerQuantity(0), 'Discount calculated is wrong.');
			$this->assertEquals(1, $dicountPerQuantity->getDiscountPerQuantity(1), 'Discount calculated is wrong.');
			$this->assertEquals(2, $dicountPerQuantity->getDiscountPerQuantity(3), 'Discount calculated is wrong.');
			$this->assertEquals(intval(999/10) * 6, $dicountPerQuantity->getDiscountPerQuantity(999), 'Discount calculated is wrong.');
		}
	}