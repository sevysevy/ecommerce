<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Mail\DailySalesReportMail;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Models\Order;
use Carbon\Carbon;

class SendDailySalesReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $start = Carbon::yesterday()->startOfDay(); 
        $end   = Carbon::yesterday()->endOfDay();   
        $date = Carbon::yesterday()->toDateString();

        $orders = Order::with('items')
            ->whereBetween('created_at', [$start, $end])
            ->get();

        $reportData = [];

        foreach ($orders as $order) {
            foreach ($order->items as $item) {
                if (!isset($reportData[$item->product_id])) {
                    $reportData[$item->product_id] = [
                        'name' => $item->name,
                        'quantity' => 0,
                        'total' => 0,
                    ];
                }

                $reportData[$item->product_id]['quantity'] += $item->quantity;
                $reportData[$item->product_id]['total'] += $item->quantity * (float)$item->unit_price;
            }
        }

        $reportData = array_values($reportData);

        Mail::to(config('shop.admin_email'))
            ->send(new DailySalesReportMail($reportData, $$date));
    }
}
