<?php
	namespace Tests\Unit\Checkout\Checkout;


	use Checkout\Item\BasicItem;
	use \Checkout\Cart\BasicLine;
	use Checkout\Cart\BasicLines;
	

	class BasicLinesTest extends \PHPUnit_Framework_TestCase
	{
		private function _testLines(BasicLines $lines)
		{
			$this->assertTrue(sizeof($lines->getLines()) === 2, 'Method getLines returned a wrong sized array (' . sizeof($lines->getLines()) . ').');
			$lines->addLine(new BasicLine(new BasicItem("CCC"), 111));
			$this->assertTrue(sizeof($lines->getLines()) === 3, 'Method getLines returned a wrong sized array (' . sizeof($lines->getLines()) . ').');
			$this->assertTrue($lines->getLineBySKU("AAA") instanceof BasicLine, 'Method getLineBySKU did not return an instance of BasicLine (class ' . get_class($lines->getLineBySKU("AAA")) . ' instead).');
			$this->assertTrue($lines->getLineBySKU("CCC") instanceof BasicLine, 'Method getLineBySKU did not return an instance of BasicLine (class ' . get_class($lines->getLineBySKU("CCC")) . ' instead).');
			$this->assertTrue($lines->getLineBySKU("NON_EXISTING_SKU") === NULL, 'Method getLineBySKU did not return a NULL value.');
			$this->assertTrue($lines->removeLineBySKU("AAA"), 'Method removeLineBySKU could not remove the desired line with the given SKU.');
			$this->assertTrue($lines->getLineBySKU("AAA") === NULL, 'Method getLineBySKU did not return a NULL value.');
			$this->assertTrue(sizeof($lines->getLines()) === 2, 'Method getLines returned a wrong sized array (' . sizeof($lines->getLines()) . ').');
			$this->assertTrue(is_float($lines->getTotal()) && $lines->getTotal() > 0, 'Method getTotal returned a wrong value (' . $lines->getTotal() . ').'); //We could check whether it matches the exact value.
			$lines->removeAll();
			$this->assertTrue(is_float($lines->getTotal()) && $lines->getTotal() == 0, 'Method getTotal returned a wrong value (' . $lines->getTotal() . ').');
		}
		
		
		public function test()
		{
			$lines = new BasicLines();
			$this->assertTrue(is_array($lines->getLines()), "Method getLines did not return an array.");
			$this->assertTrue(sizeof($lines->getLines()) === 0, "Method getLines returned a wrong sized array.");
			$this->assertTrue(is_array($lines->setLines(NULL)), "Method setLines did not return an array.");
			$this->assertTrue(sizeof($lines->getLines()) === 0, "Method getLines returned a wrong sized array.");
			$this->assertTrue(is_array($lines->setLines(Array(new BasicLine(new BasicItem("AAA"), 1), new BasicLine(new BasicItem("BBB"), 20), new BasicLine(new BasicItem("AAA"), 2)))), "Method setLines did not return an array.");
			$this->_testLines($lines);
			
			$lines = new BasicLines(Array(new BasicLine(new BasicItem("AAA"), 1), new BasicLine(new BasicItem("BBB"), 20), new BasicLine(new BasicItem("AAA"), 2)));
			$this->_testLines($lines);
			
			//NOTE: we could also check whether BasicLine behaves as an array since it uses Iterable and Countable interfaces.
		}
		

		/**
		* @expectedException TypeError
		*/		
		public function testConstructorWithException()
		{
			$item = new BasicLines("NEITHER_ARRAY_NOR_NULL");
		}

		
		/**
		* @expectedException TypeError
		*/		
		public function testAddLineWithException()
		{
			$item = new BasicLines();
			$item->addLine("NOT_A_BasicLine_INSTANCE");
		}
		
		
		/**
		* @expectedException TypeError
		*/		
		public function testSetLinesWithException()
		{
			$item = new BasicLines();
			$item->setLines("NEITHER_ARRAY_NOR_NULL");
		}

		/**
		* @expectedException TypeError
		*/		
		public function testRemoveLineBySKUWithException()
		{
			$item = new BasicLines();
			$item->removeLineBySKU(NULL);
		}
	}