const Loader = ({className, loaderClassName}: { className?: string, loaderClassName?: string; }) => {
    return (
        <div className={`min-h-56 h-full w-full flex justify-center items-center ${className}`}>
            <div className={`loader ${loaderClassName}`}/>
        </div>
    )
}

export default Loader;