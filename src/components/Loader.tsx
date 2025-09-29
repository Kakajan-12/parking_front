import { cn } from "@/lib/utils";

const Loader = ({
    className,
    loaderClassName,
}: {
    className?: string;
    loaderClassName?: string;
}) => {
    return (
        <div className={cn("min-h-56 h-full w-full flex justify-center items-center", className)}>
            <div className={`loader ${loaderClassName}`} />
        </div>
    );
};

export default Loader;
