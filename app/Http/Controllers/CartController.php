<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{

    protected function getUserCart(): Cart
    {
        return auth()->user()->cart()->firstOrCreate();
    }

    public function index()
    {
        $cart = $this->getUserCart()->load('items.product');

        return Inertia::render('Cart/Index', [
            'cart' => $cart,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $cart = $this->getUserCart();
        $product = Product::findOrFail($request->product_id);

        $service = new CartService($cart);
        $service->addProduct($product, $request->quantity ?? 1);

        return redirect()->back()->with('success', 'Product added to cart!');
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getUserCart();
        $service = new CartService($cart);
        $service->updateProductQuantity($product, $request->quantity);

        return redirect()->back()->with('success', 'Cart updated!');
    }

    public function destroy(Product $product)
    {
        $cart = $this->getUserCart();
        $service = new CartService($cart);
        $service->removeProduct($product);

        return redirect()->back()->with('success', 'Product removed from cart.');
    }
}
