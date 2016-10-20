<?php
	namespace Checkout\Cart;

	use Checkout\Line;
	use \Iterator;
	use \Countable;
	use \Exception;

	
	class BasicLines implements Iterator, Countable
	{
		/** @var int */
		private $_pointer = 0;
		
		/** @var array */
		private $_lines;

		
		/**
		 * BasicLines constructor.
		 * 
		 * @param array $lines
		 */
		public function __construct(Array $lines = NULL)
		{
			$this->_pointer = 0;
			$this->setLines($lines);
		}
		
		
		/**
		 * Gets the lines (array).
		 *
		 * @return array
		 */
		public function getLines() : Array
		{
			return $this->_lines;
		}
		
		
		/**
		 * Sets the given lines (array) and returns them.
		 *
		 * @param array $lines
		 *
		 * @return array
		 */
		public function setLines(Array $lines = NULL) : Array
		{
			$lines = is_array($lines) ? $lines : Array(); //Does not throw an error.
			$lines = array_filter($lines, function($value) { return ($value instanceof Line); }); //Filters the given array.
			$this->_lines = Array();
			foreach ($lines as $line)
			{
				$this->addLine($line);
			}
			return $this->_lines;
		}
		
		
		/**
		 * Adds a new line and returns it.
		 *
		 * @param Line $line 
		 *
		 * @return Line
		 */
		public function addLine(Line $line) : Line
		{
			//Checks whether a line with the same product (checked by its SKU) already exists and increases the quantity if so:
			foreach ($this->_lines as $lineLoopKey => $lineLoop)
			{
				if ($lineLoop->getItem()->getSKU() === $line->getItem()->getSKU())
				{
					$this->_lines[$lineLoopKey]->setQuantity($this->_lines[$lineLoopKey]->getQuantity() + $line->getQuantity()); //This way allows negative values to decrease.
					return $this->_lines[$lineLoopKey];
				}
			}

			return $this->_lines[] = $line; //Adds the new line and returns it.
		}
	

		/**
		 * Gets a line by a given product (its SKU).
		 *
		 * @param string $SKU
		 *
		 * @return Line
		 */
		public function getLineBySKU(string $SKU)// : ?Line (needs PHP 7.1 to allow returning nullable values)
		{
			//Checks whether a line with the same product (checked by its SKU) already exists and returns the line found if so:
			foreach ($this->_lines as $lineLoop)
			{
				if ($SKU === $lineLoop->getItem()->getSKU()) { return $lineLoop; }
			}
			return NULL;
		}
	
		
		/**
		 * Removes a line that belongs to a given product (by its SKU).
		 *
		 * @param string $SKU
		 *
		 * @return boolean
		 */
		public function removeLineBySKU(string $SKU) : bool
		{
			//Checks whether a line with the same product (checked by its SKU) already exists and returns NULL if so:
			foreach ($this->_lines as $lineLoopKey => $lineLoop)
			{
				if ($SKU === $lineLoop->getItem()->getSKU()) { unset($this->_lines[$lineLoopKey]); return TRUE; }
			}
			return FALSE;
		}
		
		
		/**
		 * Gets the price of this line (having in mind the discounts, quantities, etc.).
		 *
		 * @return float
		 */
		public function getTotal() : float
		{
			$quantity = 0;
			//Checks whether a line with the same product (checked by its SKU) already exists and returns NULL if so:
			foreach ($this->_lines as $lineLoopKey => $lineLoop)
			{
				$quantity += $lineLoop->getPrice();
			}
			return $quantity;
		}


		/**
		 * Removes all the lines.
		 */
		public function removeAll()
		{
			$this->_lines = Array();
			$this->_pointer = 0;
		}

		
		//Methods (from Iterator and Countable) to make the class act as it was an array:
		function key() { return $this->_pointer; }
		function current() { return $this->_lines[$this->_pointer]; }
		function rewind() { $this->_pointer = 0; }
		function next() { ++$this->_pointer; }
		function valid() { return isset($this->_lines[$this->_pointer]); }
		public function count() { return sizeof($this->_lines); }
	}