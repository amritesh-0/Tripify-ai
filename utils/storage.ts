import { Platform } from 'react-native';

// Mock storage utility for web compatibility
export const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    // Would use AsyncStorage on mobile
    return null;
  },
  
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    }
    // Would use AsyncStorage on mobile
  },
  
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    }
    // Would use AsyncStorage on mobile
  }
};

export const isFirstLaunch = async (): Promise<boolean> => {
  const hasLaunched = await storage.getItem('hasLaunched');
  if (!hasLaunched) {
    await storage.setItem('hasLaunched', 'true');
    return true;
  }
  return false;
};