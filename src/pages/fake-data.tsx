import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Clipboard, RefreshCw } from "lucide-react";
import { faker } from "@faker-js/faker";

type DataType =
    | "name"
    | "email"
    | "phone"
    | "address"
    | "company"
    | "job"
    | "creditCard"
    | "product"
    | "image"
    | "uuid"
    | "date";

type GeneratedData = Record<string, string | number>;

const FakeData = () => {
    const [dataTypes, setDataTypes] = useState<string[]>(["name", "email"]);
    const [quantity, setQuantity] = useState(10);
    const [format, setFormat] = useState<"json" | "csv">("json");
    const [generatedData, setGeneratedData] = useState<GeneratedData[]>([]);
    const [currentType, setCurrentType] = useState<DataType>("name");

    const { toast } = useToast();

    const dataTypeOptions = [
        { value: "name", label: "Nome", icon: "👤" },
        { value: "email", label: "Email", icon: "📧" },
        { value: "phone", label: "Telefone", icon: "📱" },
        { value: "address", label: "Endereço", icon: "🏠" },
        { value: "company", label: "Empresa", icon: "🏢" },
        { value: "job", label: "Profissão", icon: "💼" },
        { value: "creditCard", label: "Cartão de Crédito", icon: "💳" },
        { value: "product", label: "Produto", icon: "📦" },
        { value: "image", label: "URL de Imagem", icon: "🖼️" },
        { value: "uuid", label: "UUID", icon: "🔑" },
        { value: "date", label: "Data", icon: "📅" },
    ];

    const addDataType = () => {
        if (!currentType || dataTypes.includes(currentType)) return;
        setDataTypes([...dataTypes, currentType]);
    };

    const removeDataType = (type: string) => {
        setDataTypes(dataTypes.filter(t => t !== type));
    };

    const generateFakeData = () => {
        const data = Array.from({ length: quantity }, () => {
            const item: GeneratedData = {};

            dataTypes.forEach(type => {
                switch (type) {
                    case "name":
                        item.name = faker.person.fullName();
                        break;
                    case "email":
                        item.email = faker.internet.email();
                        break;
                    case "phone":
                        item.phone = faker.phone.number();
                        break;
                    case "address":
                        item.address = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`;
                        break;
                    case "company":
                        item.company = faker.company.name();
                        break;
                    case "job":
                        item.job = faker.person.jobTitle();
                        break;
                    case "creditCard":
                        item.creditCard = faker.finance.creditCardNumber();
                        break;
                    case "product":
                        item.product = faker.commerce.productName();
                        item.price = faker.commerce.price();
                        break;
                    case "image":
                        item.image = faker.image.url();
                        break;
                    case "uuid":
                        item.uuid = faker.string.uuid();
                        break;
                    case "date":
                        item.date = faker.date.recent().toISOString().split('T')[0];
                        break;
                }
            });

            return item;
        });

        setGeneratedData(data);
    };

    const formatDataToString = (): string => {
        if (format === "json") {
            return JSON.stringify(generatedData, null, 2);
        } else {
            if (generatedData.length === 0) return "";

            const headers = Object.keys(generatedData[0]);
            let csv = headers.join(",") + "\n";

            generatedData.forEach(item => {
                const row = headers.map(header => {
                    const value = item[header];
                    return typeof value === "string" && value.includes(",")
                        ? `"${value}"`
                        : value;
                });
                csv += row.join(",") + "\n";
            });

            return csv;
        }
    };

    const copyToClipboard = () => {
        const formattedData = formatDataToString();
        navigator.clipboard.writeText(formattedData);

        toast({
            title: "Copiado para a área de transferência",
            description: "Dados copiados com sucesso!",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header with gradient background */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl mb-6 shadow-lg">
                        <span className="text-2xl">🎲</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
                        Gerador de Dados Falsos
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Crie dados realistas para seus projetos de desenvolvimento e testes
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <Card className="xl:col-span-2 border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-6">
                            <CardTitle className="text-xl flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                                    ⚙️
                                </div>
                                Configure seus dados
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <Label className="text-base font-medium">Tipos de dados selecionados</Label>
                                <div className="flex flex-wrap gap-3 min-h-[3rem] p-4 bg-muted/30 rounded-xl border-2 border-dashed border-muted">
                                    {dataTypes.length > 0 ? (
                                        dataTypes.map(type => {
                                            const option = dataTypeOptions.find(opt => opt.value === type);
                                            return (
                                                <div
                                                    key={type}
                                                    className="group bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all hover:scale-105 hover:shadow-md"
                                                >
                                                    <span>{option?.icon}</span>
                                                    <span className="font-medium">{option?.label}</span>
                                                    <button
                                                        onClick={() => removeDataType(type)}
                                                        className="ml-1 w-5 h-5 bg-primary/20 hover:bg-destructive/20 hover:text-destructive rounded-full flex items-center justify-center transition-colors text-xs"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-muted-foreground text-sm italic">
                                            Nenhum tipo de dado selecionado
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <Select value={currentType} onValueChange={value => setCurrentType(value as DataType)}>
                                        <SelectTrigger className="flex-1 h-12 border-2 hover:border-primary/50 transition-colors">
                                            <SelectValue placeholder="Selecione um tipo de dado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dataTypeOptions.map(option => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                    disabled={dataTypes.includes(option.value)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span>{option.icon}</span>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={addDataType}
                                        disabled={dataTypes.includes(currentType)}
                                        className="h-12 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg hover:shadow-xl"
                                    >
                                        Adicionar
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="quantity" className="text-base font-medium">Quantidade de registros</Label>
                                <div className="relative">
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        className="h-12 text-lg border-2 hover:border-primary/50 transition-colors pr-16"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        máx. 100
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-base font-medium">Formato de saída</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant={format === "json" ? "default" : "outline"}
                                        className={`h-12 text-base transition-all ${
                                            format === "json"
                                                ? "bg-gradient-to-r from-primary to-primary/80 shadow-lg"
                                                : "hover:bg-accent hover:scale-105"
                                        }`}
                                        onClick={() => setFormat("json")}
                                    >
                                        📄 JSON
                                    </Button>
                                    <Button
                                        variant={format === "csv" ? "default" : "outline"}
                                        className={`h-12 text-base transition-all ${
                                            format === "csv"
                                                ? "bg-gradient-to-r from-primary to-primary/80 shadow-lg"
                                                : "hover:bg-accent hover:scale-105"
                                        }`}
                                        onClick={() => setFormat("csv")}
                                    >
                                        📊 CSV
                                    </Button>
                                </div>
                            </div>

                            {/* Generate Button */}
                            <Button
                                onClick={generateFakeData}
                                disabled={dataTypes.length === 0}
                                className="w-full h-14 text-lg bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <RefreshCw className="mr-3 h-5 w-5" />
                                Gerar Dados Falsos
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="xl:row-span-2 border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-6">
                            <CardTitle className="text-xl flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg flex items-center justify-center">
                                    👁️
                                </div>
                                Amostra dos Dados
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border-l-4 border-primary/50">
                                💡 Visualize como cada tipo de dado será gerado
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {dataTypeOptions.map(type => (
                                    <div key={type.value} className="group p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border hover:border-primary/30 transition-all hover:shadow-md">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg">{type.icon}</span>
                                            <div className="text-sm font-medium text-foreground">{type.label}</div>
                                        </div>
                                        <div className="bg-background/50 p-3 rounded-lg text-sm font-mono text-muted-foreground">
                                            {(() => {
                                                switch (type.value) {
                                                    case "name": return faker.person.fullName();
                                                    case "email": return faker.internet.email();
                                                    case "phone": return faker.phone.number();
                                                    case "address": return `${faker.location.streetAddress()}, ${faker.location.city()}`;
                                                    case "company": return faker.company.name();
                                                    case "job": return faker.person.jobTitle();
                                                    case "creditCard": return faker.finance.creditCardNumber();
                                                    case "product": return `${faker.commerce.productName()} - R$${faker.commerce.price()}`;
                                                    case "image": return faker.image.url();
                                                    case "uuid": return faker.string.uuid();
                                                    case "date": return faker.date.recent().toISOString().split('T')[0];
                                                    default: return "";
                                                }
                                            })()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="xl:col-span-2 border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-6">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-lg flex items-center justify-center">
                                        ✨
                                    </div>
                                    Dados Gerados
                                    {generatedData.length > 0 && (
                                        <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                                            {generatedData.length} registros
                                        </span>
                                    )}
                                </CardTitle>
                                {generatedData.length > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={copyToClipboard}
                                        className="border-2 hover:bg-primary/10 hover:border-primary/50 transition-all hover:scale-105 shadow-lg"
                                    >
                                        <Clipboard className="h-4 w-4 mr-2" />
                                        Copiar
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {generatedData.length > 0 ? (
                                <Tabs defaultValue="preview" className="w-full">
                                    <TabsList className="mb-6 bg-muted/50 p-1 h-12">
                                        <TabsTrigger value="preview" className="h-10 px-6 data-[state=active]:bg-background data-[state=active]:shadow-md">
                                            📋 Preview
                                        </TabsTrigger>
                                        <TabsTrigger value="raw" className="h-10 px-6 data-[state=active]:bg-background data-[state=active]:shadow-md">
                                            🔍 Raw Data
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="preview" className="space-y-4">
                                        <div className="border-2 border-muted rounded-xl overflow-hidden shadow-lg">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead className="bg-gradient-to-r from-muted to-muted/70">
                                                    <tr>
                                                        {Object.keys(generatedData[0]).map(key => (
                                                            <th key={key} className="p-4 text-left text-xs uppercase font-bold tracking-wider text-muted-foreground">
                                                                {key}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-muted/50">
                                                    {generatedData.slice(0, 5).map((item, index) => (
                                                        <tr key={index} className="hover:bg-muted/20 transition-colors">
                                                            {Object.keys(item).map(key => (
                                                                <td key={`${index}-${key}`} className="p-4 text-sm">
                                                                    <div className="max-w-[200px] truncate">
                                                                        {String(item[key])}
                                                                    </div>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {generatedData.length > 5 && (
                                                <div className="p-4 text-center text-sm text-muted-foreground bg-gradient-to-r from-muted/30 to-muted/10 border-t">
                                                    📊 Mostrando 5 de {generatedData.length} registros
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="raw">
                                        <div className="bg-gradient-to-br from-muted/50 to-muted/30 p-6 rounded-xl border-2 border-muted">
                                            <pre className="text-xs overflow-auto max-h-96 font-mono text-muted-foreground leading-relaxed">
                                                {formatDataToString()}
                                            </pre>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            ) : (
                                <div className="py-16 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full mb-6">
                                        <span className="text-2xl">📝</span>
                                    </div>
                                    <h3 className="text-lg font-medium text-foreground mb-2">
                                        Pronto para gerar dados!
                                    </h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        Configure os tipos de dados e a quantidade, depois clique em "Gerar Dados Falsos" para ver os resultados aqui.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FakeData;