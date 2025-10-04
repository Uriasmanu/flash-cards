import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { AD_IDS } from "../../utils/constants";

export default function AdBanner({ forceRealAds }) {
  const [adsActive, setAdsActive] = useState(false);

  useEffect(() => {
    setAdsActive(forceRealAds && Platform.OS === "android");
  }, [forceRealAds]);

  if (!adsActive) {
    return (
      <View style={{ height: 50, alignItems: "center", justifyContent: "center" }}>
      </View>
    );
  }

  const adUnitId =
    __DEV__ ? AD_IDS.BANNER.TEST : AD_IDS.BANNER.ANDROID;

  return (
    <View style={{ alignItems: "center", marginBottom: 10 }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={(error) => {
          console.log("Ad failed to load:", error);
          setAdsActive(false); 
        }}
      />
    </View>
  );
}
