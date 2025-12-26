<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;


class CartService
{
    protected Cart $cart;

    public function __construct(Cart $cart)
    {
        $this->cart = $cart;
    }

    /**
     * Add a product to the cart.
     */
    public function addProduct(Product $product, int $quantity = 1): CartItem
    {


        if ($quantity < 1) {
            $quantity = 1;
        }

        $cartItem = $this->cart->items()->firstOrNew(['product_id' => $product->id]);

        $currentQuantity = $cartItem->quantity ?? 0;
        $newQuantity = $currentQuantity + $quantity;

        if ($newQuantity > $product->stock_quantity) {
            throw ValidationException::withMessages([
                'quantity' => 'Requested quantity exceeds available stock.',
            ]);
        }

        $cartItem->quantity = $newQuantity;
        $cartItem->unit_price = $product->price;
        $cartItem->save();

        return $cartItem;
    }

    /**
     * Update the quantity of a cart item
     */
    public function updateProductQuantity(Product $product, int $quantity): CartItem
    {
        $cartItem = $this->cart->items()
            ->where('product_id', $product->id)
            ->first();

        if (!$cartItem) {
            throw new ModelNotFoundException("Product not in cart");
        }

        if ($quantity > $product->stock_quantity) {
            throw new \Exception("Not enough stock for product {$product->name}");
        }

        if ($quantity < 1) {
            $cartItem->delete();
        } else {
            $cartItem->quantity = $quantity;
            $cartItem->unit_price = $product->price;
            $cartItem->save();
        }

        return $cartItem;
    }

    /**
     * Remove a product from the cart
     */
    public function removeProduct(Product $product): void
    {
        $cartItem = $this->cart->items()
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $cartItem->delete();
        }
    }

    /**
     * Get cart total
     */
    public function total(): float
    {
        return $this->cart->items->sum(fn($item) => $item->quantity * $item->unit_price);
    }
}
