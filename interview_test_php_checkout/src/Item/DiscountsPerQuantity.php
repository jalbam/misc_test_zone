<?php
	namespace Checkout\Item;
	
	
	class DiscountsPerQuantity
	{
		/** @var array */
		private $_discountsPerQuantity;
		
		
		/**
		 * DiscountsPerQuantity constructor.
		 * 
		 * @param array $discountsPerQuantity
		 */
		public function __construct(array $discountsPerQuantity = NULL)
		{
			$this->setDiscountsPerQuantity($discountsPerQuantity);
		}

		
		/**
		 * Gets an specific discount applied to a given quantity.
		 *
		 * @return array
		 */
		public function getDiscountPerQuantity(int $quantity) : float //Not using int because maybe in a future we want to allow floats.
		{
			foreach ($this->getDiscountsPerQuantity() as $quantityLoop => $itemsFree) //Assuming the array is ordered reversly (see setDiscountsPerQuantity method).
			{
				$quantityLoop = (float) $quantityLoop; //Not using intval because maybe in a future we want to allow floats.
				//If the quantity given matches the current minimum amount, returns its associated discount:
				if ($quantity >= $quantityLoop) { return intval($quantity / $quantityLoop) * $itemsFree; }
			}
			return 0; //By default, zero items are free.
		}
		

		/**
		 * Gets the discounts applied (number of items that will be free) which depend on the quantity.
		 *
		 * @return array
		 */
		public function getDiscountsPerQuantity() : Array
		{
			return $this->_discountsPerQuantity;
		}


		/**
		 * Sets the discounts applied which depend on the quantity and returns them.
		 *
		 * @param array $discountsPerQuantity
		 *
		 * @return array
		 */
		public function setDiscountsPerQuantity(array $discountsPerQuantity = NULL) : Array
		{
			if (!is_array($discountsPerQuantity)) { $discountsPerQuantity = Array(); } //Does not throw an error.
			$discountsPerQuantity = array_filter($discountsPerQuantity, function($value, $key) { return (is_numeric($key) && $key > 0 && is_numeric($value) && $value > 0); }, ARRAY_FILTER_USE_BOTH); //Filters the given array (not using is_integer because maybe in a future we want to allow floats).
			krsort($discountsPerQuantity); //Orders the array in reversed order by its index (also useful in the case associative array with string keys was used).
			return $this->_discountsPerQuantity = $discountsPerQuantity; //NOTE: it would be a good idea to check whether $the given parameter is valid or not before setting it (and proceed accordingly, maybe throwing an error).
		}
	}