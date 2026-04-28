export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  photoPath: string | null;
  bio: string | null;
  age: number | null;
  country: string | null;
  languages: string[];
  interests: string[];
  countriesWantConnect: string[];
  isOnboarded: boolean;
  blockedUsers: string[];
  createdAt: string;
}

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  createdAt: string;
  lastMessage: string | null;
  lastMsgAt: string | null;
  otherUser: UserProfile;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
  sender?: {
    displayName: string | null;
    photoPath: string | null;
  };
}

export interface SwipeResult {
  matched: boolean;
  matchId?: string;
}

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bangladesh", "Belarus", "Belgium", "Bolivia",
  "Brazil", "Bulgaria", "Cambodia", "Cameroon", "Canada", "Chile", "China",
  "Colombia", "Croatia", "Cuba", "Czech Republic", "Denmark", "Ecuador",
  "Egypt", "Ethiopia", "Finland", "France", "Georgia", "Germany", "Ghana",
  "Greece", "Guatemala", "Hungary", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kazakhstan", "Kenya",
  "South Korea", "Malaysia", "Mexico", "Morocco", "Myanmar", "Nepal",
  "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Peru",
  "Philippines", "Poland", "Portugal", "Romania", "Russia", "Saudi Arabia",
  "Senegal", "Serbia", "Singapore", "South Africa", "Spain", "Sri Lanka",
  "Sweden", "Switzerland", "Taiwan", "Tanzania", "Thailand", "Tunisia",
  "Turkey", "Uganda", "Ukraine", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Zimbabwe",
];

export const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese",
  "Russian", "Arabic", "Hindi", "Bengali", "Japanese", "Korean",
  "Mandarin Chinese", "Cantonese", "Vietnamese", "Thai", "Turkish",
  "Persian", "Swahili", "Polish", "Dutch", "Swedish", "Norwegian",
  "Danish", "Finnish", "Greek", "Czech", "Romanian", "Hungarian",
  "Indonesian", "Malay", "Tagalog", "Urdu", "Tamil", "Telugu",
  "Marathi", "Punjabi", "Ukrainian", "Serbian", "Croatian", "Bulgarian",
];

export const INTERESTS = [
  "Cultural Exchange", "Language Learning", "Travel", "Food & Cuisine",
  "Music", "Art", "Literature", "History", "Sports", "Photography",
  "Technology", "Gaming", "Movies & TV", "Fashion", "Dance",
  "Cooking", "Hiking", "Yoga", "Meditation", "Politics",
  "Science", "Nature", "Volunteering", "Entrepreneurship", "Education",
];

export const COUNTRY_FLAGS: Record<string, string> = {
  "Afghanistan": "🇦🇫", "Albania": "🇦🇱", "Algeria": "🇩🇿", "Argentina": "🇦🇷",
  "Armenia": "🇦🇲", "Australia": "🇦🇺", "Austria": "🇦🇹", "Azerbaijan": "🇦🇿",
  "Bangladesh": "🇧🇩", "Belarus": "🇧🇾", "Belgium": "🇧🇪", "Bolivia": "🇧🇴",
  "Brazil": "🇧🇷", "Bulgaria": "🇧🇬", "Cambodia": "🇰🇭", "Cameroon": "🇨🇲",
  "Canada": "🇨🇦", "Chile": "🇨🇱", "China": "🇨🇳", "Colombia": "🇨🇴",
  "Croatia": "🇭🇷", "Cuba": "🇨🇺", "Czech Republic": "🇨🇿", "Denmark": "🇩🇰",
  "Ecuador": "🇪🇨", "Egypt": "🇪🇬", "Ethiopia": "🇪🇹", "Finland": "🇫🇮",
  "France": "🇫🇷", "Georgia": "🇬🇪", "Germany": "🇩🇪", "Ghana": "🇬🇭",
  "Greece": "🇬🇷", "Guatemala": "🇬🇹", "Hungary": "🇭🇺", "India": "🇮🇳",
  "Indonesia": "🇮🇩", "Iran": "🇮🇷", "Iraq": "🇮🇶", "Ireland": "🇮🇪",
  "Israel": "🇮🇱", "Italy": "🇮🇹", "Japan": "🇯🇵", "Jordan": "🇯🇴",
  "Kazakhstan": "🇰🇿", "Kenya": "🇰🇪", "South Korea": "🇰🇷", "Malaysia": "🇲🇾",
  "Mexico": "🇲🇽", "Morocco": "🇲🇦", "Myanmar": "🇲🇲", "Nepal": "🇳🇵",
  "Netherlands": "🇳🇱", "New Zealand": "🇳🇿", "Nigeria": "🇳🇬", "Norway": "🇳🇴",
  "Pakistan": "🇵🇰", "Peru": "🇵🇪", "Philippines": "🇵🇭", "Poland": "🇵🇱",
  "Portugal": "🇵🇹", "Romania": "🇷🇴", "Russia": "🇷🇺", "Saudi Arabia": "🇸🇦",
  "Senegal": "🇸🇳", "Serbia": "🇷🇸", "Singapore": "🇸🇬", "South Africa": "🇿🇦",
  "Spain": "🇪🇸", "Sri Lanka": "🇱🇰", "Sweden": "🇸🇪", "Switzerland": "🇨🇭",
  "Taiwan": "🇹🇼", "Tanzania": "🇹🇿", "Thailand": "🇹🇭", "Tunisia": "🇹🇳",
  "Turkey": "🇹🇷", "Uganda": "🇺🇬", "Ukraine": "🇺🇦", "United Kingdom": "🇬🇧",
  "United States": "🇺🇸", "Uruguay": "🇺🇾", "Uzbekistan": "🇺🇿",
  "Venezuela": "🇻🇪", "Vietnam": "🇻🇳", "Zimbabwe": "🇿🇼",
};
