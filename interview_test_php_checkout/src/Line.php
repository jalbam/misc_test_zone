<?php
	namespace Checkout;

	
	interface Line
	{
		/**
		 * Gets the item.
		 *
		 * @return Item
		 */
		public function getItem() : Item;
		
		
		/**
		 * Sets the given item and returns it.
		 *
		 * @param Item $item
		 *
		 * @return Item
		 */
		public function setItem(Item $item) : Item;
		
		
		/**
		 * Gets the quantity.
		 *
		 * @return int
		 */
		public function getQuantity() : int;
		
		
		/**
		 * Sets the given quantity and returns it.
		 *
		 * @param int $quantity
		 *
		 * @return int
		 */
		public function setQuantity(int $quantity) : int;


		/**
		 * Gets the price of this line (having in mind the discounts, quantities, etc.).
		 *
		 * @return float
		 */
		public function getPrice() : float;
	}