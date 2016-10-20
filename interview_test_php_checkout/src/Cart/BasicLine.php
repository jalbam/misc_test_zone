<?php
	namespace Checkout\Cart;

	use Checkout\Line;
	use Checkout\Item;
	use Checkout\Item\DiscountsPerQuantity;
	use \Exception;
	
	
	class BasicLine implements Line
	{
		/** @var int */
		public $_quantity;

		/** @var Item */
		public $_item;


		/**
		 * BasicLine constructor.
		 * 
		 * @param Item $item
		 * @param int $quantity
		 */
		public function __construct(Item $item, int $quantity)
		{
			$this->setItem($item);
			$this->setQuantity($quantity);
		}
		

		/**
		 * Gets the item.
		 *
		 * @return Item
		 */
		public function getItem() : Item
		{
			return $this->_item;
		}
		
		
		/**
		 * Sets the given item and returns it.
		 *
		 * @param int $quantity
		 *
		 * @return Item
		 */
		public function setItem(Item $item) : Item
		{
			return $this->_item = $item;
		}
		
		
		/**
		 * Gets the quantity.
		 *
		 * @return int
		 */
		public function getQuantity() : int
		{
			return $this->_quantity;
		}
		
		
		/**
		 * Sets the given quantity and returns it.
		 *
		 * @param int $quantity
		 *
		 * @return int
		 */
		public function setQuantity(int $quantity) : int
		{
			if ($quantity < 0) { throw new Exception('Quantity given is not valid (' . $quantity . '). It should be a number from zero (0) for items without stock or more for the others. '); }
			return $this->_quantity = $quantity >= 0 ? $quantity : 1; //Uses 1 by default.
		}
		
		
		/**
		 * Gets the price of this line (having in mind the discounts, quantities, etc.).
		 *
		 * @return float
		 */
		public function getPrice() : float
		{
			if ($this->_quantity == 0) { return 0; }
			
			//NOTE: we could add more kind of discounts in the future as percentage discounts based on quantity (now we use free units based on quantity), etc.
			
			//First, tries to return the price with the items which are free when a quantity limit is reached (if any):
			$discountsPerQuantity = $this->_item->getDiscountsPerQuantity();
			if ($discountsPerQuantity instanceof DiscountsPerQuantity)
			{
				$itemsFree = $discountsPerQuantity->getDiscountPerQuantity($this->_quantity);
				if ($itemsFree != 0)
				{
					$price = ($this->_quantity - $itemsFree) * $this->_item->getNormalPrice();
					return ($price < 0) ? 0 : $price;
				}
			}
			
			//Otherwise, returns the price (applying the percentage discount if any):
			return $this->_quantity * ($this->_item->getNormalPrice() * ((100 - $this->_item->getDiscount()) / 100));
		}
	}