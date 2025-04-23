import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`absolute top-4 left-4 hover:bg-gray-100 ${className}`}
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
};

export default BackButton; 