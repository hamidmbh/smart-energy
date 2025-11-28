<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>{{ $title }}</title>
        <style>
            body { font-family: DejaVu Sans, sans-serif; color: #111827; }
            h1 { font-size: 24px; margin-bottom: 4px; }
            .meta { font-size: 12px; color: #374151; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 24px; }
            th, td { padding: 8px; border: 1px solid #e5e7eb; font-size: 12px; text-align: left; }
            th { background: #f3f4f6; text-transform: uppercase; letter-spacing: 0.05em; }
            ul { font-size: 12px; padding-left: 16px; }
        </style>
    </head>
    <body>
        <h1>{{ $title }}</h1>
        <div class="meta">
            Généré le {{ $generatedAt }} par {{ $generatedBy }}
        </div>

        <h2>Filtres appliqués</h2>
        @if(empty($filters))
            <p style="font-size: 12px;">Aucun filtre fourni.</p>
        @else
            <ul>
                @foreach($filters as $key => $value)
                    <li><strong>{{ \Illuminate\Support\Str::headline($key) }}:</strong> {{ is_array($value) ? json_encode($value) : $value }}</li>
                @endforeach
            </ul>
        @endif

        <p style="font-size: 12px; margin-top: 24px;">
            Ce rapport est généré automatiquement par Smart Energy Hotel Manager API V1.
        </p>
    </body>
</html>

