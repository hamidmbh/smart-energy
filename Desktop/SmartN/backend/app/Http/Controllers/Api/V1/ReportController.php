<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReportController extends Controller
{
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'max:100'],
            'title' => ['nullable', 'string', 'max:150'],
            'parameters' => ['array'],
        ]);

        $report = Report::create([
            'type' => $validated['type'],
            'parameters' => $validated['parameters'] ?? [],
            'status' => 'pending',
            'generated_by' => $request->user()?->id,
        ]);

        $pdf = Pdf::loadView('reports.generic', [
            'title' => $validated['title'] ?? Str::headline($validated['type']).' Report',
            'generatedAt' => now()->toDayDateTimeString(),
            'generatedBy' => $request->user()?->name ?? 'System',
            'filters' => $validated['parameters'] ?? [],
        ])->setPaper('a4');

        $fileName = "reports/{$report->id}-{$report->type}.pdf";
        $pdfOutput = $pdf->output();
        Storage::disk('local')->put($fileName, $pdfOutput);

        $report->update([
            'status' => 'generated',
            'file_path' => $fileName,
        ]);

        return response()->streamDownload(
            callback: static fn () => print($pdfOutput),
            name: "{$report->type}-report.pdf",
            headers: ['Content-Type' => 'application/pdf']
        );
    }
}
