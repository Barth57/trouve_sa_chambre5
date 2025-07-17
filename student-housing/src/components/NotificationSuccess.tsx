import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationSuccessProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export default function NotificationSuccess({ message, visible, onClose }: NotificationSuccessProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Attendre la fin de l'animation
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible && !show) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    }`}>
      <Card className="bg-green-50 border-green-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">{message}</p>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => {
                setShow(false);
                setTimeout(onClose, 300);
              }}
              className="ml-2 h-6 w-6 p-0 text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}