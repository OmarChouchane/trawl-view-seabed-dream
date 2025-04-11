
const WaterEffect = () => {
  return (
    <div className="absolute inset-0 z-0">
      {/* Water texture overlay */}
      <div className="absolute inset-0 opacity-20 animate-water-movement">
        <svg width="2000" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="water-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
              <path 
                d="M0,50 Q25,40 50,50 T100,50 T150,50 T200,50" 
                fill="none" 
                stroke="#ffffff" 
                strokeWidth="1"
              />
              <path 
                d="M0,70 Q25,60 50,70 T100,70 T150,70 T200,70" 
                fill="none" 
                stroke="#ffffff" 
                strokeWidth="0.5"
              />
              <path 
                d="M0,30 Q25,20 50,30 T100,30 T150,30 T200,30" 
                fill="none" 
                stroke="#ffffff" 
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#water-pattern)" />
        </svg>
      </div>
      
      {/* Light rays effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[300px] h-[600px] bg-ocean-light opacity-5 rotate-12 blur-3xl transform-gpu"></div>
        <div className="absolute -top-20 right-1/4 w-[200px] h-[500px] bg-ocean-light opacity-5 -rotate-12 blur-3xl transform-gpu"></div>
      </div>
    </div>
  );
};

export default WaterEffect;
