import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, RefreshCw, Star } from 'lucide-react';

import { currencies, sampleRates } from '@/data/currencies';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ConversionHistory {
    id: string;
    from: string;
    to: string;
    amount: number;
    result: number;
    date: string;
}

const CurrencyConverter = () => {
    const [amount, setAmount] = useState<string>("1");
    const [fromCurrency, setFromCurrency] = useState<string>("USD");
    const [toCurrency, setToCurrency] = useState<string>("BRL");
    const [result, setResult] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [history, setHistory] = useState<ConversionHistory[]>(() => {
        const saved = localStorage.getItem('currency-conversion-history');
        return saved ? JSON.parse(saved) : [];
    });
    const [favoriteConversions, setFavoriteConversions] = useState<string[]>(() => {
        const saved = localStorage.getItem('favorite-conversions');
        return saved ? JSON.parse(saved) : [];
    });

    const { toast } = useToast();

    useEffect(() => {
        convertCurrency();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromCurrency, toCurrency]);

    useEffect(() => {
        localStorage.setItem('currency-conversion-history', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem('favorite-conversions', JSON.stringify(favoriteConversions));
    }, [favoriteConversions]);

    const fetchExchangeRates = async (baseCurrency: string) => {
        try {
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
            const data = await response.json();
            setExchangeRates(data.rates);
            setLastUpdated(new Date(data.date).toLocaleDateString('pt-BR'));
            return data.rates;
        } catch (error) {
            console.error('Erro ao buscar taxas de câmbio:', error);
            // Fallback para taxas simuladas em caso de erro na API
            const fallbackRates = sampleRates[baseCurrency] || {};
            setExchangeRates(fallbackRates);
            setLastUpdated(new Date().toLocaleDateString('pt-BR'));
            return fallbackRates;
        }
    };

    const convertCurrency = async () => {
        setLoading(true);

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setResult(null);
            setLoading(false);
            return;
        }

        try {
            if (fromCurrency === toCurrency) {
                setResult(numericAmount);
                setLoading(false);
                return;
            }

            let rates = exchangeRates;

            // Se não temos taxas ou a moeda base mudou, buscar novas taxas
            if (!rates || Object.keys(rates).length === 0) {
                rates = await fetchExchangeRates(fromCurrency);
            }

            const exchangeRate = rates[toCurrency];

            if (!exchangeRate) {
                toast({
                    title: "Taxa de câmbio não encontrada",
                    description: "Não foi possível encontrar a taxa de câmbio para esta conversão.",
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }

            const conversionResult = numericAmount * exchangeRate;
            setResult(conversionResult);

            const newEntry: ConversionHistory = {
                id: Date.now().toString(),
                from: fromCurrency,
                to: toCurrency,
                amount: numericAmount,
                result: conversionResult,
                date: new Date().toISOString(),
            };

            setHistory(prev => [newEntry, ...prev].slice(0, 10));

        } catch (error) {
            console.error('Erro na conversão:', error);
            toast({
                title: "Erro na conversão",
                description: "Ocorreu um erro ao converter as moedas. Tente novamente.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const handleAmountChange = (value: string) => {
        // Remove caracteres não numéricos exceto ponto decimal
        const cleanValue = value.replace(/[^0-9.]/g, '');

        // Permite apenas um ponto decimal
        const parts = cleanValue.split('.');
        const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleanValue;

        // Se o campo estiver vazio ou for apenas ponto, define como "1"
        if (formattedValue === '' || formattedValue === '.') {
            setAmount('1');
        } else if (formattedValue === '0' || formattedValue === '0.') {
            setAmount('1');
        } else {
            setAmount(formattedValue);
        }
    };

    const handleAmountBlur = () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setAmount('1');
        }
        convertCurrency();
    };

    const toggleFavorite = () => {
        const conversionKey = `${fromCurrency}-${toCurrency}`;
        if (favoriteConversions.includes(conversionKey)) {
            setFavoriteConversions(prev => prev.filter(key => key !== conversionKey));
        } else {
            setFavoriteConversions(prev => [...prev, conversionKey]);
        }
    };

    const useFavoriteConversion = (from: string, to: string) => {
        setFromCurrency(from);
        setToCurrency(to);
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getCurrentRate = () => {
        if (fromCurrency === toCurrency) return 1;
        return exchangeRates[toCurrency] || 0;
    };

    const isFavorite = favoriteConversions.includes(`${fromCurrency}-${toCurrency}`);

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            {/* Header Section */}
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Conversor de Moedas
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Converta valores entre diferentes moedas com taxas de câmbio atualizadas em tempo real
                </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">{currencies.length}</div>
                        <div className="text-sm text-muted-foreground">Moedas Disponíveis</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">{history.length}</div>
                        <div className="text-sm text-muted-foreground">Conversões Realizadas</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-2">{favoriteConversions.length}</div>
                        <div className="text-sm text-muted-foreground">Conversões Favoritas</div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Main Converter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl">Converter Moeda</CardTitle>
                                <CardDescription>
                                    Digite o valor e selecione as moedas para converter
                                </CardDescription>
                            </div>
                            <Button
                                variant={isFavorite ? "default" : "outline"}
                                size="icon"
                                onClick={toggleFavorite}
                                className={isFavorite ? "text-primary-foreground" : ""}
                            >
                                <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="amount" className="text-base font-medium">Valor</Label>
                                <Input
                                    id="amount"
                                    type="text"
                                    value={amount}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    onBlur={handleAmountBlur}
                                    className="text-xl h-12 mt-2"
                                    placeholder="1"
                                />
                            </div>

                            <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-4">
                                <div>
                                    <Label htmlFor="fromCurrency" className="text-base font-medium">De</Label>
                                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                                        <SelectTrigger id="fromCurrency" className="w-full h-12 mt-2">
                                            <SelectValue placeholder="Selecione uma moeda" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Moedas</SelectLabel>
                                                {currencies.map(currency => (
                                                    <SelectItem key={currency.code} value={currency.code}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{currency.flag}</span>
                                                            <span className="font-medium">{currency.code}</span>
                                                            <span className="text-muted-foreground text-sm">
                                                                {currency.name}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={swapCurrencies}
                                    className="mb-0.5 h-12 w-12"
                                >
                                    <ArrowUpDown size={20} />
                                </Button>

                                <div>
                                    <Label htmlFor="toCurrency" className="text-base font-medium">Para</Label>
                                    <Select value={toCurrency} onValueChange={setToCurrency}>
                                        <SelectTrigger id="toCurrency" className="w-full h-12 mt-2">
                                            <SelectValue placeholder="Selecione uma moeda" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Moedas</SelectLabel>
                                                {currencies.map(currency => (
                                                    <SelectItem key={currency.code} value={currency.code}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{currency.flag}</span>
                                                            <span className="font-medium">{currency.code}</span>
                                                            <span className="text-muted-foreground text-sm">
                                                                {currency.name}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={convertCurrency}
                            className="w-full h-12 text-base"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <RefreshCw size={18} className="mr-2 animate-spin" />
                                    Convertendo...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={18} className="mr-2" />
                                    Converter
                                </>
                            )}
                        </Button>
                    </CardContent>

                    {result !== null && (
                        <CardFooter className="flex-col border-t pt-6">
                            <div className="w-full text-center">
                                <div className="text-sm text-muted-foreground mb-2">Resultado</div>
                                <motion.div
                                    className="text-4xl font-bold mb-2"
                                    key={result}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {formatCurrency(result, toCurrency)}
                                </motion.div>
                                <div className="text-base text-muted-foreground">
                                    {amount} {fromCurrency} = {formatCurrency(result, toCurrency)}
                                </div>
                            </div>

                            <div className="w-full mt-6 p-4 rounded-lg border">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="font-medium">
                                        Taxa: 1 {fromCurrency} = {getCurrentRate().toFixed(4)} {toCurrency}
                                    </div>
                                    <div className="text-muted-foreground">
                                        Atualizado: {lastUpdated || new Date().toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                    )}
                </Card>
            </motion.div>

            {/* Favorites Section */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <h2 className="text-3xl font-bold mb-4">Conversões Favoritas</h2>
                {favoriteConversions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favoriteConversions.map(fav => {
                            const [from, to] = fav.split('-');
                            return (
                                <Card key={fav} className="cursor-pointer hover:shadow-md transition-shadow duration-300" onClick={() => useFavoriteConversion(from, to)}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-lg font-semibold">{from} para {to}</div>
                                            <Star size={20} fill="currentColor" className="text-yellow-500" />
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-2">Clique para converter</div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-muted-foreground">
                        Nenhuma conversão favorita adicionada. Marque uma conversão como favorita para vê-la aqui.
                    </div>
                )}
            </motion.div>

            {/* History Section */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <h2 className="text-3xl font-bold mb-4">Histórico de Conversões</h2>
                {history.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 text-left text-sm font-semibold uppercase tracking-wider">
                                    Data
                                </th>
                                <th className="px-5 py-3 border-b-2 text-left text-sm font-semibold uppercase tracking-wider">
                                    De
                                </th>
                                <th className="px-5 py-3 border-b-2 text-left text-sm font-semibold uppercase tracking-wider">
                                    Para
                                </th>
                                <th className="px-5 py-3 border-b-2 text-left text-sm font-semibold uppercase tracking-wider">
                                    Valor
                                </th>
                                <th className="px-5 py-3 border-b-2 text-left text-sm font-semibold uppercase tracking-wider">
                                    Resultado
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {history.map(entry => (
                                <tr key={entry.id}>
                                    <td className="px-5 py-5 border-b text-sm">
                                        {formatDate(entry.date)}
                                    </td>
                                    <td className="px-5 py-5 border-b text-sm">
                                        {entry.from}
                                    </td>
                                    <td className="px-5 py-5 border-b text-sm">
                                        {entry.to}
                                    </td>
                                    <td className="px-5 py-5 border-b text-sm">
                                        {entry.amount.toFixed(2)}
                                    </td>
                                    <td className="px-5 py-5 border-b text-sm">
                                        {formatCurrency(entry.result, entry.to)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-muted-foreground">
                        Nenhuma conversão realizada ainda. Converta moedas para ver o histórico aqui.
                    </div>
                )}
            </motion.div>

            {/* About Section */}
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-4">Sobre o Conversor</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Este conversor de moedas utiliza uma API de taxas de câmbio para fornecer informações atualizadas sobre as taxas de câmbio entre diferentes moedas.
                    Você pode converter valores de uma moeda para outra, adicionar conversões aos seus favoritos e ver um histórico das suas conversões recentes.
                </p>
            </motion.div>
        </div>
    );
};

export default CurrencyConverter;