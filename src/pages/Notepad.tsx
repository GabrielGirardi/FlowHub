import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Calendar,
  Edit3,
  FileText,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const Notepad = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem("notepad-notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("notepad-notes", JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Nova Nota",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!selectedNote) return;

    const updatedNotes = notes.map((note) => {
      if (note.id === selectedNote.id) {
        return {
          ...note,
          title: editTitle.trim() || "Sem título",
          content: editContent,
          updatedAt: new Date().toISOString(),
        };
      }
      return note;
    });

    setNotes(updatedNotes);
    setSelectedNote(
      updatedNotes.find((note) => note.id === selectedNote.id) || null
    );
    setIsEditing(false);

    toast({
      title: "Nota salva",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);

    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }

    toast({
      title: "Nota removida",
      description: "A nota foi excluída com sucesso.",
    });
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Bloco de Notas
        </h1>
        <p className="text-muted-foreground">
          Capture suas ideias e organize seus pensamentos
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardTitle className="flex items-center justify-between text-purple-700 dark:text-purple-300">
              <span className="flex items-center">
                <BookOpen className="mr-2" size={20} />
                Suas Notas
              </span>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
              >
                {notes.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar notas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-purple-200 focus:border-purple-400"
                  />
                </div>
                <Button
                  onClick={createNewNote}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus size={18} />
                </Button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText
                      size={48}
                      className="mx-auto text-purple-300 mb-4"
                    />
                    <p className="text-muted-foreground">
                      {searchTerm
                        ? "Nenhuma nota encontrada"
                        : "Nenhuma nota criada ainda"}
                    </p>
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedNote?.id === note.id
                          ? "border-purple-300 bg-purple-50 dark:bg-purple-950/20"
                          : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/50 dark:hover:bg-purple-950/10"
                      }`}
                      onClick={() => selectNote(note)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium truncate text-sm">
                          {note.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {note.content || "Nota vazia"}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar size={10} className="mr-1" />
                        {formatDate(note.updatedAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-pink-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
            <CardTitle className="flex items-center justify-between text-pink-700 dark:text-pink-300">
              <span className="flex items-center">
                <Edit3 className="mr-2" size={20} />
                {selectedNote
                  ? isEditing
                    ? "Editando Nota"
                    : "Visualizando Nota"
                  : "Selecione uma Nota"}
              </span>
              {selectedNote && (
                <div className="flex space-x-2">
                  {isEditing ? (
                    <Button
                      onClick={saveNote}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      <Save size={16} className="mr-2" />
                      Salvar
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      size="sm"
                      variant="outline"
                      className="border-pink-300 text-pink-600 hover:bg-pink-50"
                    >
                      <Edit3 size={16} className="mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {selectedNote ? (
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Título da nota..."
                      className="text-lg font-medium border-pink-200 focus:border-pink-400"
                    />
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Escreva sua nota aqui..."
                      className="min-h-96 resize-none border-pink-200 focus:border-pink-400"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-pink-700 dark:text-pink-300">
                      {selectedNote.title}
                    </h2>
                    <div className="text-sm text-muted-foreground mb-4">
                      Criado em: {formatDate(selectedNote.createdAt)} |
                      Atualizado em: {formatDate(selectedNote.updatedAt)}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-96">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {selectedNote.content ||
                          'Esta nota está vazia. Clique em "Editar" para adicionar conteúdo.'}
                      </pre>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-20">
                <FileText size={64} className="mx-auto text-pink-300 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Nenhuma nota selecionada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Selecione uma nota da lista ou crie uma nova para começar a
                  escrever.
                </p>
                <Button
                  onClick={createNewNote}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus size={16} className="mr-2" />
                  Criar Nova Nota
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notepad;
