import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export const LoadingSpinner = ({ className, title }: { className?: string, title?:string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 w-full min-h-[200px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      >
        <Loader2 className={cn("h-8 w-8 text-primary/60", className)} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-sm text-muted-foreground animate-pulse"
      >
        {title?title:'Loading LawVault...'}
      </motion.p>
    </div>
  );
};