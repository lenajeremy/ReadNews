import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'Gilroy': require('../assets/fonts/Gilroy.ttf'),
          'Gilroy-Bold': require('../assets/fonts/Gilroy-Bold.ttf'),
          'Blatant-Bold': require('../assets/fonts/Blatant-Bold.otf'),
          'Blatant': require('../assets/fonts/Blatant.otf'),
          'Courier': require('../assets/fonts/Courier.ttf')
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
