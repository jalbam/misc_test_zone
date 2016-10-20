<?php
	namespace Checkout;
	
	use Checkout\Item\DiscountsPerQuantity;

	
	interface Item
	{
		/**
		 * Gets the SKU of the item.
		 *
		 * @return string
		 */
		public function getSKU() : string;


		/**
		 * Sets the SKU for the item and returns it.
		 *
		 * @param string $SKU
		 *
		 * @return string
		 */
		public function setSKU(string $SKU, array $itemData = NULL) : string;
		

		/**
		 * Gets the unit basic price of the item (without discounts).
		 *
		 * @return float
		 */
		public function getNormalPrice() : float;


		/**
		 * Sets the unit basic price of the item (without discounts) and returns it.
		 *
		 * @param float $price
		 *
		 * @return float
		 */
		public function setNormalPrice(float $price) : float;


		/**
		 * Gets the discount applied (percentage).
		 *
		 * @return float
		 */
		public function getDiscount() : float;


		/**
		 * Sets the discount applied (percentage) and returns it.
		 *
		 * @param float $discount
		 *
		 * @return float
		 */
		public function setDiscount(float $discount = NULL) : float;


		/**
		 * Gets the discounts applied (number of items that will be free) which depend on the quantity.
		 *
		 * @return DiscountsPerQuantity
		 */
		public function getDiscountsPerQuantity() : DiscountsPerQuantity;


		/**
		 * Sets the discounts applied which depend on the quantity and returns them.
		 *
		 * @param DiscountsPerQuantity $discountsPerQuantity
		 *
		 * @return DiscountsPerQuantity
		 */
		public function setDiscountsPerQuantity(DiscountsPerQuantity $discountsPerQuantity = NULL) : DiscountsPerQuantity;
		
		
		/**
		 * Compares the item with a given one.
		 *
		 * @param Item $item
		 *
		 * @return boolean
		 */
		public function equals(Item $item) : bool;

		
		/**
		 * Returns the item name (I think this method should probably use localized data from a database or elsewhere and depending on the given or current language).
		 *
		 * @return string
		 */
		public function getName(string $languageCode = "") : string;
	}