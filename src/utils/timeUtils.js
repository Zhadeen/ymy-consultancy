export const getGuideLocalTime = (country) => {
  if (!country) return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  // Basic mapping of country names to IANA Time Zones
  const mapping = {
    'Turkey': 'Europe/Istanbul',
    'United Kingdom': 'Europe/London',
    'UK': 'Europe/London',
    'USA': 'America/New_York',
    'United States': 'America/New_York',
    'Nigeria': 'Africa/Lagos',
    'UAE': 'Asia/Dubai',
    'United Arab Emirates': 'Asia/Dubai',
    'France': 'Europe/Paris',
    'Germany': 'Europe/Berlin',
    'Japan': 'Asia/Tokyo',
    'Australia': 'Australia/Sydney',
    'Canada': 'America/Toronto',
    'Brazil': 'America/Sao_Paulo',
    'India': 'Asia/Kolkata',
    'China': 'Asia/Shanghai',
    'South Africa': 'Africa/Johannesburg'
  };
  
  const tz = mapping[country] || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  try {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: tz 
    });
  } catch (e) {
    // Fallback to visitor's local time if timezone is invalid
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
};
