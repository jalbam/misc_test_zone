<?php

namespace Checkout\Cart;

use Checkout\Item;

class Line
{
    /** @var  \int */
    public $quantity;

    /** @var  Item */
    public $item;
}