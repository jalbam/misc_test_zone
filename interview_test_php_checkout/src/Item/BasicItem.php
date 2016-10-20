<?php
	namespace Checkout\Item;

	use Checkout\Item;
	use Checkout\Item\DiscountsPerQuantity;
	use \Exception;
	
	
	class BasicItem implements Item
	{
		/** @var string */
		private $_SKU;
		
		/** @var float */
		private $_normalPrice;

		/** @var float */
		private $_discount;
		
		/** @var DiscountsPerQuantity */
		private $_discountsPerQuantity;

		
		//This is a fake data for testing purposes (real data should probably come from a database or somewhere else):
		static private $_fakeData;
		
		
		/**
		 * BasicItem constructor.
		 * 
		 * @param string $SKU
		 */
		public function __construct(string $SKU, array $itemData = NULL)//, float $normalPrice = NULL, float $discount = NULL, DiscountsPerQuantity $discountsPerQuantity = NULL)
		{
			$this->setSKU($SKU, $itemData);
		}

		
		/**
		 * Gets the SKU of the item.
		 *
		 * @return string
		 */
		public function getSKU() : string
		{
			return $this->_SKU;
		}


		/**
		 * Sets the SKU for the item and returns it.
		 *
		 * @param string $SKU
		 *
		 * @return string
		 */
		public function setSKU(string $SKU, array $itemData = NULL) : string
		{
			//NOTE: we should use a real data from a database or somewhere else instead.
			if (!is_array($itemData)) { $itemData = $this->getDataFromSKU($SKU); } //This method should not be here (just for testing).
			if ($itemData === NULL) { throw new Exception('Product data not found by its SKU given (' . $SKU . ').'); }
		
			if (!is_string($SKU) || trim($SKU) === "") { throw new Exception('SKU given not valid (' . $SKU . ').'); }
			
			$this->setNormalPrice($itemData["normalPrice"]);
			$this->setDiscount($itemData["discount"]);
			$this->setDiscountsPerQuantity($itemData["discountsPerQuantity"]);
			
			return $this->_SKU = $SKU;
		}
		

		/**
		 * Gets the unit basic price of the item (without discounts).
		 *
		 * @return float
		 */
		public function getNormalPrice() : float
		{
			return $this->_normalPrice;
		}


		/**
		 * Sets the unit basic price of the item (without discounts) and returns it.
		 *
		 * @param float $price
		 *
		 * @return float
		 */
		public function setNormalPrice(float $price) : float
		{
			if ($price < 0) { throw new Exception('Price given is less than zero (' . $price . '). It should be zero for free products or greater for non-free products.'); } //NOTE: allows price zero (0) for free products.
			return $this->_normalPrice = $price;
		}


		/**
		 * Gets the discount applied (percentage).
		 *
		 * @return float
		 */
		public function getDiscount() : float
		{
			return $this->_discount;
		}


		/**
		 * Sets the discount applied (percentage) and returns it.
		 *
		 * @param float $discount
		 *
		 * @return float
		 */
		public function setDiscount(float $discount = NULL) : float
		{
			if ($discount === NULL) { $discount = 0; } //Allows null value.
			
			if ($discount < 0) { throw new Exception('Discount given is less than zero (' . $discount . ').'); }
			else if ($discount > 100) { throw new Exception('Discount given is greater than 100 (' . $discount . ').'); }
			
			return $this->_discount = $discount; //NOTE: it would be a good idea to check whether $the given parameter is valid or not before setting it (and proceed accordingly, maybe throwing an error).
		}


		/**
		 * Gets the discounts applied (number of items that will be free) which depend on the quantity.
		 *
		 * @return DiscountsPerQuantity
		 */
		public function getDiscountsPerQuantity() : DiscountsPerQuantity
		{
			return $this->_discountsPerQuantity;
		}


		/**
		 * Sets the discounts applied which depend on the quantity and returns them.
		 *
		 * @param DiscountsPerQuantity $discountsPerQuantity
		 *
		 * @return DiscountsPerQuantity
		 */
		public function setDiscountsPerQuantity(DiscountsPerQuantity $discountsPerQuantity = NULL) : DiscountsPerQuantity
		{
			if (!($discountsPerQuantity instanceof DiscountsPerQuantity)) { $discountsPerQuantity = new DiscountsPerQuantity(); } //Does not than an error.
			return $this->_discountsPerQuantity = $discountsPerQuantity; //NOTE: it would be a good idea to check whether $the given parameter is valid or not before setting it (and proceed accordingly, maybe throwing an error).
		}
		
		
		/**
		 * Compares the item with a given one.
		 *
		 * @param Item $item
		 *
		 * @return boolean
		 */
		public function equals(Item $item) : bool
		{
			//NOTE: if we desired, we could also check price, discount, etc. But I consider all the products with same SKU should have the same values (and coming from a database probably).
			return ($item instanceof Item && $this->getSKU() === $item->getSKU()); //I only have in mind the SKU to check whether two items are the same or not.
		}

		
		/**
		 * Returns the item name (I think this method should probably use localized data from a database or elsewhere and depending on the given or current language).
		 *
		 * @return string
		 */
		public function getName(string $languageCode = "") : string
		{
			//NOTE: I think this method should probably use localized data from a database or elsewhere and depending on the given or current language.
			return "name_for_" . $this->getSKU(); //This is just an example, not serious (I could have also use $fakeData array).
		}
		
		
		//This is a fake data for testing purposes (real data should probably come from a database or somewhere else):
		private function getDataFromSKU($SKU) //This method should not be here (just for testing).
		{
			$SKU = strval($SKU);
			
			if (!is_array(self::$_fakeData))
			{
				self::$_fakeData = Array
				(
					//SKUs:
					"AAA" => Array
					(
						"normalPrice" => 100,
						"discount" => 10,
						"discountsPerQuantity" => new DiscountsPerQuantity(Array(3 => 1))
					),
					"BBB" => Array
					(
						"normalPrice" => 55,
						"discount" => 5,
						"discountsPerQuantity" => NULL
					),
					"CCC" => Array
					(
						"normalPrice" => 25,
						"discount" => NULL,
						"discountsPerQuantity" => NULL
					),
					"DDD" => Array
					(
						"normalPrice" => 25,
						"discount" => 10,
						"discountsPerQuantity" => new DiscountsPerQuantity(Array(3 => 1))
					)
				);
			}
			
			if (!isset(self::$_fakeData[$SKU])) { return NULL; }
			return self::$_fakeData[$SKU];
		}
	}