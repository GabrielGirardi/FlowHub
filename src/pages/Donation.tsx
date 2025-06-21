import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { mimic } from "@/lib/mimic";
import { motion } from "framer-motion";
import { Check, Coffee, Copy, Heart, Share2 } from "lucide-react";
import { useState } from "react";

const Donation = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const pixKey = "dev.ggirardi@gmail.com";

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast({
      title: "Chave PIX copiada!",
      description: "A chave PIX foi copiada para sua área de transferência.",
    });

    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Faça uma doação para o FlowHub",
          text: `Gostou do FlowHub? Considere fazer uma doação via PIX: ${pixKey}`,
          url: window.location.href,
        });
        toast({
          title: "Link compartilhado!",
          description: "Obrigado por compartilhar o projeto.",
        });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    } else {
      toast({
        title: "Compartilhamento não suportado",
        description: "Seu navegador não suporta a Web Share API.",
      });
    }
  };

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-block relative mb-6"
          whileHover={{
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.5 },
          }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-full blur-md opacity-75"></div>
          <div className="relative flex items-center justify-center bg-background rounded-full p-6 border border-border shadow-md">
            <Coffee size={48} className="text-primary" />
          </div>
        </motion.div>

        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Apoie o FlowHub
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Se este projeto ajudou você de alguma forma, considere fazer uma
          doação para apoiar o desenvolvimento contínuo.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="h-full border-border shadow-md overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <Heart className="text-primary h-5 w-5" />
                Faça uma doação via PIX
              </CardTitle>
              <CardDescription>
                Escaneie o QR code ou copie a chave PIX abaixo
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="relative mb-6 p-3 bg-white rounded-lg border border-border">
                <img
                  src="/pix.jpeg"
                  alt="QR Code PIX"
                  className="w-56 h-56 object-contain"
                />
              </div>

              <div className="w-full bg-card/50 border border-border rounded-md p-3 flex items-center justify-between">
                <span className="font-mono text-sm text-muted-foreground truncate mr-2">
                  {pixKey}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={handleCopyPix}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border bg-card/50">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="h-full border-border shadow-md">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <Coffee className="text-primary h-5 w-5" />
                Por que apoiar?
              </CardTitle>
              <CardDescription>Seu apoio faz toda a diferença</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {mimic.pages.donation.features.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <div className="p-1.5 rounded-full bg-primary/10 text-primary mt-0.5">
                      <Heart className="h-3 w-3" />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border bg-card/50">
              <p className="text-sm text-muted-foreground text-center italic">
                "Obrigado pelo seu apoio! Cada contribuição é importante para
                manter este projeto vivo."
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <motion.div
        className="mt-12 p-8 border border-border rounded-xl bg-card/50 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl blur-sm opacity-50"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-3">
            Muito obrigado pelo seu apoio!
          </h2>
          <p className="text-muted-foreground mb-0">
            Seu apoio significa muito e ajuda a manter este projeto em constante
            evolução.
          </p>
          <p className="text-muted-foreground mt-2">
            Desenvolvido com ❤️ por{" "}
            <a
              href="https://dev-gg.vercel.app/"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gabriel Girardi
            </a>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Donation;
