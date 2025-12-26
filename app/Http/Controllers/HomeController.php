<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [
            'products' => Product::all(),
            //'canRegister' => Features::enabled(Features::registration()),
        ]);

    }
}