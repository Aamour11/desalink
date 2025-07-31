import { BrainCircuit } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  generateDashboard,
  type GenerateDashboardInput,
} from "@/ai/flows/generate-dashboard";

export async function AISummary(props: GenerateDashboardInput) {
  const { summary, visualizations } = await generateDashboard(props);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Ringkasan AI</CardTitle>
        </div>
        <CardDescription>
          Analisis dan rekomendasi visualisasi otomatis berdasarkan data UMKM.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold font-headline mb-2">Analisis Statistik</h3>
          <p className="text-muted-foreground whitespace-pre-line">{summary}</p>
        </div>
        <div>
          <h3 className="font-semibold font-headline mb-2">Rekomendasi Visualisasi</h3>
          <p className="text-muted-foreground whitespace-pre-line">{visualizations}</p>
        </div>
      </CardContent>
    </Card>
  );
}
