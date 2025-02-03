const DotBackground = () => {
  return (
    <div className="absolute inset-0 bg-zinc-900 -z-10">
      <div className="absolute h-full w-full">
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />
      </div>
    </div>
  );
};

export default DotBackground; 