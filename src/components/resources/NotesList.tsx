
import React, { useState } from 'react';
import NoteCard from './NoteCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface NotesListProps {
  notes: Array<{
    id: string;
    title: string;
    subject: string;
    user_email: string;
    created_at: string;
    upvotes: number;
  }>;
  subjects?: string[];
  onUpvote?: (id: string) => void;
  isLoading?: boolean;
}

const NotesList = ({ notes, subjects = [], onUpvote, isLoading = false }: NotesListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject ? note.subject === selectedSubject : true;
    return matchesSearch && matchesSubject;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-64"></div>
          <div className="h-40 bg-gray-200 rounded w-80"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {subjects.length > 0 && (
          <div className="w-full md:w-64 flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} onUpvote={onUpvote} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No notes found matching your criteria.</p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setSelectedSubject('');
            }}
            variant="link"
            className="mt-2"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotesList;
