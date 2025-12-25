import { Search, Filter, BookOpen, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const regulations = [
  {
    id: 1,
    title: "Air Quality Act 34/2007",
    category: "Emissions",
    jurisdiction: "National",
    lastUpdate: "2024-01-15",
  },
  {
    id: 2,
    title: "Industrial Emissions Royal Decree 815/2013",
    category: "Industrial",
    jurisdiction: "National",
    lastUpdate: "2023-11-20",
  },
  {
    id: 3,
    title: "EU Directive 2010/75/EU on Industrial Emissions",
    category: "Industrial",
    jurisdiction: "European",
    lastUpdate: "2024-02-01",
  },
  {
    id: 4,
    title: "Waste and Contaminated Soil Act 22/2011",
    category: "Waste",
    jurisdiction: "National",
    lastUpdate: "2023-12-10",
  },
  {
    id: 5,
    title: "Contaminated Soil Royal Decree 9/2005",
    category: "Soil",
    jurisdiction: "National",
    lastUpdate: "2023-09-05",
  },
];

const categoryColors: Record<string, string> = {
  Emissions: "bg-accent text-accent-foreground",
  Industrial: "bg-secondary text-secondary-foreground",
  Waste: "bg-warning-light text-warning-foreground",
  Soil: "bg-success-light text-success",
};

export default function RegulationsLibrary() {
  return (
    <div className="p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Regulations Library
        </h1>
        <p className="text-muted-foreground mt-1">
          Updated database of applicable environmental regulations
        </p>
      </header>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search regulations..."
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Regulations Grid */}
      <div className="grid gap-4">
        {regulations.map((reg, index) => (
          <div
            key={reg.id}
            className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer group animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary group-hover:bg-accent transition-colors">
              <BookOpen className="h-6 w-6 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {reg.title}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="secondary" className={categoryColors[reg.category]}>
                  {reg.category}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {reg.jurisdiction}
                </span>
                <span className="text-sm text-muted-foreground">
                  Updated: {new Date(reg.lastUpdate).toLocaleDateString('en-US')}
                </span>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}