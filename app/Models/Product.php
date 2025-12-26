<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Jobs\SendLowStockNotification;

class Product extends Model
{
    use HasFactory;

    public const LOW_STOCK_THRESHOLD = 105;

    protected $fillable = [
        'name',
        'price',
        'stock_quantity',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    protected static function booted()
    {
        static::updated(function ($product) {
            if ($product->stock_quantity <= Product::LOW_STOCK_THRESHOLD && $product->wasChanged('stock_quantity')) {
                SendLowStockNotification::dispatch($product);
            }
        });
    }
}
