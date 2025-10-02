import { AdMobBanner } from 'expo-ads-admob';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function AdBanner({ forceRealAds }) {
  const [adsActive, setAdsActive] = useState(false);

  useEffect(() => {
    // Aqui você pode verificar se deve mostrar anúncios reais
    // forceRealAds vem do layout, por exemplo
    if (forceRealAds) {
      setAdsActive(true);
    } else {
      setAdsActive(false);
    }
  }, [forceRealAds]);

  if (!adsActive) {
    // Não renderiza nada se não houver anúncios ativos
    return null;
  }

  return (
    <View style={{ alignItems: 'center', height: 50 }}>
      <AdMobBanner
        bannerSize="fullBanner"
        adUnitID="ca-app-pub-xxxxxxxxxxxx/xxxxxxxxxx" // Coloque seu ID real
        servePersonalizedAds={true}
        onDidFailToReceiveAdWithError={(err) => {
          console.log('Ad failed:', err);
          setAdsActive(false); // Oculta banner se não houver anúncio
        }}
      />
    </View>
  );
}
