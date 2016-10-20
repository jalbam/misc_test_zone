<?php
	namespace Tests\Unit\Checkout\Checkout;


	use Checkout\Item\BasicItem;
	use Checkout\Cart\BasicLine;
	use Checkout\Cart\BasicLines;
	use Checkout\Cart\BasicCart;
	

	class BasicItemTest extends \PHPUnit_Framework_TestCase
	{
		private function _testCart($cart, $initialSize)
		{
			$this->assertTrue($cart->returnLines() instanceof BasicLines, "Method returnLines did not return an instance of BasicLines.");
			$this->assertEquals($initialSize, sizeof($cart->returnLines()), 'Method getNormalPrice did not return an instance of BasicLines with the correct size (' . sizeof($cart->returnLines()) . ').');
			$cart->setLines(new BasicLines(Array(new BasicLine(new BasicItem("AAA"), 1), new BasicLine(new BasicItem("BBB"), 20), new BasicLine(new BasicItem("AAA"), 2))));
			$this->assertEquals(2, sizeof($cart->returnLines()), 'Method getNormalPrice did not return an instance of BasicLines with the correct size (' . sizeof($cart->returnLines()) . ').');
			$cart->addItem(new BasicItem("CCC"), 1);
			$cart->addLine(new BasicLine(new BasicItem("DDD"), 50));
			$this->assertEquals(4, sizeof($cart->returnLines()), 'Method getNormalPrice did not return an instance of BasicLines with the correct size (' . sizeof($cart->returnLines()) . ').');
			$this->assertTrue($cart->getLineBySKU("AAA") instanceof BasicLine, "Method getLineBySKU did not return an instance of BasicLine.");
			$this->assertTrue($cart->getLineBySKU("NON_EXISTING_SKU") === NULL, "Method getLineBySKU did not return a NULL value.");
			$cart->removeLineBySKU("AAA");
			$this->assertTrue($cart->getLineBySKU("AAA") === NULL, "Method getLineBySKU did not return a NULL value.");
			$this->assertTrue($cart->getLineBySKU("BBB") instanceof BasicLine, "Method getLineBySKU did not return an instance of BasicLine.");
			$this->assertTrue(is_float($cart->getTotal()) && $cart->getTotal() > 0, 'Method getTotal did not return the expected value (' . $cart->getTotal() . ').'); //We could check whether it matches the exact value.
			$cart->removeAll();
			$this->assertTrue($cart->getLineBySKU("BBB") === NULL, "Method getLineBySKU did not return a NULL value.");
			$this->assertTrue(is_float($cart->getTotal()) && $cart->getTotal() == 0, 'Method getTotal did not return the expected value (' . $cart->getTotal() . ').');
		}
		
		public function test()
		{
			$this->_testCart(BasicCart::create(), 0);
			$this->_testCart(BasicCart::create(new BasicLines()), 0);
			$this->_testCart(BasicCart::create(new BasicLines(Array(new BasicLine(new BasicItem("AAA"), 1)))), 1);
		}
		

		/**
		* @expectedException TypeError
		*/		
		public function testConstructorWithException()
		{
			$item = BasicCart::create("NEITHER_BasicLines_INSTANCE_NOR_NULL");
		}
		
		
		/**
		* @expectedException TypeError
		*/		
		public function testSetLinesWithException()
		{
			$item = BasicCart::create();
			$item->setLines("NEITHER_BasicLines_INSTANCE_NOR_NULL");
		}
		
		
		/**
		* @expectedException TypeError
		*/		
		public function testAddItemWithException()
		{
			$item = BasicCart::create();
			$item->addItem("NEITHER_BasicLines_INSTANCE_NOR_NULL");
		}

		
		/**
		* @expectedException TypeError
		*/		
		public function testAddLineWithException()
		{
			$item = BasicCart::create();
			$item->addLine("NEITHER_BasicLines_INSTANCE_NOR_NULL");
		}
		
		
		/**
		* @expectedException TypeError
		*/		
		public function testRemoveLineBySKUWithException()
		{
			$item = BasicCart::create();
			$item->removeLineBySKU(NULL);
		}
	}