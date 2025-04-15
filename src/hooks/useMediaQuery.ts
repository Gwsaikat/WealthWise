import { useState, useEffect } from 'react';

/**
 * A hook that returns whether the window matches the given media query
 * @param query The media query to match against
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Create the media query list
    const media = window.matchMedia(query);
    
    // Set the initial value
    setMatches(media.matches);
    
    // Define a callback for when the match status changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add the event listener
    media.addEventListener('change', listener);
    
    // Clean up when the component unmounts
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);
  
  return matches;
} 