const Carousel = () => {
    return (
      <div className="relative h-[400px] bg-[var(--color-surface)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-[var(--color-text)]">Carousel Placeholder</h2>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[1, 2, 3, 4].map((_, i) => (
            <button
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === 0 ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default Carousel;
  