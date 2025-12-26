<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::insert([
            [
                'name' => 'Laptop',
                'price' => 1200.00,
                'stock_quantity' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Headphones',
                'price' => 150.00,
                'stock_quantity' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mouse',
                'price' => 40.00,
                'stock_quantity' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

