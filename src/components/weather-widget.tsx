
import { useState, useEffect } from 'react';
import { CloudSun } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface WeatherData {
    temperature: number;
    weathercode: number;
    location: string;
}

const getWeatherDescription = (weathercode: number): string => {
    const descriptions: { [key: number]: string } = {
        0: 'Céu limpo',
        1: 'Predominantemente limpo',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Neblina',
        48: 'Neblina com geada',
        51: 'Garoa leve',
        53: 'Garoa moderada',
        55: 'Garoa intensa',
        61: 'Chuva leve',
        63: 'Chuva moderada',
        65: 'Chuva intensa',
        71: 'Neve leve',
        73: 'Neve moderada',
        75: 'Neve intensa',
        80: 'Chuva leve',
        81: 'Chuva moderada',
        82: 'Chuva violenta',
        95: 'Tempestade',
        96: 'Tempestade com granizo',
        99: 'Tempestade com granizo pesado'
    };
    return descriptions[weathercode] || 'Desconhecido';
};

export function WeatherWidget({ collapsed }: { collapsed: boolean }) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getWeather = async () => {
            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                const { latitude, longitude } = position.coords;

                const weatherResponse = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
                );

                if (!weatherResponse.ok) throw new Error('Erro ao buscar clima');

                const weatherData = await weatherResponse.json();

                const locationResponse = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
                );

                let locationName = 'Localização atual';
                if (locationResponse.ok) {
                    const locationData = await locationResponse.json();
                    locationName = locationData.address?.city || locationData.address?.town || locationData.address?.village || 'Localização atual';
                }

                setWeather({
                    temperature: Math.round(weatherData.current_weather.temperature),
                    weathercode: weatherData.current_weather.weathercode,
                    location: locationName
                });
            } catch (err) {
                setError('Não foi possível obter o clima');
                console.error('Erro ao buscar clima:', err);
            } finally {
                setLoading(false);
            }
        };

        getWeather();
    }, []);

    if (loading || error || !weather) {
        return null;
    }

    if (collapsed) {
        return (
            <div className="flex flex-col items-center p-2 text-center">
                <CloudSun size={16} className="text-primary mb-1" />
                <span className="text-xs font-medium">{weather.temperature}°</span>
            </div>
        );
    }

    return (
        <Card className="bg-sidebar-accent/30 border-sidebar-border">
            <CardContent className="p-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">{weather.location}</p>
                        <p className="text-xs text-muted-foreground">
                            {getWeatherDescription(weather.weathercode)}
                        </p>
                    </div>
                    <div className="flex items-center">
                        <CloudSun size={20} className="text-primary mr-2" />
                        <span className="text-lg font-bold">{weather.temperature}°C</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}