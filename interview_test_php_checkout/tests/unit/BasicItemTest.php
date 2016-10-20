<?php
	namespace Tests\Unit\Checkout;


	use Checkout\Item\BasicItem;
	use Checkout\Item\DiscountsPerQuantity;
	

	class BasicItemTest extends \PHPUnit_Framework_TestCase
	{
		public function test()
		{
			$itemsSKUArray = Array("AAA", "BBB", "CCC", "DDD"); //This is not very good. Test should be independent of the external data.
			foreach ($itemsSKUArray as $SKU)
			{
				$item = new BasicItem($SKU);
				$this->assertTrue(is_string($item->getSKU()) && trim($item->getSKU()) !== "", "Method getSKU did not return a non-empty string.");
				$this->assertTrue(is_float($item->getNormalPrice()) && $item->getNormalPrice() >= 0, 'Method getNormalPrice did not return a float number greater or equal to 0 (' . $item->getNormalPrice() . ').');
				$this->assertTrue(is_float($item->getDiscount()) && $item->getDiscount() >= 0, 'Method getDiscount did not return a float number greater or equal to 0 (' . $item->getDiscount() . ').');
				$this->assertTrue($item->getDiscountsPerQuantity() instanceof DiscountsPerQuantity, "Method getDiscount did not return an instance of DiscountsPerQuantity.");
				$this->assertTrue(is_float($item->getNormalPrice()) && $item->getNormalPrice() >= 0, 'Method getNormalPrice did not return a float number greater or equal to 0 (' . $item->getNormalPrice() . ').');
				$item->setDiscount(33);
				$this->assertEquals(33, $item->getDiscount(), "Method getDiscount did not return the expected value.");
				$item->setNormalPrice(13);
				$this->assertEquals(13, $item->getNormalPrice(), "Method getNormalPrice did not return the expected value.");
				$this->assertTrue(is_string($item->getName()) && trim($item->getName()) !== "", "Method getName did not return a non-empty string.");
				$this->assertTrue($item->setDiscountsPerQuantity(NULL) instanceof DiscountsPerQuantity, "Method setDiscount did not return an instance of DiscountsPerQuantity.");
				$this->assertTrue($item->setDiscountsPerQuantity(new DiscountsPerQuantity()) instanceof DiscountsPerQuantity, "Method setDiscount did not return an instance of DiscountsPerQuantity.");
			}

			$this->assertTrue
			(
				(new BasicItem("CCC"))->equals
				(
					new BasicItem("CCC", Array("normalPrice" => 25, "discount" => NULL, "discountsPerQuantity" => NULL))
				),
				"Two items with same SKU should be equal always."
			);

			$this->assertTrue
			(
				!(new BasicItem("CCC"))->equals
				(
					new BasicItem("NEW_SKU", Array("normalPrice" => 25, "discount" => NULL, "discountsPerQuantity" => NULL))
				),
				"Two items with same SKU should never be equal."
			);
		}
		

		/**
		* @expectedException Exception
		*/		
		public function testConstructorWithException()
		{
			$item = new BasicItem("NON_VALID_SKU");
		}
		
		
		/**
		* @expectedException Exception
		*/		
		public function testSetSKUWithException()
		{
			$item = new BasicItem("AAA");
			$item->setSKU("NON_VALID_SKU");
		}


		/**
		* @expectedException TypeError
		*/		
		public function testSetNormalPriceWithException()
		{
			$item = new BasicItem("AAA");
			$item->setNormalPrice(NULL);
		}
		
		
		/**
		* @expectedException Exception
		*/		
		public function testSetNormalPriceWithException_2()
		{
			$item = new BasicItem("AAA");
			$item->setNormalPrice(-1);
		}


		/**
		* @expectedException Exception
		*/		
		public function testSetDiscountWithException()
		{
			$item = new BasicItem("AAA");
			$item->setDiscount(101);
		}
		

		/**
		* @expectedException Exception
		*/		
		public function testSetDiscountWithException_2()
		{
			$item = new BasicItem("AAA");
			$item->setDiscount(-1);
		}


		/**
		* @expectedException TypeError
		*/		
		public function testSetDiscountsPerQuantityWithException()
		{
			$item = new BasicItem("AAA");
			$item->setDiscountsPerQuantity("ANYTHING_THAT_IS_NEITHER_NULL_NOR_A_DiscountsPerQuantity_INSTANCE");
		}
	}