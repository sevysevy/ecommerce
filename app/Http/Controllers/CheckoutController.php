<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    public function store()
    {
        $user = auth()->user();
        $cart = $user->cart()->with('items.product')->firstOrFail();

        if ($cart->items->isEmpty()) {
            return back()->withErrors(['cart' => 'Your cart is empty.']);
        }

        try {
            DB::transaction(function () use ($cart, $user) {

                $productIds = $cart->items->pluck('product_id')->toArray();
                

                $lockedProducts = Product::whereIn('id', $productIds)
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('id');
                
                foreach ($cart->items as $item) {
                    $product = $lockedProducts[$item->product_id];
                    
                    if ($item->quantity > $product->stock_quantity) {
                        throw ValidationException::withMessages([
                            'stock' => "Not enough stock for {$product->name}."
                        ]);
                    }
                }
                
                $order = Order::create([
                    'user_id' => $user->id,
                    'total_amount' => $cart->total()
                ]);
                
                foreach ($cart->items as $item) {
                    $order->items()->create([
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'name' => $item->product->name,
                    ]);
                    
                    $product = $lockedProducts[$item->product_id];
                    $product->decrement('stock_quantity', $item->quantity);

                }
                
                $cart->items()->delete();
                
                session(['last_order_id' => $order->id]);
            });
            
            return redirect()->route('checkout.success')->with('success', 'Order placed successfully!');
                
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }


    public function success()
    {
        $orderId = session('last_order_id');
        
        if (!$orderId) {
            return redirect()->route('home');
        }

        $order = Order::with('items.product')->findOrFail($orderId);
        
        session()->forget('last_order_id');

        return Inertia::render('Checkout/Success', [
            'order' => $order,
        ]);
    }
}
