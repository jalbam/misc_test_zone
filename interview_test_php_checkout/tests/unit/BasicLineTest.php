<?php
	namespace Tests\Unit\Checkout;

	use Checkout\Item\BasicItem;
	use Checkout\Cart\BasicLine;
	use \Checkout\Item\DiscountsPerQuantity;
	

	class BasicLineTest extends \PHPUnit_Framework_TestCase
	{
		public function test()
		{
			$line = new BasicLine(new BasicItem("AAA"), 1);
			$this->assertTrue($line->getItem() instanceof BasicItem, "Method getItem did not return an instance of BasicItem.");
			$this->assertTrue(is_int($line->getQuantity()) && $line->getQuantity() >= 0, 'Method getQuantity did not return an integer value greater or equal to 0 (' . $line->getQuantity() . ').');
			$this->assertTrue(is_float($line->getPrice()) && $line->getPrice() >= 0, 'Method getPrice did not return a float value greater or equal to 0 (' . $line->getQuantity() . ').');
			
			$discount = NULL;
			$normalPrice = 25;
			$quantity = 1;
			$discountsPerQuantity = NULL;
			$line = new BasicLine(new BasicItem("NEW_SKU", Array("normalPrice" => $normalPrice, "discount" => $discount, "discountsPerQuantity" => $discountsPerQuantity)), $quantity);
			$this->assertEquals(1, $line->getQuantity(), "Quantity expected is wrong.");
			$this->assertEquals(25, $line->getPrice(), "Price expected is wrong.");
			$line->setQuantity(2);
			$this->assertEquals(25 * $line->getQuantity(), $line->getPrice(), "Price expected is wrong.");
			
			$discount = 10;
			$normalPrice = 25;
			$quantity = 1;
			$discountsPerQuantity = NULL;
			$line = new BasicLine(new BasicItem("NEW_SKU", Array("normalPrice" => $normalPrice, "discount" => $discount, "discountsPerQuantity" => $discountsPerQuantity)), $quantity);
			$this->assertEquals($quantity, $line->getQuantity(), "Quantity expected is wrong.");
			$this->assertEquals($quantity * ($normalPrice * ((100 - $discount) / 100)), $line->getPrice(), "Price expected is wrong.");
			$line->setQuantity($quantity = 2);
			$this->assertEquals($quantity, $line->getQuantity(), "Quantity expected is wrong.");
			$this->assertEquals($quantity * ($normalPrice * ((100 - $discount) / 100)), $line->getPrice(), "Price expected is wrong.");
			$line->setQuantity($quantity = 555);
			$this->assertEquals($quantity, $line->getQuantity(), "Quantity expected is wrong.");
			$this->assertEquals($quantity * ($normalPrice * ((100 - $discount) / 100)), $line->getPrice(), "Price expected is wrong.");
			
			$discount = 10;
			$normalPrice = 25;
			$quantity = 1;
			$discountsPerQuantity = new DiscountsPerQuantity(Array(3 => 1, 5 => 2));
			$line = new BasicLine(new BasicItem("NEW_SKU", Array("normalPrice" => $normalPrice, "discount" => $discount, "discountsPerQuantity" => $discountsPerQuantity)), $quantity);
			$this->assertEquals($quantity, $line->getQuantity(), "Quantity expected is wrong.");
			$quantityFree = 0;
			$this->assertEquals($quantity * ($normalPrice * ((100 - $discount) / 100)), $line->getPrice(), "Price expected is wrong.");
			$line->setQuantity($quantity = 4);
			$quantityFree = intval($quantity / 3) * 1;
			$this->assertEquals($quantity, $line->getQuantity(), "Quantity expected is wrong.");
			$this->assertEquals(($quantity - $quantityFree) * $normalPrice, $line->getPrice(), "Price expected is wrong.");
			$line->setQuantity($quantity = 555);
			$quantityFree = intval($quantity / 5) * 2;
			$this->assertEquals($quantity, $line->getQuantity(), "Quantity expected is wrong.");
			$this->assertEquals(($quantity - $quantityFree) * $normalPrice, $line->getPrice(), "Price expected is wrong.");
			
			$discount = NULL;
			$normalPrice = 25;
			$quantity = 1;
			$discountsPerQuantity = new DiscountsPerQuantity(Array(3 => 1, 5 => 2));
			$line = new BasicLine(new BasicItem("NEW_SKU", Array("normalPrice" => $normalPrice, "discount" => $discount, "discountsPerQuantity" => $discountsPerQuantity)), $quantity);
			$this->assertEquals($quantity, $line->getQuantity(), "Quantity expected is wrong.");
			$quantityFree = 0;
			$this->assertEquals($quantity * $normalPrice, $line->getPrice(), "Price expected is wrong.");
			$line->setQuantity($quantity = 4);
			$quantityFree = intval($quantity / 3) * 1;
			$this->assertEquals($quantity, $line->getQuantity(), "Quantity expected is wrong.");
			$this->assertEquals(($quantity - $quantityFree) * $normalPrice, $line->getPrice(), "Price expected is wrong.");
			$line->setQuantity($quantity = 555);
			$quantityFree = intval($quantity / 5) * 2;
			$this->assertEquals($quantity, $line->getQuantity(), "Quantity expected is wrong.");
			$this->assertEquals(($quantity - $quantityFree) * $normalPrice, $line->getPrice(), "Price expected is wrong.");
		}


		/**
		* @expectedException TypeError
		*/		
		public function testConstructorWithException()
		{
			$line = new BasicLine(new BasicItem("NEW_SKU", Array("normalPrice" => 100, "discount" => NULL, "discountsPerQuantity" => NULL)), NULL);
			$line->setItem(NULL);
		}

		
		/**
		* @expectedException Exception
		*/		
		public function testConstructorWithException_2()
		{
			$line = new BasicLine(new BasicItem("NEW_SKU", Array("normalPrice" => 100, "discount" => NULL, "discountsPerQuantity" => NULL)), -1);
			$line->setItem(NULL);
		}
		

		/**
		* @expectedException Exception
		*/		
		public function testConstructorWithException_3()
		{
			$line = new BasicLine(new BasicItem("NEW_SKU", Array("normalPrice" => -1, "discount" => NULL, "discountsPerQuantity" => NULL)), 1);
			$line->setItem(NULL);
		}


		/**
		* @expectedException Exception
		*/		
		public function testConstructorWithException_4()
		{
			$line = new BasicLine(new BasicItem("NEW_SKU", Array("normalPrice" => 100, "discount" => 101, "discountsPerQuantity" => NULL)), 1);
			$line->setItem(NULL);
		}


		/**
		* @expectedException Exception
		*/		
		public function testConstructorWithException_5()
		{
			$line = new BasicLine(new BasicItem("NEW_SKU", Array("normalPrice" => 100, "discount" => -20, "discountsPerQuantity" => NULL)), 1);
			$line->setItem(NULL);
		}


		/**
		* @expectedException TypeError
		*/		
		public function testConstructorWithException_6()
		{
			$line = new BasicLine(new BasicItem("NEW_SKU", Array("normalPrice" => 100, "discount" => 10, "discountsPerQuantity" => "ANYTHING_THAT_IS_NEITHER_NULL_NOR_A_DiscountsPerQuantity_INSTANCE")), 1);
			$line->setItem(NULL);
		}

		
		
		/**
		* @expectedException TypeError
		*/		
		public function testSetItemWithException()
		{
			$line = new BasicLine(new BasicItem("AAA"), 1);
			$line->setItem(NULL);
		}
		

		/**
		* @expectedException TypeError
		*/		
		public function testSetQuantityWithException()
		{
			$line = new BasicLine(new BasicItem("AAA"), 1);
			$line->setQuantity(NULL);
		}

		
		/**
		* @expectedException Exception
		*/		
		public function testSetQuantityWithException_2()
		{
			$line = new BasicLine(new BasicItem("AAA"), 1);
			$line->setQuantity(-1);
		}
	}