import { useState, useEffect } from 'react';

// Custom hook to detect screen size and provide responsive utilities
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: window.innerWidth > 1024,
    isSmallMobile: window.innerWidth <= 480
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        width,
        height,
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024,
        isSmallMobile: width <= 480
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Utility functions
  const getResponsiveValue = (mobile, tablet, desktop) => {
    if (screenSize.isMobile) return mobile;
    if (screenSize.isTablet) return tablet || mobile;
    return desktop || tablet || mobile;
  };

  const getResponsiveClass = (baseClass, mobileClass, tabletClass) => {
    let classes = baseClass;
    if (screenSize.isMobile && mobileClass) classes += ` ${mobileClass}`;
    if (screenSize.isTablet && tabletClass) classes += ` ${tabletClass}`;
    return classes;
  };

  return {
    ...screenSize,
    getResponsiveValue,
    getResponsiveClass
  };
};

// Responsive wrapper component
export const ResponsiveContainer = ({ 
  children, 
  mobileStyle = {}, 
  tabletStyle = {}, 
  desktopStyle = {} 
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  let style = desktopStyle;
  if (isTablet) style = { ...desktopStyle, ...tabletStyle };
  if (isMobile) style = { ...desktopStyle, ...tabletStyle, ...mobileStyle };
  
  return <div style={style}>{children}</div>;
};

// Responsive text component
export const ResponsiveText = ({ 
  children, 
  mobileSize = '14px', 
  tabletSize = '16px', 
  desktopSize = '18px',
  className = '',
  style = {}
}) => {
  const { getResponsiveValue } = useResponsive();
  
  const fontSize = getResponsiveValue(mobileSize, tabletSize, desktopSize);
  
  return (
    <span 
      className={className}
      style={{ fontSize, ...style }}
    >
      {children}
    </span>
  );
};

export default useResponsive;