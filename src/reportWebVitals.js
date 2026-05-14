/**
 * WEB VITALS PERFORMANCE MONITORING
 * ==================================
 * 
 * This file contains the Web Vitals performance monitoring setup.
 * It measures and reports various performance metrics for the application.
 * 
 * Features:
 * - Core Web Vitals measurement (CLS, FID, FCP, LCP, TTFB)
 * - Dynamic import for better performance
 * - Optional callback function for custom handling
 * - Performance optimization insights
 * 
 * Metrics Measured:
 * - CLS (Cumulative Layout Shift): Visual stability
 * - FID (First Input Delay): Interactivity
 * - FCP (First Contentful Paint): Loading performance
 * - LCP (Largest Contentful Paint): Loading performance
 * - TTFB (Time to First Byte): Server response time
 * 
 * @param {Function} onPerfEntry - Callback function to handle performance metrics
 * @author Your Name
 * @version 1.0.0
 */

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
