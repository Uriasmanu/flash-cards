import { Platform, View } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import { AD_IDS } from "../../utils/constants.js";

const AdBanner = () => {
  const getAdUnitID = () => {
    if (__DEV__) {
      return TestIds.BANNER; // ID de teste oficial do Google
    }

    return Platform.select({
      ios: AD_IDS.BANNER.IOS,
      android: AD_IDS.BANNER.ANDROID,
      default: TestIds.BANNER,
    });
  };

  return (
    <View>
      <BannerAd
        unitId={getAdUnitID()}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => console.log("Erro ao carregar anúncio:", error)}
      />
    </View>
  );
};

export default AdBanner;
