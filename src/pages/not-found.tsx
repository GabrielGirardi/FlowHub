import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                <div className="absolute -inset-5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur-xl opacity-50"></div>
                <h1 className="text-8xl font-bold text-primary relative mb-4">404</h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="flex items-center justify-center gap-2 mb-6">
                    <AlertCircle className="text-primary" />
                    <p className="text-2xl font-medium">Oops! Esta página não existe</p>
                </div>

                <p className="text-muted-foreground max-w-md mb-8">
                    A página que você está procurando pode ter sido removida, renomeada ou está temporariamente indisponível.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/20 rounded-md blur-md opacity-50"></div>
                <Button
                    asChild
                    size="lg"
                    className="relative hover:scale-105 transition-all duration-300 shadow-md"
                >
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Voltar para o início
                    </Link>
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-12"
            >
                <p className="text-sm text-muted-foreground/70">
                    Caminho: {location.pathname}
                </p>
            </motion.div>
        </div>
    );
};

export default NotFound;