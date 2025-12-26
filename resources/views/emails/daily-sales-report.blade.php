<h2>Daily Sales Report for {{ $date }}</h2>

@if(count($reportData) === 0)
    <p>No products were sold today.</p>
@else
    <table border="1" cellpadding="5" cellspacing="0">
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Total Revenue (€)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reportData as $item)
                <tr>
                    <td>{{ $item['name'] }}</td>
                    <td>{{ $item['quantity'] }}</td>
                    <td>{{ number_format($item['total'], 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endif
