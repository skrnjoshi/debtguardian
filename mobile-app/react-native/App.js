import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Alert,
  BackHandler,
} from 'react-native';
import {WebView} from 'react-native-webview';
import SplashScreen from './components/SplashScreen';
import ErrorScreen from './components/ErrorScreen';
import {APP_CONFIG} from './utils/config';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [webViewRef, setWebViewRef] = useState(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Handle Android back button
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  const handleBackPress = () => {
    if (canGoBack && webViewRef) {
      webViewRef.goBack();
      return true; // Prevent default behavior
    }
    return false; // Let system handle back press
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = (syntheticEvent) => {
    const {nativeEvent} = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
    setIsLoading(false);
    setHasError(true);
  };

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
  };

  const handleShouldStartLoadWithRequest = (request) => {
    const {url} = request;
    
    // Allow navigation within our domain
    if (url.includes('debtguardian.onrender.com')) {
      return true;
    }
    
    // For external links, you might want to open in external browser
    // Linking.openURL(url);
    // return false;
    
    return true;
  };

  const retry = () => {
    setHasError(false);
    setIsLoading(true);
    if (webViewRef) {
      webViewRef.reload();
    }
  };

  if (hasError) {
    return <ErrorScreen onRetry={retry} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={APP_CONFIG.primaryColor}
      />
      
      {isLoading && <SplashScreen />}
      
      <View style={styles.webviewContainer}>
        <WebView
          ref={(ref) => setWebViewRef(ref)}
          source={{uri: APP_CONFIG.webAppUrl}}
          style={styles.webview}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          allowsBackForwardNavigationGestures={true}
          mixedContentMode="compatibility"
          originWhitelist={['*']}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563eb',
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default App;
