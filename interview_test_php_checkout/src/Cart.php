<?php
	namespace Checkout;

	use Checkout\Cart\BasicLines;
	
	
	interface Cart
	{
		/**
		 * Returns the lines.
		 *
		 * @return Lines
		 */
		public function returnLines() : BasicLines;

		
		/**
		 * Sets the given lines and returns them.
		 *
		 * @param Lines $lines
		 *
		 * @return Lines
		 */
		public function setLines(BasicLines $lines) : BasicLines;


		/**
		 * Adds an item and its quantity to the cart and returns its line.
		 *
		 * @param Item $item
		 * @param int $quantity
		 *
		 * @return Line
		 */
		public function addItem(Item $item, int $quantity) : Line;


		/**
		 * Adds a line to the cart and returns it.
		 *
		 * @param Line $line
		 *
		 * @return Line
		 */
		public function addLine(Line $line) : Line;

		
		/**
		 * Gets a desired line by a given product (using its SKU).
		 *
		 * @param string $SKU
		 *
		 * @return Line
		 */
		public function getLineBySKU(string $SKU);// : ?Line (needs PHP 7.1 to allow returning nullable values)


		/**
		 * Removes a desired line by its product (using SKU).
		 *
		 * @param string $SKU
		 *
		 * @return boolean
		 */
		public function removeLineBySKU(string $SKU) : bool;
		
		
		/**
		 * Gets the price of this cart.
		 *
		 * @return float
		 */
		public function getTotal() : float;

		
		/**
		 * Empties the cart.
		 */
		public function removeAll();
	}