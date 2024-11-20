"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Circle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <div className="flex min-h-screen bg-secondary-foreground items-center justify-center">
      <Card className="max-w-[500px] w-full">
        <CardHeader className="flex flex-row items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="relative">
            <Avatar className="h-16 w-16 ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900 transition-all duration-300 hover:scale-105">
              <AvatarImage src="/tov.png" alt="TOV IA Logo" />
              <AvatarFallback>TOV</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              TOV IA
            </CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground">
              Seu Chat Amigo Inteligente
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="px-2 py-1 transition-colors duration-200 ease-in-out hover:bg-green-100 dark:hover:bg-green-900 cursor-pointer"
                >
                  <Circle className="w-2 h-2 mr-2 fill-green-500 text-green-500 animate-pulse" />
                  Online
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="mb-2">
                <p>TOV IA está pronta para conversar!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent className="bg-accent">
          <ScrollArea className="h-[600px] w-full pr-4">
            {/* Renderizando as mensagens */}
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex mt-5 gap-3 text-slate-600 text-sm mb-3"
              >
                {/* Renderizando o avatar com base no papel do usuário */}
                {message.role === "user" && (
                  <Avatar>
                    <AvatarFallback>DF</AvatarFallback>
                    <AvatarImage src="https://github.com/Elnata1nt.png" />
                  </Avatar>
                )}

                {message.role === "assistant" && (
                  <Avatar>
                    <AvatarFallback>RS</AvatarFallback>
                    <AvatarImage src="https://github.com/rocketseat.png" />
                  </Avatar>
                )}

                {/* Exibindo o conteúdo da mensagem */}
                <p className="leading-relaxed">
                  <span className="block font-bold text-slate-700">
                    {message.role === "user" ? "Usuário" : "AI"}:
                  </span>
                  {message.content || "No content"}
                </p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="mt-5">
          <form className="w-full flex gap-2" onSubmit={handleSubmit}>
            {/* Input do usuário com validação para impedir envio vazio */}
            <Input
              placeholder="How can I help?"
              value={input}
              onChange={handleInputChange}
            />
            <Button type="submit" disabled={!input}>
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
