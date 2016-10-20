<?php
	namespace Checkout\Cart;

	use Checkout\Cart;
	use Checkout\Item;
	use Checkout\Line;
	use Checkout\Cart\BasicLines;
	
	
	class BasicCart implements Cart
	{
		/** @var BasicLines */
		private $_lines;

		
		/**
		 * @return BasicCart
		 */
		public static function create(BasicLines $lines = NULL) : BasicCart
		{
			$thisObject = new self();
			$thisObject->setLines($lines);
			return $thisObject;
		}

		
		/**
		 * Returns the lines.
		 *
		 * @return Lines
		 */
		public function returnLines() : BasicLines
		{
			return $this->_lines;
		}
		
		
		/**
		 * Sets the given lines and returns them.
		 *
		 * @param BasicLines $lines
		 *
		 * @return BasicLines
		 */
		public function setLines(BasicLines $lines = NULL) : BasicLines
		{
			if (!($lines instanceof BasicLines)) { $lines = new BasicLines(); } //Does not throw an error.
			//NOTE: it would be a good idea to check whether $the given parameter is valid or not before setting it (and proceed accordingly, maybe throwing an error).
			return $this->_lines = $lines;
		}
		

		/**
		 * Adds an item and its quantity to the cart and returns its line.
		 *
		 * @param Item $item
		 * @param int $quantity
		 *
		 * @return Line
		 */
		public function addItem(Item $item, int $quantity) : Line
		{
			return $this->addLine(new BasicLine($item, $quantity));
		}


		/**
		 * Adds a line to the cart and returns it.
		 *
		 * @param Line $line
		 *
		 * @return Line
		 */
		public function addLine(Line $line) : Line
		{
			return $this->_lines->addLine($line);
		}

		
		/**
		 * Gets a desired line by a given product (using its SKU).
		 *
		 * @param string $SKU
		 *
		 * @return Line
		 */
		public function getLineBySKU(string $SKU)// : ?Line (needs PHP 7.1 to allow returning nullable values)
		{
			return $this->_lines->getLineBySKU($SKU);
		}

	
		/**
		 * Removes a desired line by its product (using SKU).
		 *
		 * @param string $SKU
		 *
		 * @return boolean
		 */
		public function removeLineBySKU(string $SKU) : bool
		{
			return $this->_lines->removeLineBySKU($SKU);
		}
		
		
		/**
		 * Gets the price of this cart.
		 *
		 * @return float
		 */
		public function getTotal() : float
		{
			return $this->_lines->getTotal();
		}
		
		
		/**
		 * Empties the cart.
		 */
		public function removeAll()
		{
			return $this->_lines->removeAll();
		}
	}