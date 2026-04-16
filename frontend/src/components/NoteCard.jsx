import { Pencil, Trash2 } from 'lucide-react';

export default function NoteCard({ note, onEdit, onDelete }) {
  const date = new Date(note.createdAt).toLocaleDateString();

  return (
    <div className="bg-white rounded-lg shadow p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={note.title}>
          {note.title}
        </h3>
        <p className="text-gray-600 line-clamp-4 whitespace-pre-wrap">
          {note.content}
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400">{date}</span>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(note)}
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={() => onDelete(note._id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
